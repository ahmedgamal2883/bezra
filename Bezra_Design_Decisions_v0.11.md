# Bezra design decisions, v0.11 (13 Nov 2026)

Canvas: Bezra Web, page "v0.11 simulator + clear copy".

## 1. New hook
- Product hook: **"Try your season before you plant it." / «جرّب موسمك قبل ما تزرعه»**
- The moving climate pin ("Your field is moving") is **removed from the app**. Farmers found it abstract, and knowing your climate in 20 years doesn't change what you do this week.
- The pin map stays **only for the pitch video and the judges** (v0.10 board 07).

## 2. Climate story, in plain words
The "Next season" tab under My field tells it in three steps:
1. Your springs are getting hotter. Show hot days over 32 °C in March and April, by decade, then 2040.
2. So sow wheat earlier. Show the best sowing time in the 1990s, today and around 2040.
3. Learn from farms that already have your future weather (the climate twins), then pick one of the A/B/C rotations.

## 3. Navigation (4 pages)
- **My field.** Tabs: Today, Season plan, Field health, Calendar, Next season, Alerts.
- **Simulator** (replaces "What if").
- **Ask Bezra.**
- **Profile.**
- Engineer accounts get a fifth page.

## 4. Simulator, how to build it in 48 h
- **Ground:** the real satellite image of the field and its neighbours (Sentinel-2 or Esri imagery) as a flat textured plane.
- **Crop:** drawn in 3D by code with Three.js. Each prism is one 30 m square. Height and colour come from the stage model (GDD) plus stress from heat, water and rust.
- **Choices:** sowing date, variety, watering, weather (normal year or hot spring).
- **Time:** step month by month, or jump +3 months to harvest.
- **Results:**
  - expected harvest (% of what the field can give)
  - water per feddan
  - hot days at grain filling
  - a short event line for each month
  - pin a result to compare against another
- **Labels:** "Ground: satellite image", "Crop: simulated", Estimated.
- **Not AI 3D generation.** It is heavy, unreliable and not tied to the data. It can be used in the pitch video only.

## 5. Writing rules
- Plain English. No metaphors and no invented names.
- Arabic comes later.
- Say impact as "protects about X to Y% of your harvest", always as a range.
- Never show fertilizer or pesticide amounts. The engineer decides them.
