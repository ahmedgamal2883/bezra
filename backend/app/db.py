"""Bezra's database: users, sessions, fields, key-value state, photo blobs and the satellite/weather time series.

Two engines, same SQL:
  * DATABASE_URL set (production, Supabase Postgres session pooler) -> Postgres via psycopg 3.
    The URL is read from the environment only; it is never logged or written anywhere.
  * otherwise (local dev, tests) -> SQLite file data/bezra.db (git-ignored).
Queries are written with "?" placeholders; for Postgres they become "%s".

Passwords are hashed with scrypt and a random salt; sessions are random tokens kept in an httpOnly cookie.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import threading
import time
from contextlib import contextmanager
from pathlib import Path

DATA = Path(__file__).resolve().parents[2] / "data"
DB = DATA / "bezra.db"
SESSION_DAYS = 30


def _url() -> str:
    return os.environ.get("DATABASE_URL", "").strip()


def engine() -> str:
    return "postgres" if _url() else "sqlite"


# ---- connections ---------------------------------------------------------------------------------
class _Conn:
    """A thin wrapper so SQLite and Postgres connections answer the same calls:
    execute(sql with ?, params) -> cursor whose rows are dicts; commit on exit."""

    def __init__(self, raw, pg: bool):
        self.raw, self.pg = raw, pg

    def execute(self, sql: str, params=()):
        if self.pg:
            cur = self.raw.cursor()
            cur.execute(sql.replace("?", "%s"), params)
            return cur
        return self.raw.execute(sql, params)


_pg_pool = None
_pg_lock = threading.Lock()


def _pg_connect():
    global _pg_pool
    import psycopg
    from psycopg.rows import dict_row
    with _pg_lock:
        if _pg_pool is None:
            try:
                from psycopg_pool import ConnectionPool
                _pg_pool = ConnectionPool(_url(), min_size=1, max_size=5, kwargs={"row_factory": dict_row,
                                                                                    "prepare_threshold": None},
                                          open=True)
            except ImportError:
                _pg_pool = False
    if _pg_pool:
        return _pg_pool.connection()
    # no pool package: one short connection per call (prepare_threshold=None works with Supabase's pooler)
    return psycopg.connect(_url(), row_factory=dict_row, prepare_threshold=None)


@contextmanager
def conn():
    if _url():
        with _pg_connect() as raw:
            yield _Conn(raw, True)
            raw.commit()
    else:
        DATA.mkdir(exist_ok=True)
        raw = sqlite3.connect(DB, timeout=10)
        raw.row_factory = sqlite3.Row
        try:
            with raw:
                yield _Conn(raw, False)
        finally:
            raw.close()


_SCHEMA = [
    """CREATE TABLE IF NOT EXISTS users (
        id {serial} PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('farmer','engineer','admin')),
        pw TEXT NOT NULL, engineer_id INTEGER REFERENCES users(id), created DOUBLE PRECISION NOT NULL)""",
    """CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires DOUBLE PRECISION NOT NULL)""",
    """CREATE TABLE IF NOT EXISTS fields (
        id TEXT PRIMARY KEY, owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        data TEXT NOT NULL, created DOUBLE PRECISION NOT NULL)""",
    # small JSON state that used to live in data/*.json (approvals, job state, API status, case metadata)
    """CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated DOUBLE PRECISION NOT NULL)""",
    # farmer photos (used to live in data/cases/)
    """CREATE TABLE IF NOT EXISTS blobs (k TEXT PRIMARY KEY, mime TEXT NOT NULL, data {bytes} NOT NULL,
        created DOUBLE PRECISION NOT NULL)""",
    # Phase 3: stored time series per field (one row per field, kind, day), filled by the refresh job
    """CREATE TABLE IF NOT EXISTS series (
        field_id TEXT NOT NULL, kind TEXT NOT NULL, day TEXT NOT NULL, v TEXT NOT NULL,
        source TEXT NOT NULL, fetched DOUBLE PRECISION NOT NULL, PRIMARY KEY (field_id, kind, day))""",
    "CREATE INDEX IF NOT EXISTS series_by_field ON series (field_id, kind, day)",
]


def init() -> None:
    pg = engine() == "postgres"
    with conn() as c:
        for s in _SCHEMA:
            c.execute(s.format(serial="SERIAL" if pg else "INTEGER", bytes="BYTEA" if pg else "BLOB"))


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
        r = c.execute("INSERT INTO users (email,name,role,pw,engineer_id,created) VALUES (?,?,?,?,?,?) RETURNING *",
                      (email.lower().strip(), name.strip(), role, hash_pw(pw), engineer_id, time.time())).fetchone()
        return user_public(r)


def find_user(email: str):
    with conn() as c:
        return c.execute("SELECT * FROM users WHERE email=?", (email.lower().strip(),)).fetchone()


def update_user(uid: int, **cols) -> None:
    ok = {k: v for k, v in cols.items() if k in ("name", "role", "pw", "engineer_id")}
    if ok:
        with conn() as c:
            c.execute(f"UPDATE users SET {', '.join(k + '=?' for k in ok)} WHERE id=?", (*ok.values(), uid))


def delete_user(uid: int) -> None:
    with conn() as c:
        ids = [r["id"] for r in c.execute("SELECT id FROM fields WHERE owner_id=?", (uid,)).fetchall()]
        for fid in ids:
            c.execute("DELETE FROM series WHERE field_id=?", (fid,))
        c.execute("DELETE FROM fields WHERE owner_id=?", (uid,))
        c.execute("DELETE FROM sessions WHERE user_id=?", (uid,))
        c.execute("DELETE FROM users WHERE id=?", (uid,))


def new_session(user_id: int) -> str:
    tok = secrets.token_urlsafe(32)
    with conn() as c:
        c.execute("INSERT INTO sessions (token,user_id,expires) VALUES (?,?,?)",
                  (tok, user_id, time.time() + SESSION_DAYS * 86400))
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


def delete_field(fid: str) -> None:
    with conn() as c:
        c.execute("DELETE FROM series WHERE field_id=?", (fid,))
        c.execute("DELETE FROM fields WHERE id=?", (fid,))


def get_field(fid: str) -> dict | None:
    with conn() as c:
        r = c.execute("SELECT f.data, f.owner_id, u.name, u.engineer_id FROM fields f JOIN users u ON u.id=f.owner_id "
                      "WHERE f.id=?", (fid,)).fetchone()
    if not r:
        return None
    return json.loads(r["data"]) | {"owner_id": r["owner_id"], "farmer": r["name"], "engineer_id": r["engineer_id"]}


def all_field_ids() -> list[str]:
    with conn() as c:
        return [r["id"] for r in c.execute("SELECT id FROM fields ORDER BY created").fetchall()]


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


# ---- key-value JSON state ------------------------------------------------------------------------
def kv_get(k: str, default=None):
    with conn() as c:
        r = c.execute("SELECT v FROM kv WHERE k=?", (k,)).fetchone()
    return json.loads(r["v"]) if r else default


def kv_set(k: str, v) -> None:
    with conn() as c:
        c.execute("INSERT INTO kv (k,v,updated) VALUES (?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v, "
                  "updated=excluded.updated", (k, json.dumps(v, ensure_ascii=False), time.time()))


# ---- blobs (photos) ------------------------------------------------------------------------------
def blob_put(k: str, mime: str, data: bytes) -> None:
    with conn() as c:
        c.execute("INSERT INTO blobs (k,mime,data,created) VALUES (?,?,?,?) ON CONFLICT(k) DO UPDATE SET "
                  "mime=excluded.mime, data=excluded.data", (k, mime, data, time.time()))


def blob_get(k: str) -> tuple[str, bytes] | None:
    with conn() as c:
        r = c.execute("SELECT mime, data FROM blobs WHERE k=?", (k,)).fetchone()
    return (r["mime"], bytes(r["data"])) if r else None


# ---- time series (Phase 3 refresh job) -----------------------------------------------------------
def series_put(field_id: str, kind: str, rows: list[dict], source: str) -> int:
    """rows: [{"date": "YYYY-MM-DD", ...values}]. Upserts one row per day; returns how many were written."""
    now = time.time()
    with conn() as c:
        for r in rows:
            c.execute("INSERT INTO series (field_id,kind,day,v,source,fetched) VALUES (?,?,?,?,?,?) "
                      "ON CONFLICT(field_id,kind,day) DO UPDATE SET v=excluded.v, source=excluded.source, "
                      "fetched=excluded.fetched",
                      (field_id, kind, r["date"], json.dumps({k: v for k, v in r.items() if k != "date"}), source, now))
    return len(rows)


def series_get(field_id: str, kind: str, since: str = "") -> list[dict]:
    with conn() as c:
        rows = c.execute("SELECT day, v, source, fetched FROM series WHERE field_id=? AND kind=? AND day>=? ORDER BY day",
                         (field_id, kind, since)).fetchall()
    return [{"date": r["day"], **json.loads(r["v"]), "source": r["source"], "fetched": r["fetched"]} for r in rows]


def series_latest(field_id: str, kind: str) -> dict | None:
    with conn() as c:
        r = c.execute("SELECT day, v, source, fetched FROM series WHERE field_id=? AND kind=? ORDER BY day DESC LIMIT 1",
                      (field_id, kind)).fetchone()
    return {"date": r["day"], **json.loads(r["v"]), "source": r["source"], "fetched": r["fetched"]} if r else None


def env_flag(name: str) -> bool:
    return os.environ.get(name, "").lower() in ("1", "true", "yes")
