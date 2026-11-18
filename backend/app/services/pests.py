"""What to watch for now: pests and diseases of the field's crop that are in season in the Delta, and how much this
week's weather favours them. Each comes with what to look for. Never a spray product or dose (the engineer decides).

Seasons and weather that favour each one: ARC Plant Protection Research Institute and Plant Pathology Research
Institute crop calendars for the Delta (old lands). Weather: the last 7 days and the next 7 (NASA POWER / Open-Meteo).
A night is 'wet' when Tmin comes within 2 C of the dew point (dew on the leaves)."""
from __future__ import annotations

from .context import Ctx

# crop -> [(name, months, needs(day) -> bool, what to check, harvest % it can take)]
def _warm(lo, hi=99):
    return lambda r: lo <= r["tmean"] <= hi


def _wet(lo, hi):
    return lambda r: lo <= r["tmean"] <= hi and r.get("tmin", r["tmean"]) - r["dew"] <= 2


def _humid(lo, hi, rh=70):
    return lambda r: lo <= r["tmean"] <= hi and r["rh"] >= rh


def _hotdry(tmax=32, rh=55):
    return lambda r: r["tmax"] >= tmax and r["rh"] <= rh


RULES: dict[str, list[tuple]] = {
    "wheat": [
        ("Cutworms and armyworms", (11, 12), _warm(14), "Walk the rows in the evening: look for young plants cut at the soil and eaten leaves.", 4),
        ("Aphids", (12, 1, 2, 3), _warm(12, 25), "Look under the leaves and on the ears for small green insects in groups.", 5),
        ("Leaf rust (brown rust)", (2, 3, 4), _wet(15, 25), "Look for small round orange-brown spots on the upper leaves.", 8),
        ("Powdery mildew", (1, 2, 3), _humid(12, 20), "Look for white powder on the lower leaves and stems.", 4),
    ],
    "maize": [
        ("Fall armyworm", (6, 7, 8, 9, 10), _warm(22), "Look inside the leaf funnel for holes and sawdust-like droppings.", 10),
    ],
    "rice": [
        ("Rice blast", (7, 8), _wet(24, 30), "Look for grey diamond-shaped spots on the leaves and dark necks on the panicles.", 10),
        ("Rice stem borer", (7, 8, 9), _warm(24), "Look for dead centre shoots and white empty panicles.", 5),
    ],
    "cotton": [
        ("Cotton leafworm", (5, 6, 7, 8), _warm(24), "Look under the leaves for egg masses and young caterpillars eating the leaf.", 8),
        ("Pink bollworm", (7, 8, 9), _warm(25), "Open a few green bolls: look for small pink larvae and rosette flowers.", 10),
        ("Whitefly", (7, 8, 9), _hotdry(), "Shake a plant: small white flies rise; look for sticky leaves.", 4),
    ],
    "berseem": [
        ("Cotton leafworm", (2, 3, 4, 5), _warm(18), "Look under the leaves for egg masses and eaten leaves before each cut.", 6),
        ("Aphids", (1, 2, 3), _warm(12, 25), "Look at the tips of the stems for groups of small insects.", 4),
    ],
    "faba": [
        ("Chocolate spot", (12, 1, 2), _wet(10, 20), "Look for small chocolate-brown spots on the leaves and flowers.", 10),
        ("Aphids", (1, 2, 3), _warm(12, 25), "Look at the stem tips and flowers for black insects in groups.", 5),
        ("Broomrape (orobanche)", (1, 2, 3), _warm(10), "Look around the plants for purple or yellow shoots coming out of the soil.", 8),
    ],
    "sugarbeet": [
        ("Beet fly", (12, 1, 2), _warm(10, 20), "Look for blisters (mines) on the young leaves.", 5),
        ("Cercospora leaf spot", (3, 4, 5), _wet(18, 30), "Look for small round grey spots with a red edge on the leaves.", 8),
    ],
}
RULES["fahl"] = RULES["berseem"]
SOURCE = "Delta pest calendar (ARC) + this week's weather"


def watch(c: Ctx) -> list[dict]:
    if c.today < c.sow:
        return []
    rules = RULES.get(c.f["crop"], [])
    if not rules:
        return []
    days = list(c.w.recent_days(7)) + [d for d in c.w.forecast_days(8) if d["date"] > c.today.isoformat()][:7]
    out = []
    for name, months, needs, check, loss in rules:
        if c.today.month not in months:
            continue
        n = sum(1 for r in days if _ok(needs, r))
        level = "Likely now" if n >= 5 else ("Possible" if n >= 2 else "Low")
        if level == "Low":
            continue
        out.append({"name": name, "level": level, "favourable_days": n, "check": check, "harvest_pct": loss,
                    "why": f"{name} is in season now, and {n} of these 14 days suit it.", "source": SOURCE})
    return sorted(out, key=lambda x: -x["favourable_days"])


def _ok(fn, r) -> bool:
    try:
        return bool(fn(r))
    except (KeyError, TypeError):
        return False
