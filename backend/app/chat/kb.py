"""Small knowledge base for search_kb: the V11 About screen (sources, labels), the season plan
(timing only) and plain explanations. Bezra quotes these instead of inventing facts."""
from __future__ import annotations

KB = [
    {"id": "ndvi", "title": "What NDVI means", "source": "NASA HLS v2.0",
     "text": "NDVI is a greenness score from satellite light (red and near infrared), from about 0 to 1. "
             "Healthy wheat at tillering is often 0.5 to 0.7. Bezra compares each 30 m square with the rest of "
             "your field: 'Less green' means 0.05 lower than your field's middle value. The satellite cannot "
             "say why a square is weak; go and look."},
    {"id": "early-sowing", "title": "Why sow wheat earlier", "source": "Bezra yield model on NASA POWER",
     "text": "Wheat fills its grain in March and April. Hot days over 32 °C at grain fill make the grain smaller. "
             "Your springs have more hot days than in the 1990s. Sowing earlier moves grain fill before the "
             "worst heat. Bezra's model on 36 seasons of NASA POWER: sowing on 1 December costs about 14% and "
             "1 January about 42% compared with the best date (about 1 November)."},
    {"id": "water-balance", "title": "How Bezra estimates soil water", "source": "FAO-56",
     "text": "Bezra keeps a water balance for the root zone (FAO-56): each day the crop uses Kc x ET0 (ET0 from "
             "NASA POWER weather), rain adds water, your watering refills it. Heavy clay holds about 180 mm per "
             "metre of roots. The refill point is 50%. Below it the crop starts to suffer. This is an estimate: "
             "the soil type is a first guess until a lab test."},
    {"id": "rust", "title": "Yellow rust weather", "source": "Bezra rule (to verify with ARC)",
     "text": "Yellow rust likes cool, damp nights: mean temperature 7 to 18 °C with humidity over 85% or dew. "
             "3 or 4 such days in a week is Medium risk, 5 or more is High. Walk the field and look for yellow "
             "stripes of powder on the leaves, mostly from January to March."},
    {"id": "heat", "title": "Heat at grain fill", "source": "Bezra yield model",
     "text": "Each day over 32 °C during heading and grain filling cuts the harvest by about 3% (34 °C counts "
             "1.6 times). A light water turn 2 days before a heat wave cools the crop."},
    {"id": "sources", "title": "Where Bezra's numbers come from", "source": "About the data",
     "text": "NASA POWER: daily heat, humidity, wind, sun, rain since 1990 (about 50 km, 2 to 5 days late). "
             "Open-Meteo: the last days and the next 7 days. NASA HLS: greenness every 30 m (coming soon). "
             "SMAP: root zone moisture (coming soon). GPM IMERG: rain that already fell. Labels: Satellite = "
             "straight from NASA or ESA; Estimated = calculated by Bezra; Farmer = you told us; Demo = placeholder."},
    {"id": "plan", "title": "Season plan for wheat (timing only)", "source": "Season plan",
     "text": "Variety chosen in September. Sow by mid November. First water after sowing. Do not skip water "
             "turns at tillering. Keep the field free of weeds until about 10 December. Second nitrogen dose "
             "around early December: timing only, your engineer sets the amount. Scout for yellow rust from 10 "
             "January to 28 February. Water before forecast heat in April. Harvest before the khamaseen winds."},
    {"id": "doses", "title": "Fertilizer and pesticide amounts", "source": "Bezra rules",
     "text": "Bezra never gives fertilizer or pesticide amounts or doses. Your engineer (Eng. Mona Adel, "
             "Shibin El Kom extension) decides them after seeing the field. Bezra can tell you when, not how much."},
    {"id": "simulator", "title": "How the simulator works", "source": "Bezra simulator",
     "text": "The simulator runs your choices (sowing date, variety, watering, normal year or hot spring) on the "
             "real NASA POWER weather of past seasons and gives the expected harvest as a share of what your "
             "field can give. Nothing changes on your real field."},
]


def search(query: str, k: int = 3) -> list[dict]:
    words = {w for w in query.lower().replace("?", " ").split() if len(w) > 2}
    ar = {"ندفي": "ndvi", "صدأ": "rust", "صدا": "rust", "حر": "heat", "ري": "water", "مية": "water",
          "سماد": "doses", "مبيد": "doses", "بدري": "early", "أزرع": "sowing", "محاكي": "simulator"}
    for a, e in ar.items():
        if a in query:
            words.add(e)
    scored = []
    for doc in KB:
        hay = (doc["id"] + " " + doc["title"] + " " + doc["text"]).lower()
        s = sum(hay.count(w) for w in words)
        if s:
            scored.append((s, doc))
    scored.sort(key=lambda x: -x[0])
    return [d for _, d in scored[:k]] or KB[:1]
