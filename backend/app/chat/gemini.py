"""Google Gemini as Bezra's AI model (Ask Bezra + photo check), used when GEMINI_API_KEY is set.

Same tools, same rules and the same answer shape as the Claude path in bezra.py, so the screens don't change:
  chat()     : function calling over the field's real data (summary, alerts, simulator, calendar, plan,
               irrigation detection, notes), then one JSON answer {text, mood, cards, sources}
  diagnose() : photo check -> {candidates, why, ladder, photo_tip}
REST API (generativelanguage.googleapis.com), key in backend/.env only. Model: GEMINI_MODEL or gemini-3.5-flash (the newest names time out; 2.5 is closed to new keys).
"""
from __future__ import annotations

import copy
import json
import os

import httpx

API = "https://generativelanguage.googleapis.com/v1beta/models"


def model() -> str:
    return os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")


def available() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY"))


def _schema(s: dict) -> dict:
    """JSON schema -> Gemini's OpenAPI subset (no additionalProperties / strict)."""
    s = copy.deepcopy(s)

    def clean(x):
        if isinstance(x, dict):
            x.pop("additionalProperties", None)
            x.pop("strict", None)
            for v in x.values():
                clean(v)
        elif isinstance(x, list):
            for v in x:
                clean(v)
    clean(s)
    return s


FALLBACK = ["gemini-3.5-flash-lite", "gemini-3-flash-preview"]
_last = {"model": None}


def _call(body: dict) -> dict:
    """Gemini is often busy ("high demand", slow answers). Try the main model, then lighter ones."""
    errors = []
    for m in [model()] + [x for x in FALLBACK if x != model()]:
        try:
            r = httpx.post(f"{API}/{m}:generateContent", json=body, timeout=45,
                           headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
        except httpx.TimeoutException:
            errors.append(f"{m}: timeout")
            continue
        if r.status_code in (429, 500, 503, 504):
            errors.append(f"{m}: {r.status_code}")
            continue
        if r.status_code >= 400:
            raise RuntimeError(f"Gemini error {r.status_code}: {r.text[:200]}")
        _last["model"] = m
        return r.json()
    raise RuntimeError("Gemini is busy right now (" + ", ".join(errors) + "). Try again in a minute.")


def _parts(resp: dict) -> list[dict]:
    try:
        return resp["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError):
        return []


def chat(c, history: list[dict], message: str, system: str, tools: list[dict], run_tool, out_schema: dict) -> dict:
    decl = [{"name": t["name"], "description": t["description"], "parameters": _schema(t["input_schema"])} for t in tools]
    for d in decl:  # Gemini rejects an empty properties object
        if not d["parameters"].get("properties"):
            d.pop("parameters")
    contents = [{"role": "model" if h["role"] == "assistant" else "user", "parts": [{"text": h["text"]}]}
                for h in history[-12:] if h.get("text")]
    contents.append({"role": "user", "parts": [{"text": message}]})
    used: list[str] = []
    for _ in range(8):
        resp = _call({"systemInstruction": {"parts": [{"text": system}]}, "contents": contents,
                      "tools": [{"functionDeclarations": decl}], "generationConfig": {"temperature": 0.3}})
        parts = _parts(resp)
        calls = [p["functionCall"] for p in parts if "functionCall" in p]
        if not calls:
            break
        contents.append({"role": "model", "parts": parts})
        answers = []
        for fc in calls:
            used.append(fc["name"])
            try:
                out = run_tool(c, fc["name"], fc.get("args") or {})
            except Exception as e:  # tell the model the tool failed instead of crashing the chat
                out = {"error": str(e)}
            answers.append({"functionResponse": {"name": fc["name"], "response": {"result": json.loads(json.dumps(out, default=str))}}})
        contents.append({"role": "user", "parts": answers})
    # final answer in Bezra's JSON shape, written from everything the tools returned
    draft = "".join(p.get("text", "") for p in _parts(resp))
    if draft:
        contents.append({"role": "model", "parts": [{"text": draft}]})
    contents.append({"role": "user", "parts": [{"text": "Now give your final answer to my last message as JSON in the required shape."}]})
    resp = _call({"systemInstruction": {"parts": [{"text": system}]}, "contents": contents,
                  "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json", "responseSchema": _schema(out_schema)}})
    reply = json.loads("".join(p.get("text", "") for p in _parts(resp)) or "{}")
    reply.setdefault("text", "Sorry, I could not answer. Please ask again.")
    reply.setdefault("mood", "thinking")
    reply.setdefault("cards", [])
    reply.setdefault("sources", [])
    for card in reply["cards"]:
        card.setdefault("items", [])
        card.setdefault("provenance", "estimated")
    return reply | {"tools": used, "model": _last["model"] or model()}


def diagnose(system: str, schema: dict, blobs: list[tuple[str, str]], prompt: str) -> dict:
    parts = [{"inlineData": {"mimeType": mt, "data": b64}} for mt, b64 in blobs] + [{"text": prompt}]
    resp = _call({"systemInstruction": {"parts": [{"text": system}]}, "contents": [{"role": "user", "parts": parts}],
                  "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json", "responseSchema": _schema(schema)}})
    return json.loads("".join(p.get("text", "") for p in _parts(resp)) or "{}")
