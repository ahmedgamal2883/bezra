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


# Farmers and their fields. Coordinates are on cropland (checked against Sentinel-2 greenness in checkpoint 5).
FARMERS = [
    ("hassan@demo.bezra.app", "Hassan Farouk", [FIELDS["north-plot"], FIELDS["south-plot"]]),
    ("samia@demo.bezra.app", "Samia Ibrahim", [field(
        "samia-gharbia", "01", "Canal plot", "Gharbia", "Tanta", 30.8050, 30.9300, 1.8, "wheat", "sakha95",
        "2026-11-05", "tail", 12, "2026-11-17", [("2026-11-05", 420)])]),
    ("ahmed.salah@demo.bezra.app", "Ahmed Salah", [field(
        "ahmed-beheira", "01", "Big field", "Beheira", "Damanhour", 30.9900, 30.4300, 3.0, "wheat", "giza171",
        "2026-11-01", "head", 10, "2026-11-21", [("2026-11-01", 700), ("2026-11-11", 640)])]),
    ("fathy@demo.bezra.app", "Fathy Nour", [field(
        "fathy-fayoum", "01", "Home plot", "Fayoum", "Sinnuris", 29.3800, 30.7800, 1.2, "wheat", "giza171",
        "2026-11-10", "middle", 14, "2026-11-24", [("2026-11-10", 300)])]),
    ("omkarim@demo.bezra.app", "Om Karim", [field(
        "omkarim-minya", "01", "River plot", "Minya", "Minya", 28.1500, 30.7000, 0.9, "wheat", "sakha95",
        "2026-10-28", "head", 10, "2026-11-17", [("2026-10-28", 230), ("2026-11-07", 210)])]),
    ("mahmoud@demo.bezra.app", "Mahmoud Adel", [field(
        "mahmoud-quesna", "01", "East plot", "Menoufia", "Quesna", 30.5600, 31.1400, 2.0, "wheat", "sakha95",
        "2026-11-25", "tail", 10, "2026-12-05", [], prev="cotton")]),
    ("rajesh@demo.bezra.app", "Rajesh Kumar", [field(
        "rajesh-haryana", "01", "Canal field", "Haryana, India", "Hisar", 29.2000, 75.7000, 4.0, "wheat", None,
        "2026-11-12", "middle", 21, "2026-12-03", [("2026-11-12", 900)], prev="rice")]),
    ("wanjiku@demo.bezra.app", "Wanjiku Mwangi", [field(
        "wanjiku-kenya", "01", "Shamba", "Uasin Gishu, Kenya", "Eldoret", 0.5500, 35.3000, 1.0, "maize", None,
        "2026-09-15", "head", 14, "2026-11-20", [("2026-09-15", 250), ("2026-09-25", 200), ("2026-10-09", 220), ("2026-10-24", 260), ("2026-11-06", 300)],
        prev="beans", log=[("weeding", "2026-10-10")])]),
]


def set_env(key: str, value: str) -> None:
    lines = ENV.read_text(encoding="utf-8").splitlines() if ENV.exists() else []
    lines = [l for l in lines if not l.startswith(key + "=")] + [f"{key}={value}"]
    ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    db.init()
    new_pw: list[tuple[str, str, str]] = []

    def user(email: str, name: str, role: str, engineer_id=None) -> dict:
        r = db.find_user(email)
        if r:
            return db.user_public(r)
        # On a server (Render) the database starts empty on every restart: fixed passwords come from settings.
        pw = (os.environ.get("ENGINEER_PASSWORD") if role == "engineer" else None) or              (os.environ.get("DEMO_FARMER_PASSWORD") if email == DEMO_EMAIL else None) or secrets.token_urlsafe(9)
        u = db.create_user(email, name, pw, role, engineer_id)
        new_pw.append((name, email, pw))
        if email == DEMO_EMAIL and not os.environ.get("DEMO_FARMER_PASSWORD"):
            set_env("DEMO_MODE", "1")
            set_env("DEMO_FARMER_EMAIL", email)
            set_env("DEMO_FARMER_PASSWORD", pw)
        return u

    eng = user(*ENGINEER)
    for email, name, flist in FARMERS:
        u = user(email, name, "farmer", eng["id"])
        with db.conn() as c:  # make sure every seeded farmer is assigned to Ahmed
            c.execute("UPDATE users SET engineer_id=? WHERE id=?", (eng["id"], u["id"]))
        for f in flist:
            f = {k: v for k, v in f.items() if k not in ("farmer", "owner_id", "engineer_id")}
            db.save_field(f, u["id"])

    with db.conn() as c:
        n_users = c.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        n_fields = c.execute("SELECT COUNT(*) FROM fields").fetchone()[0]
    print(f"Database ready: {n_users} accounts, {n_fields} fields.")
    if new_pw:
        print("\nNEW PASSWORDS (shown only this once; write them down):")
        for name, email, pw in new_pw:
            print(f"  {name:<16} {email:<30} {pw}")
    else:
        print("No new accounts; passwords unchanged.")


if __name__ == "__main__":
    main()
