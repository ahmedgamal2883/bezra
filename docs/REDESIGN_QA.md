# Redesign QA (branch `feature/redesign-v1`, 18 Nov 2026)

Every page of the handoff's page map is now on the redesigned screens and on real data. This note says what was checked, what was fixed during the check, what is different from the design (for the designer to review), and what is still open.

## What was checked

| | English | Arabic |
|---|---|---|
| Returning farmer / guest, every field page (Today, Journal, Crop, Rust, Check, Soil, Season, Try, Story, Data, Reading, Catch up), Simple and Details | 1440 px: no console errors, every tab link works | 390 px and 1440 px: every sentence translated (only dataset names, units and source lines stay in English), no sideways scroll, layout matches the Arabic Today design |
| Ask, Profile, Add field | loaded, no errors | translated |
| Engineer workspace | loaded with a test engineer account | not checked |
| Signed out: landing, sign up, sign in, waking | open; field pages, profile, ask and engineer send you to sign in | landing, sign up, sign in translated |
| Old addresses (`/field/x`, `/plan`, `/tasks`, `/alerts`, `/diagnose`, `/next`, `/sim`, `/onboarding`) | go to the new page that replaced them | same |
| Production build | passes (lint warnings only) | |

Not covered in this pass: the full new-farmer flow end to end (sign up → draw → crop stage → reading → story) was checked when each page was built, not again here. The engineer workspace in Arabic and with real assigned farmers was not checked (there is no way to assign one yet, see Open issues).

## Fixed during the check

- With no field yet (an engineer, or a farmer before adding one), the bottom tabs pointed to `/field//today`. They now go through `/today`, which sends engineers to their workspace and new farmers to Add your field.
- Reading now ends on the field's story ("See what we found"), as in the design. Joining mid-season still goes to Catch up first.
- Sign up said "No password: we send you a code". It now says name, mobile number and a password, no code to wait for.
- The design's Arabic CSS (Arabic font, letter spacing 0, LTR charts, Ask button on the left on desktop) was not applying; it does now.
- Direction arrows (›, ↗, →) now point the other way in Arabic, as in the Arabic designs.
- The guest banner squeezed its text into a thin column on phones; the button now drops under the text.
- The Story and Data headings and tables fit a phone screen.

## Different from the design (please review)

1. **Sign up has a password, no SMS code.** You chose this. The design's code step (`V19-SignUp-Code`) is not used.
2. **Data sheet, Details.** The design's map and KPI tiles used sample values. They are replaced by a table of what the satellites know about this field (area, location, height, slope, crop and stage, sowing date, soil, last clear image, greenness, root-zone moisture, leaf temperature, weather history), each with its source. Download CSV gives the daily weather and the squares. Share with engineer opens Messages.
3. **Story.** Shows 1 to 3 findings, only the ones the data supports: heat while the grain fills (only on the sample field and guests' copies, because the heat replay is computed for that field only), winter greenness around the field, and the corner that fell behind last season. Details shows the season-by-season greenness table instead of the design's charts.
4. **Old pages kept.** Full map, alert detail, insight, Messages, season report, States and About keep their old look; they are still reachable. Old addresses of pages that were replaced send you to the new page.
5. **`/today?to=…`** opens a page of your own field (used by old links such as `/sim`).
6. **Arabic for pages without an Arabic design** (Story, Data, Reading, Catch up, Check, Profile, Engineer, sign up, add field, and all sentences built from data on every page) is written by me in the same tone as the design's strings. It is in `frontend/src/lib/ar-v2.ts`; please read it for tone. Dataset names, units and source lines stay in English.
7. **New fields are named "My field"**; there is no rename yet.
8. **Loading states** use plain skeleton blocks, not the `V24-Today-Loading` design.
9. **Ask Bezra** answers with `gemini-3.5-flash-lite` (you approved; the bigger model took ~30 s and timed out).

## Open issues

Data and logic, found while wiring the pages (not changed, the submission's numbers stay as they are):

- The rust rule works on daily averages and catches few foggy nights (0 to 2 rust days a winter).
- The water turn can disagree with itself on Today: the summary says Thursday while the harvest impact says water today.
- The season plan has no watering between 29 Nov and 28 Jan.
- Catch up on day 17 lists grain-fill heat under "already decided".
- A new field's missed-turn sentence shows a raw date (2026-11-09).
- The green-up date from MODIS (ORNL service) was down during testing; Add field falls back to the date the farmer gives.
- The heat replay (hindcast) exists only for the sample field.

Product:

- **A farmer cannot link to an engineer.** Profile says "When an engineer follows your field, they will appear here" and the engineer workspace says "When a farmer adds you as their engineer…", but neither side has a way to do it, and the design has no screen for it. Needs a design decision (for example: the farmer types the engineer's mobile number in Profile).
