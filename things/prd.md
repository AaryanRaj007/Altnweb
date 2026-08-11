# PRD.md — altn LUT Pack (Product Requirements Document)

Status: Approved for Phase 0 start
Author: Aaryan (altn)
Last updated: 2026-08-10

## 1. Problem statement

Aaryan has already built one custom LUT from scratch (Cinematic Natural
Light, Apple Log ProRes 422 HQ, 65-point) because a licensing conflict
blocked redistribution of a commercial LUT pack. That solved one grade.
It didn't solve the underlying need: **a complete, self-authored,
non-templated LUT set** that covers the actual range of footage Aaryan
shoots (Himalayan trekking, drone aerials, general cinematic reels)
without relying on third-party packs that carry licensing risk and
don't fit the "genuinely own-made" aesthetic bar.

Existing options (WLPR, other past projects) were assessed as "newbie" —
low real-world complexity, no genuine constraint, weekend-scale. This
project is explicitly meant to be **mid-tier real**: grounded in a
problem Aaryan has already hit and worked around manually, with actual
technical depth (color science, multi-log-format handling, grid
resolution tradeoffs) and a multi-week build, not a weekend toy.

## 2. Goal

Ship a complete, working, self-authored 20-LUT creative pack (plus 2
supporting utility LUTs) that:

1. Works correctly across both camera sources Aaryan actually shoots
   (Apple Log and DJI D-Log).
2. Is technically sound — no banding, no accidental clipping, verified
   against real reference footage, not just "looks fine on one clip."
3. Has a clear identity — Aaryan's aesthetic (minimal, high-contrast,
   restrained, not a stock teal-orange preset pack), not a copy of
   Vincent's or DJI's or anyone else's look, even where those informed
   the reference research.
4. Is fully usable standalone, right now, dropped into DaVinci Resolve
   by hand — **no dependency on the future plugin or website.** A LUT
   pack that only works once the batch-applier plugin exists is not
   "functional," it's half-shipped.

## 3. Non-goals (explicit, per current instruction)

- **No website work in this phase.** Distribution, download page,
  before/after slider UI — all deferred. This PRD is scoped to LUTs
  only.
- **No DaVinci plugin work in this phase.** The batch-applier plugin is
  a separate, later project that will *consume* this LUT set once done —
  it is not a dependency for this PRD's completion.
- **No HDR/PQ delivery variant** unless a real need surfaces (YAGNI —
  ladder rung 1, research.md §7).
- **No dual-baked 40-file set.** Explicitly rejected in favor of the
  two-layer utility+creative model (research.md §4, architecture.md §2).
- **No monetization/licensing page** — that's downstream of website,
  itself downstream of this PRD.

## 4. Target user

Primarily Aaryan himself — this is a tool built for his own trekking and
drone footage pipeline first (same pattern as the DaVinci audio-cut
workflow and the original custom LUT). Secondary/future audience:
whoever eventually downloads it from the site (out of scope here), but
every requirement in this PRD is written against Aaryan's own real
footage and real workflow, not a hypothetical general user.

## 5. Functional requirements

### 5.1 Utility layer (2 LUTs)

| ID | Requirement |
|---|---|
| FR-U1 | A LUT exists that converts Apple Log ProRes 422 HQ footage to a neutral Rec709-ish intermediate, at 65-point grid resolution, verified against reference footage for correct exposure/contrast (not just "runs without erroring"). |
| FR-U2 | A LUT exists (built or reused from the DJI reference set) that converts D-Log footage to the same neutral Rec709-ish intermediate. |
| FR-U3 | Both utility LUTs are interchangeable inputs to every creative LUT in the 20-set — i.e., a creative LUT applied after either utility LUT produces a consistent, comparable look across camera sources. This is the actual test of the two-layer model — verify it, don't assume it. |

### 5.2 Creative layer (20 LUTs across 4 categories)

| ID | Requirement |
|---|---|
| FR-C1 | Exactly 5 LUTs exist in each of: Naturals, Cinematic, Mood/Creative, Drone-specific (phases.md). |
| FR-C2 | Every creative LUT is a 65-point `.cube` file following the naming convention in architecture.md §4. |
| FR-C3 | Every creative LUT passes the QA gate (architecture.md §7) before being considered "done" — this includes the no-near-duplicate check across the full 20, not just within a category. |
| FR-C4 | Every creative LUT has a before/after preview still exported (for later use, and for Aaryan's own review) — required even though the website itself is out of scope. |
| FR-C5 | Category-specific correctness: |
| FR-C5a | Naturals — must not introduce a color cast; verified via neutral gray card or equivalent reference in the clip set. |
| FR-C5b | Cinematic — must be visually distinct from generic "Instagram filter" teal-orange; restrained saturation push, checked against the Vincent reference curve as an anchor, not a copy. |
| FR-C5c | Mood/Creative — the brand-tied LUT (`Altn_mood1`, and any others referencing altn's yellow/black identity) must read as intentional brand language, not as literal color-replace. |
| FR-C5d | Drone-specific — must be tested specifically on footage with visible sky and/or water, since these are the highest-risk zones for gradient banding; this is the primary justification for the 65-point decision and needs explicit verification, not assumption. |

### 5.3 Repo / packaging

| ID | Requirement |
|---|---|
| FR-R1 | Repo structured exactly per architecture.md §5. |
| FR-R2 | Every LUT addition/change logged in CHANGELOG.md (architecture.md §8). |
| FR-R3 | README.md (repo-level, distinct from these docs) exists with: what this is, how to use in DaVinci Resolve (drag into LUT folder, apply as node), which utility LUT to use for which camera. This is required for FR "functional standalone" — a LUT set with no usage instructions isn't functional for anyone but Aaryan. |

## 6. Non-functional requirements

- **Precision:** all creative LUTs 65-point, no exceptions, no falling
  back to 33-point for speed (research.md §3 — this is a deliberate
  quality bar, not negotiable mid-project).
- **Consistency:** naming convention followed with zero exceptions
  (architecture.md §4) — inconsistent naming undermines the "not
  templated / genuinely own" positioning as much as the actual color
  work does.
- **Reproducibility:** every LUT's grading decisions should be
  reconstructable from Resolve project files/node trees where
  practical, not just the baked `.cube` output — in case a LUT needs
  revision later (version bump path, architecture.md §8).
- **No regressions:** re-baking a LUT to fix an issue must not silently
  change behavior for anyone already using the shipped version — handled
  via version suffix bump, not overwrite (architecture.md §8).

## 7. Success criteria (how we know this is actually done)

- [ ] 2 utility LUTs + 20 creative LUTs exist, all passing QA gate.
- [ ] Full set tested by actually applying to real Himalayan
      trekking footage and real drone footage — not just the fixed
      reference clips, at least one live spot-check per category.
- [ ] Aaryan can hand the repo to himself in 6 months, read
      architecture.md + phases.md, and understand exactly why every
      decision was made — no "why did I do it this way" gaps.
- [ ] Zero near-duplicate LUTs in the final 20 (subjective call, but
      checked explicitly per-pair within categories most likely to
      overlap — Naturals vs. Mood/desat, Cinematic vs. Mood/vintage).
- [ ] The set is usable as a portfolio artifact on its own — i.e., if
      the website and plugin never got built, this repo alone would
      still be a legitimate, presentable, real project. This is the
      actual bar for "not a newbie project" per the original framing.

## 8. Dependencies & sequencing

- Depends on: Phase 0 research being complete (research.md) before any
  creative work starts.
- Blocks: the DaVinci batch-applier plugin (needs a finished LUT set to
  batch-apply) and the future website (needs finished LUTs + previews to
  display). Neither is planned or scoped here — noted only to make the
  sequencing explicit.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Two-layer (utility+creative) model doesn't actually produce consistent results across Apple Log vs D-Log sources | FR-U3 explicitly tests this before Phase 1 creative work begins — caught early if it fails, not discovered at LUT #15. |
| 20 LUTs drift into visual sameness (five categories blur together) | QA gate's duplicate check (architecture.md §7) run per-phase, not just at the end — cheaper to catch and fix mid-phase. |
| Reference footage set too narrow (e.g. no low-light clip yet) | Tracked as open item in research.md §7 and phases.md Phase 0 exit criteria — blocking for Phase 3/4, not ignorable. |
| Scope creep into website/plugin work before LUTs are finished | This PRD's non-goals (§3) exist specifically to prevent that — re-read this section if tempted to jump ahead. |
