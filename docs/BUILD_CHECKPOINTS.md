# Bezra: everything left, in build order (checkpoints)

One list for all remaining work: the rest of `FIELD_SHIFT_PLAN.md` (R items) and the new ideas from `WIN_PLAN.md` (N items).

**Order rule:** the most visible gain for the judges first, cheapest first within a checkpoint.

**At each checkpoint:**
- tests pass;
- checked in the browser (desktop + phone, EN + AR);
- the user says "push" before anything goes live.

**Live-site rule:** judging is open after 15 Nov. Never break the demo account, and ask the Cairo Local Lead before big changes.

Status: ⬜ not started · ◐ in progress · ✅ done · 👤 needs a person (the team), not code

---

## CP1: Close the loose ends (½ day)
| # | Item | Done when |
|---|---|---|
| R10 | A soil test typed on the Rotation screen is **saved to the field** (EC and organic matter) and used everywhere | Reload: the test is still there, labelled Farmer |
| R4 | Heat-alert hindcast reports **false alarms** (precision / recall), not only lead days | Shown on About + `VALIDATION.md` |
| R1 | **MODIS field history** downloaded for the demo fields (NASA task `62312ed7`), checked, cached, live | The "Your land's past" card shows 20 seasons for Hassan |
| N14 | Keep the backend warm (UptimeRobot on `/health`) | 👤 the user sets the monitor once |

## CP2: "If the village switches" (1 day)
| # | Item | Done when |
|---|---|---|
| N1 | Scale view: every field in an area runs its best rotation; add up the Nile water saved per year, salt avoided and soil carbon kept | A card on Next + the engineer page with one big number, sourced |
| N12 | Soil carbon kept per rotation (t C/ha) shown as a future value, no money promised | On every rotation card |

## CP3: "Ten years in 30 seconds" (1–2 days)
| # | Item | Done when |
|---|---|---|
| N3 | An animated soil story built from the real run: two paths split in year 1, the soil bar fades or recovers, the water drop shrinks. Every frame is a real number. Doubles as the 30 s demo video. | Plays on the Rotation screen; screen-recordable |

## CP4: Reach farmers where they are (1–2 days)
| # | Item | Done when |
|---|---|---|
| N4 | **WhatsApp / voice summary:** one Arabic text + voice note of the chosen rotation and this week's alerts, shared by the farmer or engineer (share button, no bot) | Share opens WhatsApp with the text; voice plays |
| N10 | **Printable rotation card** (A4, Arabic first) | Print preview fits one page |
| N11 | **Offline / low data:** the last results stay on the phone | With the network off, the last Today and Rotation still show, labelled with their date |
| N13 | **Accessibility pass:** contrast, labels, tap targets | No critical issue in an audit |

## CP5: Science depth (2–3 days)
| # | Item | Done when |
|---|---|---|
| R3 | **ECOSTRESS ET** (+ FLDAS) vs our FAO-56 water use | Row K4 in `VALIDATION.md` |
| R5 | Yield index vs **governorate wheat yield anomalies** 2000–2023 (FAOSTAT / CAPMAS) | Row K5, honest even if weak |
| R13 | Soil factor also inside the **in-season** wheat engine | Today's harvest estimate includes the soil ledger |
| R12 | RothC change per rotation vs Egyptian long-term trials | Row K10 |
| R14 | Straw choice split into **what you do now** (spin-up) and **what you plan** (the 10-year runs), found by R12 | Ploughing straw in shows its gain even when the field now removes it |

## CP6: Data depth (2–3 days)
| # | Item | Done when |
|---|---|---|
| R6 | **Salinity map** layer (FAO GSASmap or 1 km global) instead of the regional rule | Start ECe from the map, with its range |
| R7 | **GRACE-FO** groundwater trend + **GPM IMERG** rain check | Both named in the challenge; shown on Next |
| N9 | **NASA NEX-GDDP-CMIP6** for the warming case (instead of a linear trend) | 2040 runs use CMIP6 |
| R8 | **Landsat** back to 1984 for the 40-year greenness trend | Trend from 1984 |
| R9 | Relative **income** (high / medium / low) from a dated price table | On rotation cards |

## CP7: Community and open data (2–3 days)
| # | Item | Done when |
|---|---|---|
| N5 | **Mesqa rotation:** neighbours on one canal plan together (shared turn, rice licence) | Engineer view: fields on one mesqa, the canal's water need per plan |
| N7 | **Open "Delta Soil Memory" dataset** (CSV + README, open licence) | Downloadable from About |
| N8 | **Climate twins → farmer-to-farmer** practice cards, sourced | On Next |

## CP8: Validation with people (ongoing)
| # | Item | Done when |
|---|---|---|
| R2 | Season reader vs **WorldCereal 2021** and farmer-logged seasons | Accuracy per crop in `VALIDATION.md` |
| N2 | One real farmer pilot (1–3 Menoufia farmers), 20 s reaction video | 👤 field visit |
| N6 / R11 | Expert review by an ARC agronomist or a Faculty of Agriculture | 👤 a quote on About |

---

**Dates:** local judges announce Global Nominees on **3 Dec** → aim for CP1–CP4 live by then. Global Finalists are announced **17 Dec** → CP5–CP7. Executive judging runs until **26 Jan** → CP8 and polish.
