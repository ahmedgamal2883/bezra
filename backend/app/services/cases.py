"""Photo cases (brief §5 V11-Diagnose): POST /cases, GET /cases/{id}, GET /cases/{id}/photo/{n}.

Photo -> candidate list (Claude vision) -> if unsure, sent to the engineer -> treatment ladder (prevention ->
threshold -> official list; the engineer sets any dose) -> follow-up: greenness of that square after 7 days.
Without a Claude API key the case goes straight to the engineer. Photos are kept in data/cases/ (git-ignored).
"""
from __future__ import annotations

import base64
import json
import os
import re
import uuid
from datetime import date, datetime, timedelta
from pathlib import Path

from .. import fields
from ..chat import bezra
from . import satellite
from .context import Ctx

DIR = Path(__file__).resolve().parents[3] / "data" / "cases"
MAX_PHOTOS, MAX_BYTES = 3, 2_000_000

VISION_SCHEMA = {
    "type": "object",
    "properties": {
        "candidates": {"type": "array", "items": {"type": "object", "properties": {
            "name": {"type": "string"}, "pct": {"type": "integer"}}, "required": ["name", "pct"], "additionalProperties": False}},
        "why": {"type": "string"},
        "ladder": {"type": "array", "items": {"type": "object", "properties": {
            "title": {"type": "string"}, "text": {"type": "string"}}, "required": ["title", "text"], "additionalProperties": False}},
        "photo_tip": {"type": "string"},
    },
    "required": ["candidates", "why", "ladder", "photo_tip"], "additionalProperties": False,
}

VISION_SYSTEM = """You help farmers in the Nile Delta check a crop problem from photos. Be careful and honest.
- Give the 3 most likely causes (pests, diseases, nutrient or water problems) with a likelihood in % (sum <= 100).
  If the photo is unclear, keep the likelihoods low; never guess with confidence.
- why: one or two plain sentences on what you see.
- ladder: exactly 4 steps, mildest first: 1 a hand / cultural action, 2 a biological or low-risk option,
  3 the threshold to check before spraying (how to count), 4 "from the official list" with the words
  "your engineer sets the dose". NEVER give amounts, doses, rates, liters, kilos or product brand names.
- photo_tip: how to take a better photo next time.
Plain English, short sentences."""


def _path(cid: str) -> Path:
    if not re.fullmatch(r"[a-f0-9]{12}", cid):
        raise ValueError("bad case id")
    return DIR / cid


def create(c: Ctx, photos: list[str], seen: str = "") -> dict:
    if not photos or len(photos) > MAX_PHOTOS:
        raise ValueError(f"Send 1 to {MAX_PHOTOS} photos")
    cid = uuid.uuid4().hex[:12]
    d = _path(cid)
    d.mkdir(parents=True)
    blobs = []
    for i, p in enumerate(photos):
        m = re.match(r"data:(image/(?:jpeg|png|webp));base64,(.+)", p, re.S)
        if not m:
            raise ValueError("Photos must be JPEG, PNG or WebP")
        raw = base64.b64decode(m.group(2))
        if len(raw) > MAX_BYTES:
            raise ValueError("Photo too large")
        ext = m.group(1).split("/")[1].replace("jpeg", "jpg")
        (d / f"photo_{i}.{ext}").write_bytes(raw)
        blobs.append((m.group(1), m.group(2)))
    try:
        nd = satellite.ndvi(c)
    except Exception:
        nd = {}
    spot = nd.get("weak_spot") if nd.get("available") else None
    meta = {"id": cid, "field_id": c.f["id"], "created": datetime.now().isoformat(timespec="minutes"),
            "seen": seen[:80], "photos": len(photos), "square": spot["squares"][0] if spot else None,
            "where": spot["where"] if spot else "Whole field",
            "start_ndvi": _square_ndvi(nd, spot["squares"][0] if spot else None), "start_image": nd.get("date")}
    meta |= _diagnose(c, blobs, seen)
    (d / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    return get(c, cid)


def _square_ndvi(nd: dict, sq) -> float | None:
    if not nd.get("available"):
        return None
    cells = nd["indices"]["ndvi"]["cells"]
    if sq:
        v = next((x["value"] for x in cells if [x["r"], x["c"]] == list(sq)), None)
        return v
    return nd["indices"]["ndvi"]["median"]


def _diagnose(c: Ctx, blobs, seen: str) -> dict:
    if not bezra.available():
        return {"status": "sent_to_engineer", "reason": "no_model", "candidates": [], "why": "", "ladder": [], "photo_tip": ""}
    import anthropic
    from ..chat import gemini
    crop = fields.CROP_LABEL[c.f["crop"]]
    if gemini.available():
        try:
            out = gemini.diagnose(VISION_SYSTEM, VISION_SCHEMA, list(blobs),
                                  f"Crop: {crop}, sown {c.f['sow_date']}, today {c.today}. Farmer says: {seen or 'nothing'}. What might this be?")
        except Exception as e:
            return {"status": "sent_to_engineer", "reason": f"model_error {str(e)[:60]}", "candidates": [], "why": "", "ladder": [], "photo_tip": ""}
        out.setdefault("candidates", []); out.setdefault("ladder", []); out.setdefault("why", ""); out.setdefault("photo_tip", "")
        out["ladder"] = [s for s in out["ladder"] if not bezra.DOSE.search(s.get("title", "") + " " + s.get("text", ""))][:4]
        out["candidates"] = sorted(out["candidates"], key=lambda x: -x.get("pct", 0))[:3]
        sure = bool(out["candidates"]) and out["candidates"][0]["pct"] >= 70
        return out | {"status": "predicted" if sure else "sent_to_engineer", "reason": "" if sure else "unsure", "model": gemini.model()}
    content = [{"type": "image", "source": {"type": "base64", "media_type": mt, "data": b64}} for mt, b64 in blobs]
    content.append({"type": "text", "text": f"Crop: {crop}, sown {c.f['sow_date']}, today {c.today}. "
                                            f"Farmer says: {seen or 'nothing'}. What might this be?"})
    try:
        resp = anthropic.Anthropic().messages.create(
            model=bezra.MODEL, max_tokens=8000, system=VISION_SYSTEM, messages=[{"role": "user", "content": content}],
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": VISION_SCHEMA}})
    except anthropic.APIError as e:
        return {"status": "sent_to_engineer", "reason": f"model_error {getattr(e, 'status_code', '')}", "candidates": [], "why": "", "ladder": [], "photo_tip": ""}
    if resp.stop_reason == "refusal":
        return {"status": "sent_to_engineer", "reason": "refusal", "candidates": [], "why": "", "ladder": [], "photo_tip": ""}
    out = json.loads(next(b.text for b in resp.content if b.type == "text"))
    # Rule #3: drop any step that still contains an amount
    out["ladder"] = [s for s in out["ladder"] if not bezra.DOSE.search(s["title"] + " " + s["text"])][:4]
    out["candidates"] = sorted(out["candidates"], key=lambda x: -x["pct"])[:3]
    sure = bool(out["candidates"]) and out["candidates"][0]["pct"] >= 70
    return out | {"status": "predicted" if sure else "sent_to_engineer", "reason": "" if sure else "unsure"}


def get(c: Ctx, cid: str) -> dict:
    meta = json.loads((_path(cid) / "meta.json").read_text(encoding="utf-8"))
    created = datetime.fromisoformat(meta["created"]).date()
    due = created + timedelta(days=7)
    follow = {"due": due.isoformat(), "ready": c.today >= due, "change": None, "image": None}
    if meta.get("start_ndvi") is not None:
        try:
            nd = satellite.ndvi(c)
            if nd.get("available") and nd["date"] > (meta.get("start_image") or ""):
                now = _square_ndvi(nd, meta.get("square"))
                if now is not None:
                    follow |= {"change": round(now - meta["start_ndvi"], 3), "image": nd["date"]}
        except Exception:
            pass
    return meta | {"follow_up": follow}


def field_of(cid: str) -> str:
    return json.loads((_path(cid) / "meta.json").read_text(encoding="utf-8"))["field_id"]


def photo_path(cid: str, n: int) -> Path | None:
    d = _path(cid)
    for ext in ("jpg", "png", "webp"):
        p = d / f"photo_{n}.{ext}"
        if p.exists():
            return p
    return None
