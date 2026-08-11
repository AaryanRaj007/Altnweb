# PHASES.md — altn LUT Pack

Status: Active
Total scope: 20 creative LUTs + 2 utility LUTs, across 5 phases.

## Phase 0 — Research & Foundation
**Goal:** zero ambiguity left before any creative LUT is baked.

Deliverables:
- [x] Format locked: 65-point `.cube`, 0.0–1.0 input range (research.md §3)
- [x] Two-source problem resolved: Path B, common intermediate (research.md §4)
- [x] DJI reference LUTs analyzed (research.md §2)
- [x] First film-look reference analyzed — anchors Phase 2 (research.md §2)
- [x] Build `Altn_util2.cube` — Apple Log utility layer (generated:
      Apple Log OETF inverse → BT.2020→709 matrix → Gamma 2.4, 65-point)
- [x] Confirm/reuse DJI D-Log conversion as `Altn_util1.cube` (DJI X7
      DLOG2Rec709, 33-point, reused with TITLE metadata added)
- [ ] Collect 4th reference clip (low-light/blue-hour) — needed before
      Phase 3/4 QA
- [ ] Repo scaffolded per architecture.md §5

**Exit criteria:** both utility LUTs exist and pass QA gate on the full
reference clip set. Nothing in Phase 1 should require touching Phase 0
decisions again.

**Blocking:** Phase 1 does not start until utility layer works — every
creative LUT downstream assumes it.

---

## Phase 1 — Naturals (5 LUTs)
**Goal:** utility-grade, minimal stylization. Also the real pipeline
stress-test — first 5 LUTs through the full Stage 1–5 process
(architecture.md §1) before committing to 15 more.

LUTs:
1. `Altn_natural1` — neutral Log-to-Rec709 baseline, essentially a
   verification LUT (should look nearly identical to Layer 1 alone)
2. `Altn_natural2` — warm neutral, gentle
3. `Altn_natural3` — cool neutral, gentle
4. `Altn_natural4` — highlight/shadow protection, minimal compression, for
   footage headed to further grading downstream
5. `Altn_natural5` — flat-log punch-up, no color shift, pure
   contrast/gamma correction

**Exit criteria:** all 5 pass QA gate (architecture.md §7). Pipeline
issues (banding, clipping, workflow friction) surfaced and fixed HERE,
not discovered mid-Phase-3.

---

## Phase 2 — Cinematic (5 LUTs)
**Goal:** the core "altn look" — restrained, not templated, not
Instagram-teal-orange.

Anchor reference: VINCENT_COLOR_FILM_LOOK_4 teardown (research.md §2) —
lifted blacks, rolled-off highlights, warm-desaturated mids.

LUTs:
1. `Altn_cinematic1` — teal-orange, restrained; deliberately careful, low
   saturation push, avoid the overdone version
2. `Altn_cinematic2` — moody desaturated
3. `Altn_cinematic3` — film contrast; direct descendant of the Vincent
   reference curve, own interpretation not a copy
4. `Altn_cinematic4` — Himalayan cold blue; ties directly to existing
   trekking footage aesthetic
5. `Altn_cinematic5` — golden hour amplifier

**Exit criteria:** all 5 pass QA gate. Each one visually distinct from
every Phase 1 LUT and from each other (architecture.md §7 duplicate check).

---

## Phase 3 — Mood / Creative (5 LUTs)
**Goal:** bolder, identity-driven, ties to altn brand (yellow/black from
SaySo, high-contrast doodle-channel aesthetic).

LUTs:
1. `Altn_mood1` — brand contrast; high-contrast, altn yellow/black-coded
   without literally forcing brand colors onto footage
2. `Altn_mood2` — night/blue hour; **requires the 4th reference clip**
   from Phase 0 (low-light) for real QA
3. `Altn_mood3` — muted vintage
4. `Altn_mood4` — punchy vlog
5. `Altn_mood5` — desaturated documentary

**Exit criteria:** all 5 pass QA gate, including the low-light-specific
check for #2 (noise/banding behaves differently in shadows — verify on
the low-light reference clip specifically, not just the standard 3).

---

## Phase 4 — Drone-specific (5 LUTs)
**Goal:** purpose-built for aerial footage problems that ground footage
doesn't have — atmospheric haze, sky gradients, terrain texture.

LUTs:
1. `Altn_drone1` — haze cut; atmospheric/distance haze correction
2. `Altn_drone2` — sky punch; blue sky saturation without highlight blowout
3. `Altn_drone3` — terrain contrast; mountain/ground texture pop
4. `Altn_drone4` — water clarity; river/water footage
5. `Altn_drone5` — sunset aerial

**Exit criteria:** all 5 pass QA gate with **extra scrutiny on sky
gradient banding** (architecture.md §7) — this category is the actual
reason 65-point was chosen over DJI's 33-point default, verify it was
worth it.

---

## Cross-phase rules (apply to every phase)

- No phase starts until the previous phase's exit criteria are fully
  checked off. No parallel phases.
- Every LUT gets a CHANGELOG.md entry on commit (architecture.md §8).
- If a LUT in any phase turns out near-duplicate to an earlier one, cut
  it and pick a genuinely different slot — don't ship redundancy just to
  hit "20."
- Website work does **not** start until all 5 phases are complete and the
  full 20+2 set has passed QA. This is a hard gate per current scope
  (prd.md §8).

## Timeline note

No calendar dates fixed here on purpose — phases gate on QA passing, not
on a deadline. If a real deadline exists (NEEEV milestone, portfolio
deadline), add it here explicitly rather than assuming.
