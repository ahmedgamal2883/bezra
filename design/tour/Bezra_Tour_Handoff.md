# Bezra: First-time tour + mobile bottom nav — handoff for Claude Code

**Design source:** Claude Design canvas "Bezra Web", page **v0.12 first-time tour**. It has 17 boards.
- `design/tour/html/` holds the clickable HTML of each board. Open them in a browser and use Next, Back, Skip, Listen and Esc.
- `design/tour/screenshots/` holds one PNG per board. These are the visual target.

**Rules that don't change:**
- Keep the current app look: colours, fonts, components and the Bezra mascot.
- Do not redesign any screen. Only add what this document describes.
- Arabic RTL comes first, with a full English mirror.
- Simple mode wording only. Details mode is forced off while the tour runs.
- If something here conflicts with the live app's structure, keep the app's structure, implement the closest equivalent, and tell me.

---

## 1. What we are building

A short guided tour, shown **once**, right after a new user saves their first field. It has 7 steps. Each step runs on the **real screen**: the real element is highlighted and a small "coach mark" sits beside it. The tour can be skipped, and it can be replayed later.

## 2. Flow

```
Onboarding → field saved → Today opens → [A] Offer sheet
   ├─ ابدأ الجولة → steps 1–7 → [B] Done sheet → mascot settles in its corner → normal app
   └─ تخطّي     → [C] Skip toast (with "اعرض الجولة") → normal app
                  → [D] one-time tip the first time each page is opened
Replay any time: Profile → "اعرض الجولة تاني" [E], or the chip "اعرض الجولة" in Ask Bezra.
```

| Step | Screen | Target (add this attribute) | Coach position on mobile | Coach position on desktop |
|---|---|---|---|---|
| 1 | Today | `data-tour="status"`: the status sentence block | bottom | beside (inline-start side) |
| 2 | Today | `data-tour="tasks"`: today's checklist, all tasks | bottom | beside |
| 3 | Today | `data-tour="map"`: satellite map with the 30 m squares | top | beside (other side) |
| 4 | Today | `data-tour="alert"`: first alert row, including its Listen button | top | beside |
| 5 | Today | `data-tour="nav-sim"`: Simulator item in the nav | bottom, above the nav | below the item |
| 6 | Today | `data-tour="nav-ask"`: Ask Bezra item in the nav | bottom, above the nav | below the item |
| 7 | **Profile** (route changes) | `data-tour="accuracy"`: accuracy meter card | bottom | below |

**Rules for each step:**
- Scroll the target into view (`block: "center"`, smooth unless reduced motion is on) **before** showing the coach.
- If a target is missing, skip that step silently and keep counting from 7. Example: the user has no alert yet.
- Step 7 navigates to `/profile`. Back from step 7 returns to Today, step 6.
- On window resize or scroll, re-measure the target and move the hole and the coach.

## 3. Components

### A. OfferSheet
- **What it is:** a bottom sheet on mobile and a floating card bottom-start on desktop, 400 px wide. It is **not** a full-screen modal. Behind it is a light scrim, `rgba(20,26,22,.28)`.
- **Contents:**
  - Mascot (happy, 60 px).
  - Title: `تحب أوريك بذرة في دقيقة؟`
  - Sub: `٧ خطوات قصيرة على شاشاتك أنت.`
  - Primary button, full width, 52 px tall: `ابدأ الجولة`
  - Quiet text button: `تخطّي`
- **Behaviour:**
  - It appears 600 ms after Today has finished loading. It never shows over a skeleton.
  - The scrim does **not** close it. The user must choose.
  - Esc counts as Skip.

### B. Spotlight
- **Dim:** the whole page is dimmed with `rgba(20,26,22,.58)`, leaving a **hole** over the target.
- **Hole:** padding 8 px and radius 14 px. A ring is drawn on its edge: `0 0 0 4px #F29B1E`.
- **Build it as four dim rectangles around the hole** (top, bottom, start, end), or as an SVG mask. That way the target **stays tappable**. For example, the user can tick the box in step 2.
- **Do not use** the `box-shadow: 0 0 0 9999px` trick in the real app. It breaks inside stacking contexts. The design used it only because the canvas is simple.
- Put the overlay in a portal at the end of `<body>`, with z-index above the nav and below the coach.
- Clicks on the dim area do nothing. Do not close the tour by accident.

### C. CoachMark
- **Size and look:**
  - Width `min(340px, 100vw − 24px)`, padding 16 px.
  - Radius 20 px, white background.
  - Shadow `0 24px 60px -20px rgba(20,26,22,.55)`.
- **Header row:** mascot (30 px) + `١ من ٧` (step counter, Arabic digits in Arabic) + `تخطّي` (quiet, at the end).
- **Body:** one sentence, **max 12 words**. 17 px, weight 600, line-height 1.55 in Arabic; 16 px in English.
  - Next to it: a **Listen** button, a 40 px circle. It plays the line in Egyptian Arabic using the same voice as the app's alerts. While it plays, the button turns saffron and shows 3 animated bars.
- **Footer:** step dots (6 px; the active one is 18 px wide and ink-coloured) + `رجوع` (soft; hidden on step 1) + `التالي` (primary, at least 88×44 px).
- **Placement:**
  - Mobile: fixed. Top = 14 px from the top. Bottom = 88 px from the bottom, so it sits above the bottom nav.
  - Desktop: 18 px beside the target, or 14 px below it. Flip if it doesn't fit.
- **Motion:** enters with opacity 0 → 1 and translateY 8 px → 0, 420 ms, `cubic-bezier(.16,1,.3,1)`.

### D. DoneSheet (after step 7)
- Same container as the offer sheet, with the content centred.
- Mascot (proud, 84 px), `خلاص كده! 🌱`, `أنا هنا في الركن لو احتجتني.`, and a primary button `ابدأ`.
- On `ابدأ`:
  - Close the sheet.
  - Animate the mascot from the sheet into its corner button: 900 ms, scale 2.2 → 1, translate to the corner.
  - Go to Today.

### E. SkipToast
- Dark pill above the nav, `bottom: 88px`.
- Contents: mascot 32 px + `تمام. الجولة موجودة في حسابك لو حبيت تشوفها.` + a saffron button `اعرض الجولة`.
- Auto-hides after 6 s. It is announced with `role="status"`.

### F. PageTip (only for users who skipped)
- The **first time** the user opens each main page, show one small dark bubble near its key control. It has a pointer arrow.
- Contents: mascot 34 px + one sentence + a saffron button `فهمت`.
- Show it once per page. Never show more than one at a time.
- **Copy:**
  - Simulator: `جرّب هنا: غيّر ميعاد الزراعة وشوف أرضك وهي بتكبر.`
  - Ask Bezra: `اكتب أو قول سؤالك بصوتك، وأنا أرد من بيانات أرضك.`
  - Field health / map: `المربع الأصفر يعني الحتة دي أضعف. روح بص عليها.`
  - Profile: `كمّل بياناتك عشان النصايح تبقى أدق.`

### G. Replay entries
- **Profile:** a list row at the end of the settings list, with a play icon in a green chip, `اعرض الجولة تاني`, and the sub-line `دقيقة واحدة، ٧ خطوات`.
- **Ask Bezra:** a suggestion chip `اعرض الجولة`.
- Both start the tour at step 1 on Today.

## 4. All copy (exact)

| Key | Arabic | English |
|---|---|---|
| offer.title | تحب أوريك بذرة في دقيقة؟ | Want a one-minute tour of Bezra? |
| offer.sub | ٧ خطوات قصيرة على شاشاتك أنت. | 7 short steps, on your own screens. |
| offer.start | ابدأ الجولة | Start the tour |
| skip | تخطّي | Skip |
| next / back | التالي / رجوع | Next / Back |
| listen (aria) | اسمع | Listen |
| step.counter | ١ من ٧ | 1 of 7 |
| step1 | ده حال أرضك النهارده في جملة واحدة. | This is your field today, in one sentence. |
| step2 | كل يوم مهمة أو اتنين. علّم عليها لما تخلص. | One or two tasks a day. Tick them when done. |
| step3 | أرضك من الفضاء. المربع الأصفر يعني روح بص عليه. | Your field from space. A yellow square means go look. |
| step4 | لما حاجة تيجي، بنقولك قبلها. وتقدر تسمعها. | We warn you before trouble comes. Tap to listen. |
| step5 | جرّب قبل ما تزرع، من غير ما تخسر حاجة. | Try it here before you plant. |
| step6 | أي حاجة مش فاهمها؟ اسألني. | Don't understand something? Ask me. |
| step7 | كل ما تكمّل بياناتك، النصايح تبقى أدق. | The more you fill in, the better the advice. |
| done.title | خلاص كده! 🌱 | All set! 🌱 |
| done.sub | أنا هنا في الركن لو احتجتني. | I'll be in the corner if you need me. |
| done.cta | ابدأ | Start |
| skipped.toast | تمام. الجولة موجودة في حسابك لو حبيت تشوفها. | OK. You can watch the tour any time from Profile. |
| replay | اعرض الجولة | Show the tour |
| replay.row | اعرض الجولة تاني | Show the tour again |
| replay.sub | دقيقة واحدة، ٧ خطوات | One minute, 7 steps |
| tip.gotIt | فهمت | Got it |

## 5. State (save on the server, per user)

```
tour: {
  status: "not_offered" | "offered" | "in_progress" | "completed" | "skipped",
  step: 1..7,
  completedAt?, skippedAt?,
  tipsSeen: ["sim","ask","health","profile"]
}
```
- When status is `not_offered` and the first field has just been saved, show the offer.
- If the user leaves mid-tour, show nothing next time. The tour lives in Profile.
- Tips only show when status is `skipped`.
- Mirror the state in localStorage so it is instant. The server is the truth.

## 6. Keyboard, screen readers, motion
- The coach mark is `role="dialog"` with `aria-modal="false"`, and is labelled by its sentence.
- When a step opens, **focus moves to التالي**. Return focus to the page when the tour ends.
- Keys:
  - Esc = Skip.
  - Arrow keys move between steps. In RTL, ← means Next.
  - Enter or Space presses the focused button.
- When a step changes, announce `الخطوة ٢ من ٧: …` through a polite live region.
- **Reduced motion:** fade only, 200 ms. No sliding, no scaling, no smooth scroll. The mascot fly-in becomes a fade.
- Contrast is AA everywhere: the dim area is at least 4.5:1 against coach text, and the saffron ring sits on the dim.
- Touch targets are at least 44 px; the main buttons are 48–52 px.

## 7. Analytics (optional, cheap)
Track these events: `tour_offered`, `tour_started`, `tour_step_viewed {step}`, `tour_listen {step}`, `tour_completed`, `tour_skipped {step}`, `tour_replayed {from}`, `tip_seen {page}`.

---

## 8. Mobile bottom navigation (do this together with the tour)

The tour's steps 5 and 6 point at nav items, so on phones the nav must sit at the bottom. The boards show it.

**Below 768 px wide:**
- Hide the top nav pills. Keep the top bar slim, 60 px: logo on one side and the bell on the other, following RTL.
- Add a **fixed bottom bar:**
  - Height 72 px + `env(safe-area-inset-bottom)`.
  - Background `rgba(255,255,255,.96)` with `backdrop-filter: blur(10px)`.
  - A 1 px hairline on top in `--line`. No shadow.
  - `z-index` above the content, below sheets, toasts and the tour.
- **Items:** `أرضي` (My field), `المحاكي` (Simulator), `اسأل بذرة` (Ask Bezra), `حسابي` (Profile). Engineer accounts get a 5th item, `المهندس`.
  - Each item is a column: icon 22 px (the app's icon set, stroke 1.9) + label 12 px, weight 600.
  - Each item is at least 56 px tall and fills an equal share of the width.
  - Inactive: muted colour. Active: ink text with a green icon and `aria-current="page"`.
  - Order follows the document direction, so in RTL `أرضي` is on the right.
- **Layout fixes:**
  - Add `padding-bottom: 96px` to the main content so nothing hides under the bar.
  - Lift the floating Bezra button above the bar: `bottom: 86px`, end side.
  - Bottom sheets (log sheet, offer, done) open **over** the bar.
  - Hide the bar when the on-screen keyboard is open in Ask Bezra.
- **768 px and wider:** keep today's top nav exactly as it is.

## 9. Acceptance checklist
- [ ] New user saves the first field → the offer appears once. A reload doesn't show it again.
- [ ] All 7 steps highlight the real element. In step 2 the check box can be ticked through the hole.
- [ ] Step 7 opens Profile. Back returns to Today.
- [ ] Skip at any step → toast → page tips appear once per page.
- [ ] Replay from Profile and from Ask Bezra.
- [ ] Arabic and English, RTL and LTR, on a 360 px phone and a 1440 px desktop. No coach goes off screen.
- [ ] Esc, arrow keys and focus behave as described. Reduced motion is fade only.
- [ ] The mobile bottom nav replaces the top pills under 768 px. Nothing is hidden under it.

## 10. Prompt to paste into Claude Code

```
Read Bezra_Tour_Handoff.md fully, then look at design/tour/screenshots and open design/tour/html
in a browser (every board is clickable).

Build two things, in this order:
1) The mobile bottom navigation (section 8). Under 768 px the top nav pills move to a fixed bottom
   bar with 4 items (5 for engineers). Desktop stays as it is.
2) The first-time tour (sections 1–7): offer sheet after the first field is saved, 7 spotlight
   steps on the real screens using data-tour targets, coach mark, done sheet with the mascot
   settling into its corner, skip toast, one-time page tips for skipped users, replay from
   Profile and Ask Bezra, tour state saved per user.

Keep the current look, components, colours, fonts and mascot. Do not redesign any screen.
Use the exact copy in section 4. Arabic RTL first, English mirror.
Build the spotlight as dim rectangles around the target (not a giant box-shadow), so the target
stays tappable.

After each part: run it on a 360 px phone and on desktop in Arabic and English, fix problems,
then give me the checklist from section 9 (done / partly / not yet) and wait for "continue".
Explain simply; I'm a designer, not a developer.
```
