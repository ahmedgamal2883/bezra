"""SQLite database (data/bezra.db, git-ignored): users, sessions, fields.

Passwords are hashed with scrypt (Python standard library) and a random salt; never stored in plain text.
Sessions are random tokens kept in an httpOnly cookie.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import time
from pathlib import Path

DATA = Path(__file__).resolve().parents[2] / "data"
DB = DATA / "bezra.db"
SESSION_DAYS = 30


def conn() -> sqlite3.Connection:
    DATA.mkdir(exist_ok=True)
    c = sqlite3.connect(DB, timeout=10)
    c.row_factory = sqlite3.Row
    return c


def init() -> None:
    with conn() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('farmer','engineer','admin')),
            pw TEXT NOT NULL, engineer_id INTEGER REFERENCES users(id), created REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS fields (
            id TEXT PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id), data TEXT NOT NULL, created REAL NOT NULL);
        """)


# ---- passwords -----------------------------------------------------------------------------------
def hash_pw(pw: str) -> str:
    salt = secrets.token_bytes(16)
    h = hashlib.scrypt(pw.encode(), salt=salt, n=2 ** 14, r=8, p=1)
    return f"scrypt${salt.hex()}${h.hex()}"


def check_pw(pw: str, stored: str) -> bool:
    try:
        _, salt, h = stored.split("$")
        got = hashlib.scrypt(pw.encode(), salt=bytes.fromhex(salt), n=2 ** 14, r=8, p=1)
        return hmac.compare_digest(got.hex(), h)
    except ValueError:
        return False


# ---- users / sessions ----------------------------------------------------------------------------
def user_public(r) -> dict:
    return {"id": r["id"], "email": r["email"], "name": r["name"], "role": r["role"], "engineer_id": r["engineer_id"]}


def create_user(email: str, name: str, pw: str, role: str = "farmer", engineer_id: int | None = None) -> dict:
    with conn() as c:
        cur = c.execute("INSERT INTO users (email,name,role,pw,engineer_id,created) VALUES (?,?,?,?,?,?)",
                        (email.lower().strip(), name.strip(), role, hash_pw(pw), engineer_id, time.time()))
        return user_public(c.execute("SELECT * FROM users WHERE id=?", (cur.lastrowid,)).fetchone())


def find_user(email: str):
    with conn() as c:
        return c.execute("SELECT * FROM users WHERE email=?", (email.lower().strip(),)).fetchone()


def new_session(user_id: int) -> str:
    tok = secrets.token_urlsafe(32)
    with conn() as c:
        c.execute("INSERT INTO sessions VALUES (?,?,?)", (tok, user_id, time.time() + SESSION_DAYS * 86400))
    return tok


def session_user(tok: str | None) -> dict | None:
    if not tok:
        return None
    with conn() as c:
        r = c.execute("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?",
                      (tok, time.time())).fetchone()
        return user_public(r) if r else None


def end_session(tok: str | None) -> None:
    if tok:
        with conn() as c:
            c.execute("DELETE FROM sessions WHERE token=?", (tok,))


# ---- fields --------------------------------------------------------------------------------------
def save_field(f: dict, owner_id: int) -> None:
    with conn() as c:
        c.execute("INSERT INTO fields (id,owner_id,data,created) VALUES (?,?,?,?) "
                  "ON CONFLICT(id) DO UPDATE SET data=excluded.data, owner_id=excluded.owner_id",
                  (f["id"], owner_id, json.dumps(f, ensure_ascii=False), time.time()))


def get_field(fid: str) -> dict | None:
    with conn() as c:
        r = c.execute("SELECT f.data, f.owner_id, u.name, u.engineer_id FROM fields f JOIN users u ON u.id=f.owner_id WHERE f.id=?",
                      (fid,)).fetchone()
    if not r:
        return None
    return json.loads(r["data"]) | {"owner_id": r["owner_id"], "farmer": r["name"], "engineer_id": r["engineer_id"]}


def fields_for(user: dict) -> list[dict]:
    """A farmer sees own fields; an engineer sees own + every farmer assigned to them; admin sees all."""
    with conn() as c:
        if user["role"] == "admin":
            rows = c.execute("SELECT id FROM fields ORDER BY created").fetchall()
        elif user["role"] == "engineer":
            rows = c.execute("SELECT f.id FROM fields f JOIN users u ON u.id=f.owner_id "
                             "WHERE u.engineer_id=? OR f.owner_id=? ORDER BY f.created", (user["id"], user["id"])).fetchall()
        else:
            rows = c.execute("SELECT id FROM fields WHERE owner_id=? ORDER BY created", (user["id"],)).fetchall()
    return [get_field(r["id"]) for r in rows]


def can_see(user: dict | None, f: dict | None) -> bool:
    if not user or not f:
        return False
    return (user["role"] == "admin" or f["owner_id"] == user["id"]
            or (user["role"] == "engineer" and f.get("engineer_id") == user["id"]))


def env_flag(name: str) -> bool:
    return os.environ.get(name, "").lower() in ("1", "true", "yes")
