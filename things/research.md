# RESEARCH.md — altn LUT Pack

Status: Phase 0
Owner: Aaryan (altn)
Last updated: 2026-08-10

## 1. Purpose

Before baking 20 LUTs, lock every technical decision that would otherwise get
decided inconsistently LUT-by-LUT. This doc is the single source of truth for
format, color space, tooling, and the reference material every LUT is judged
against. Nothing in Phase 1–4 should require a new format decision — if it
does, that's a research gap, come back here first.

## 2. Source footage inventory

Two distinct camera/log sources are in play. This matters because a LUT
built for one will look wrong (wrong contrast curve, wrong color response)
on the other if applied blind.

| Source | Log format | Sample count | Notes |
|---|---|---|---|
| Apple Log (ProRes 422 HQ) | Apple Log | primary trekking/cinematic footage | Used for the original custom natural-light LUT |
| DJI drone (Phantom/X5/X7 family) | D-Log | drone aerial footage | DJI ships official D-Log→Rec709/sRGB conversion LUTs as reference |

### DJI reference LUT teardown (analyzed 2026-08-10)

Six DJI-supplied `.cube` files were inspected directly (not creative
grades — these are DJI's own log-to-display conversions):

- `Phantom3/Phantom4/X5 DLOG2sRGB_Improv` — D-Log → sRGB with DJI's baked-in
  color tuning (their "look," not neutral).
- `Phantom4/X7 DLOG2Rec709` — flat, neutral D-Log → Rec709. No stylization.
- `X7 Linear2DLOG` — a 1D shaper (4096-point), Linear → D-Log. Rare use
  case, mainly VFX/CG roundtrip. Not directly relevant to our pipeline but
  confirms DJI's internal log curve shape.

**Finding:** all DJI 3D LUTs are **33-point**, `LUT_3D_INPUT_RANGE 0.0–1.0`,
standard DaVinci Resolve `.cube` format. This is the industry floor for
grid resolution — usable, but coarser than what we're targeting.

### Reference "favorite" LUT teardown — VINCENT_COLOR_FILM_LOOK_4

Confirmed by Aaryan as a fit for Apple Log footage. Analyzed by sampling
black point, mid gray, white point, and pure-primary response:

| Sample | Input | Output (R, G, B) |
|---|---|---|
| Black point | (0,0,0) | (0.023, 0.016, 0.020) |
| Mid gray | (~0.5,0.5,0.5) | (0.488, 0.511, 0.429) |
| White point | (1,1,1) | (0.783, 0.841, 0.745) |
| Pure red in | (1,0,0) | (0.703, 0.027, 0.012) |
| Pure green in | (0,1,0) | (0.150, 0.658, 0.130) |
| Pure blue in | (0,0,1) | (0.010, 0.128, 0.284) |

**Read:** lifted blacks (no pure black, warm-red lift), rolled-off
highlights (no pure white, green-heavy milky rolloff, never clips),
blue pulled down at midtones (subtle warm push), all primaries pulled
toward center (desaturated, filmic, not punchy-digital). This is a
faded-film curve, not a hard color grade — it's the reference for the
Phase 2 "film-emulation contrast" slot.

## 3. Format decision

| Decision point | Choice | Reasoning |
|---|---|---|
| Grid size | **65-point** | DJI ships 33-point as their floor. Drone footage is sky/gradient-heavy — the classic failure mode of low-resolution 3D LUTs is banding in smooth gradients (sky, water). 65-point avoids this. Matches the precision of the original custom Apple Log LUT already built. |
| File format | `.cube` (DaVinci Resolve 3D LUT) | Universal — works Resolve, Premiere, FCP, OBS. No format lock-in. |
| Input range | `LUT_3D_INPUT_RANGE 0.0 1.0` | Standard normalized range, matches DJI reference files and Resolve defaults. |
| Color management | Baked from DaVinci color wheels/curves, not algorithmically generated | Matches existing workflow (the custom Apple Log LUT was built this way). Keeps grading decisions visual/perceptual, not just math. |

## 4. The two-source problem — resolved

Two log formats (Apple Log, D-Log) means one of two paths:

- **Path A — dual-baked:** every creative LUT built twice, once per log
  source. 20 LUTs × 2 = 40 files. More work, more QA surface, more
  maintenance.
- **Path B — common intermediate:** convert both log sources to a shared
  working space first (Rec709 or a flat neutral intermediate), then build
  all 20 creative LUTs on top of that single space. One creative LUT set.
  Log-specific conversion LUTs (like DJI's own D-Log2Rec709, or a custom
  AppleLog2Rec709) become a separate, small "utility" layer underneath.

**Decision: Path B.** Build/reuse a neutral log→Rec709 conversion per
camera source (DJI's official ones already cover D-Log; Apple Log needs
one built once), then all 20 creative LUTs assume Rec709-ish input. This
keeps the creative set to 20 files, not 40, and matches how the industry
normally layers LUTs (technical conversion, then creative grade, as two
separate stages in the node tree — never baked into one LUT).

## 5. Reference footage set (for judging every LUT)

Every LUT in Phase 1–4 gets tested against the same fixed clip set so
comparisons are apples-to-apples:

1. Overcast/flat light trekking clip (worst-case low contrast, tests if a
   LUT can add punch without crushing).
2. Golden hour clip (tests warm-color handling, highlight rolloff).
3. Drone aerial with sky + terrain in frame (tests gradient/banding at
   65-point, tests haze/atmospheric handling).
4. (Pending) low-light or blue-hour clip — needed for Phase 3/4 mood and
   drone-specific categories. **Open item — Aaryan to provide.**

## 6. Tooling / pipeline

- Grading: DaVinci Resolve, node-based, baked to `.cube` via Resolve's
  LUT export.
- Automation: `agy` (Antigravity CLI) prompts to drive repeatable bake
  steps where possible — same pattern used for the original Cinematic
  Natural Light LUT.
- Naming convention (locked, see architecture.md for full spec):
  `Altn_[category][N].cube` — `Altn` capitalized, fixed brand prefix,
  e.g. `Altn_cinematic1.cube` … `Altn_cinematic5.cube`

## 7. Open items before Phase 1 starts

- [ ] Confirm/build the Apple Log → Rec709 neutral conversion LUT (the
      "utility layer" for Path B).
- [ ] Get 4th reference clip (low-light/blue-hour).
- [ ] Confirm whether output LUTs should target Rec709 delivery gamma only,
      or also need an HDR/PQ variant (assume **no HDR for v1** unless
      Aaryan says otherwise — YAGNI, add if a real need shows up).
