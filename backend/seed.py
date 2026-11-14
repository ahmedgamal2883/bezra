"""Seed the demo accounts and fields (Phase 2 brief §D). Safe to run again: existing users keep their
passwords, fields are updated in place.

    .venv/Scripts/python seed.py

Prints new passwords ONCE. Nothing secret is written to git: the database lives in data/ (ignored) and the
demo farmer's password goes into backend/.env (ignored) so the Landing page can show it in demo mode.
"""
from __future__ import annotations

import os
import secrets
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from app import config, db  # noqa: E402  (config loads backend/.env)
from app.fields import FIELDS  # noqa: E402

ENV = Path(__file__).parent / ".env"
ENGINEER = ("ahmed@bezra.app", "Ahmed Gamal", "engineer")
DEMO_EMAIL = "hassan@demo.bezra.app"


def field(fid, num, name, gov, village, lat, lon, area, crop, variety, sow, mesqa, turn, next_turn, waterings, prev="maize", log=()):
    return {"id": fid, "num": num, "name": name, "governorate": gov, "village": village, "lat": lat, "lon": lon,
            "area_feddan": area, "crop": crop, "variety": variety, "sow_date": sow, "prev_crop": prev,
            "prev_crop_harvest": None, "water_source": f"Mesqa, {mesqa} end" if mesqa != "middle" else "Mesqa, middle",
            "mesqa_position": mesqa, "turn_days": turn, "next_turn": next_turn,
            "waterings": [{"date": d, "m3": m} for d, m in waterings], "tenure": "owner", "soil": "clay",
            "log": [{"kind": k, "date": d, "source": "You"} for k, d in log]}


# Farmers and their fields, all on Delta cropland (ESA WorldCover: 100% cropland in every square, checked 14 Nov 2026).
FARMERS = [
    ("hassan@demo.bezra.app", "Hassan Farouk", [FIELDS["north-plot"], FIELDS["south-plot"]]),
    ("samia@demo.bezra.app", "Samia Ibrahim", [field(
        "samia-gharbia", "01", "Canal plot", "Gharbia", "Tanta", 30.8050, 30.9300, 1.8, "wheat", "sakha95",
        "2026-11-05", "tail", 12, "2026-11-17", [("2026-11-05", 420)])]),
    ("ahmed.salah@demo.bezra.app", "Ahmed Salah", [field(
        "ahmed-beheira", "01", "Big field", "Beheira", "Damanhour", 30.9900, 30.4300, 3.0, "wheat", "giza171",
        "2026-11-01", "head", 10, "2026-11-21", [("2026-11-01", 700), ("2026-11-11", 640)])]),
    ("mahmoud@demo.bezra.app", "Mahmoud Adel", [field(
        "mahmoud-quesna", "01", "East plot", "Menoufia", "Quesna", 30.5600, 31.1400, 2.0, "wheat", "sakha95",
        "2026-11-25", "tail", 10, "2026-12-05", [], prev="cotton")]),
    ("ibrahim@demo.bezra.app", "Ibrahim Zaki", [field(
        "ibrahim-kafr", "01", "Rice-side plot", "Kafr El Sheikh", "Sidi Salem", 31.1500, 30.9300, 2.5, "wheat", "giza171",
        "2026-10-25", "tail", 10, "2026-11-14", [("2026-10-25", 650), ("2026-11-04", 600)], prev="rice", log=[("fertilizer", "2026-11-03")])]),
    ("nadia@demo.bezra.app", "Nadia Fouad", [field(
        "nadia-dakahlia", "01", "Old orchard edge", "Dakahlia", "Mit Ghamr", 30.9800, 31.3700, 1.5, "wheat", "sakha95",
        "2026-11-08", "middle", 12, "2026-11-20", [("2026-11-08", 380)])]),
    ("fathy@demo.bezra.app", "Fathy Nour", [field(
        "fathy-sharqia", "01", "Home plot", "Sharqia", "Zagazig", 30.6500, 31.5500, 1.2, "wheat", "giza171",
        "2026-10-30", "head", 10, "2026-11-19", [("2026-10-30", 300)])]),
    ("omkarim@demo.bezra.app", "Om Karim", [field(
        "omkarim-qalyubia", "01", "River plot", "Qalyubia", "Benha", 30.3800, 31.1800, 0.9, "wheat", "sakha95",
        "2026-10-28", "head", 10, "2026-11-17", [("2026-10-28", 230), ("2026-11-07", 210)])]),
]
DEMO_DOMAIN = "@demo.bezra.app"
APPROVALS = {  # the engineer's plan approvals (date + note), as he gave them
    "north-plot": {"at": "2026-11-02T10:30", "by": "Ahmed Gamal",
                   "note": "Good start. Catch up the missed turn this week. I will set the nitrogen amount when I visit on Tuesday."},
    "samia-gharbia": {"at": "2026-11-09T12:00", "by": "Ahmed Gamal", "note": "Plan fine. Watch the tail end of the mesqa."},
    "ibrahim-kafr": {"at": "2026-11-06T09:15", "by": "Ahmed Gamal", "note": "After rice, keep the first turns light."},
}


def set_env(key: str, value: str) -> None:
    lines = ENV.read_text(encoding="utf-8").splitlines() if ENV.exists() else []
    lines = [l for l in lines if not l.startswith(key + "=")] + [f"{key}={value}"]
    ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main(argv: list[str] | None = None) -> None:
    """Seed (or with --reset: restore) the demo accounts. Safe to run any number of times."""
    from app.demo import hassan
    argv = sys.argv[1:] if argv is None else argv
    reset = "--reset" in argv
    db.init()
    new_pw: list[tuple[str, str, str]] = []
    env_pw = {ENGINEER[0]: os.environ.get("ENGINEER_PASSWORD"), DEMO_EMAIL: os.environ.get("DEMO_FARMER_PASSWORD")}

    def user(email: str, name: str, role: str, engineer_id=None) -> dict:
        r = db.find_user(email)
        want = env_pw.get(email)
        if r:
            if want and not db.check_pw(want, r["pw"]):  # the password in settings wins (so it can be changed)
                db.update_user(r["id"], pw=db.hash_pw(want))
            return db.user_public(r)
        pw = want or secrets.token_urlsafe(12)
        u = db.create_user(email, name, pw, role, engineer_id)
        new_pw.append((name, email, "(from settings)" if want else pw))  # never print a password set in settings
        if email == DEMO_EMAIL and not want:
            set_env("DEMO_MODE", "1")
            set_env("DEMO_FARMER_EMAIL", email)
            set_env("DEMO_FARMER_PASSWORD", pw)
        return u

    # demo accounts that are no longer in the list (and their fields) are removed
    keep = {e for e, _, _ in FARMERS} | {ENGINEER[0]}
    with db.conn() as c:
        old = [r["id"] for r in c.execute("SELECT id, email FROM users").fetchall()
               if r["email"].endswith(DEMO_DOMAIN) and r["email"] not in keep]
    for uid in old:
        db.delete_user(uid)

    eng = user(*ENGINEER)
    hassan_id = None
    for email, name, flist in FARMERS:
        u = user(email, name, "farmer", eng["id"])
        if email == DEMO_EMAIL:
            hassan_id = u["id"]
        with db.conn() as c:  # every seeded farmer is assigned to the engineer
            c.execute("UPDATE users SET engineer_id=? WHERE id=?", (eng["id"], u["id"]))
        # fields this demo farmer no longer has (e.g. moved to the Delta) are removed
        want_ids = {x["id"] for x in flist}
        with db.conn() as c:
            stale = [r["id"] for r in c.execute("SELECT id FROM fields WHERE owner_id=?", (u["id"],)).fetchall() if r["id"] not in want_ids]
        for fid in stale:
            db.delete_field(fid)
        for f in flist:
            f = {k: v for k, v in f.items() if k not in ("farmer", "owner_id", "engineer_id")}
            if f["id"] == "north-plot":  # the judges' field: this season's activity + the complete last season
                import copy
                f = hassan.last_season(hassan.this_season(copy.deepcopy(f)))
            db.save_field(f, u["id"])

    # the engineer's approvals and Hassan's earlier Ask Bezra questions (real Gemini answers, saved once)
    approvals = db.kv_get("approvals", {}) or {}
    for fid in [x["id"] for _, _, fl in FARMERS for x in fl]:
        approvals.pop(fid, None)
    approvals.update(APPROVALS)
    db.kv_set("approvals", approvals)
    if hassan_id:
        db.kv_set(f"chat:{hassan_id}:north-plot", hassan.chats())

    with db.conn() as c:
        n_users = c.execute("SELECT COUNT(*) AS n FROM users").fetchone()["n"]
        n_fields = c.execute("SELECT COUNT(*) AS n FROM fields").fetchone()["n"]
    print(f"Database ready{' (demo accounts restored)' if reset else ''}: {n_users} accounts, {n_fields} fields.")
    if new_pw:
        print()
        print("NEW PASSWORDS (shown only this once; write them down):")
        for name, email, pw in new_pw:
            print(f"  {name:<16} {email:<30} {pw}")
    else:
        print("No new accounts; passwords follow ENGINEER_PASSWORD / DEMO_FARMER_PASSWORD in settings.")


if __name__ == "__main__":
    main()
