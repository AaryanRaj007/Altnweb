# ARCHITECTURE.md — altn LUT Pack

Status: Draft for Phase 0/1
Scope: LUT production pipeline + repo structure only. Website/distribution
is explicitly out of scope for this document (see prd.md §8 Non-Goals).

## 1. System overview

This isn't software architecture in the code sense — it's a **production
pipeline architecture**: how a LUT goes from "idea" to "verified, versioned
file in the repo." Treat it like a build pipeline with stages, not a folder
of loose files.

```
[Reference footage set]
        │
        ▼
[Stage 1: Log→Neutral conversion layer]   (utility LUTs, one per camera source)
        │
        ▼
[Stage 2: Creative grade]                 (DaVinci node tree, per-LUT)
        │
        ▼
[Stage 3: Bake to .cube]                  (Resolve export, 65-point)
        │
        ▼
[Stage 4: QA pass]                        (apply to reference set, check for
        │                                  banding/clipping/consistency)
        ▼
[Stage 5: Commit to repo]                 (naming convention, changelog entry)
```

## 2. Color pipeline (two-layer model)

Per the Path B decision in research.md §4:

**Layer 1 — Technical (utility) LUTs.** Convert a camera's native log
format to a neutral Rec709-ish intermediate. Not creative. One per camera
source:
- `Altn_util1.cube` — D-Log → Rec709 (reuse/adapt DJI's official
  conversion — already have reference files, no need to rebuild from
  scratch)
- `Altn_util2.cube` — Apple Log → Rec709 (build once, this is the missing
  piece — reuses the existing custom Apple Log knowledge already on hand)

**Layer 2 — Creative LUTs.** The 20-LUT set. Every one of these assumes
Rec709-ish input (i.e., footage already passed through Layer 1). This is
what keeps the set at 20 files instead of 40 — creative grades are
source-agnostic once footage is normalized.

In DaVinci, this is two LUT nodes stacked in the node tree (utility LUT →
creative LUT), never one baked-together file. This mirrors standard
color-pipeline practice and keeps each LUT single-purpose and swappable.

## 3. File format spec

| Field | Value |
|---|---|
| Format | `.cube` |
| Grid size | 65-point (`LUT_3D_SIZE 65`) for all creative LUTs |
| Grid size (utility layer) | 33-point acceptable (matches DJI reference precedent), 65-point if rebuilding Apple Log conversion from scratch |
| Input range | `LUT_3D_INPUT_RANGE 0.0 1.0` |
| Encoding | Plain text `.cube`, DaVinci Resolve export default |
| Line endings | Not standardized by DJI reference files (some CRLF, some LF) — **our exports: LF, consistent**, avoid diff noise in git |

## 4. Naming convention

```
Altn_[category][N].cube
```

- `Altn` — fixed, always capitalized exactly this way, non-negotiable
  brand prefix. Every single file starts with it.
- `category` — one of: `Util`, `Natural`, `Cinematic`, `Mood`, `Drone`
- `N` — position within category, `1` through `5` (no leading zero, no
  version suffix — see versioning note below)

Examples:
```
Altn_util1.cube          (D-Log → Rec709)
Altn_util2.cube          (Apple Log → Rec709)
Altn_natural1.cube
Altn_natural2.cube
Altn_natural3.cube
Altn_natural4.cube
Altn_natural5.cube
Altn_cinematic1.cube
Altn_cinematic2.cube
Altn_cinematic3.cube
Altn_cinematic4.cube
Altn_cinematic5.cube
Altn_mood1.cube
Altn_mood2.cube
Altn_mood3.cube
Altn_mood4.cube
Altn_mood5.cube
Altn_drone1.cube
Altn_drone2.cube
Altn_drone3.cube
Altn_drone4.cube
Altn_drone5.cube
```

The descriptive name (e.g. "warm neutral," "himalayan cold blue") moves
out of the filename entirely and lives in metadata: the `TITLE` field
inside the `.cube` file itself, plus a mapping table in README.md/
CHANGELOG.md. Filename stays short, numbered, brand-first — descriptive
name stays discoverable but doesn't bloat the file name.

**Versioning under this scheme:** since the number slot is now a
position (1–5), not a version, a re-bake that changes the curve does
NOT get a new filename — it stays `Altn_cinematic3.cube` but bumps the
`TITLE` metadata and gets a CHANGELOG.md entry noting what changed. If a
LUT is ever swapped out entirely for a different look at the same slot,
that's also a CHANGELOG entry, not a silent overwrite (see §8).

No spaces, no lowercase `altn`, no marketing names baked into the
filename.

## 5. Repo structure

```
altn-luts/
├── README.md                  # public-facing, not this set of docs
├── docs/
│   ├── prd.md
│   ├── architecture.md
│   ├── phases.md
│   └── research.md
├── reference-footage/          # the fixed judging clip set (or pointers,
│                                # if too large for git — see §6)
├── utility/
│   ├── Altn_util1.cube
│   └── Altn_util2.cube
├── luts/
│   ├── natural/
│   │   └── Altn_natural1.cube … Altn_natural5.cube
│   ├── cinematic/
│   │   └── Altn_cinematic1.cube … Altn_cinematic5.cube
│   ├── mood/
│   │   └── Altn_mood1.cube … Altn_mood5.cube
│   └── drone/
│       └── Altn_drone1.cube … Altn_drone5.cube
├── previews/                  # before/after stills per LUT, for QA + later
│                                # website use, PNG or JPG
└── CHANGELOG.md
```

## 6. Handling large reference footage in git

Raw 4K clips don't belong in a normal git repo (repo bloat, slow clones).
Options, cheapest first:

1. **Don't commit raw clips.** Commit only frame grabs (stills) used for
   before/after previews. Reference footage lives locally / in existing
   footage archive, referenced by filename/timestamp in research.md.
2. If full clips must be versioned: Git LFS. Only reach for this if (1)
   proves insufficient — don't set up LFS speculatively.

**Decision: option 1 for v1.** Stills only in repo. Revisit if a real need
for full-clip versioning shows up.

## 7. QA gate (Stage 4, per LUT)

Every LUT must pass before commit:

- [ ] Applied to all reference clips (research.md §5) — no visible banding
      in sky/gradient areas (this is the whole reason for 65-point, verify
      it actually held)
- [ ] No channel clipping unless intentional (check scopes in Resolve —
      waveform + vectorscope, not eyeballing)
- [ ] Black point and white point checked — intentional lift/rolloff
      documented, not accidental crush/blowout
- [ ] Visually distinct from every other LUT already in the set — no two
      LUTs in the 20 should look like near-duplicates (if they do, cut one,
      don't ship redundancy)
- [ ] Before/after still exported to `previews/`

## 8. Versioning & changelog

`CHANGELOG.md` at repo root, one entry per LUT added or modified:

```
## 2026-08-14
- Added: Altn_natural1.cube — "Clean" (Phase 1)
- Added: Altn_natural2.cube — "Warm Neutral" (Phase 1)
```

Re-bakes that change the actual curve keep the same filename (position in
category doesn't change) but get a changelog line explaining what
changed and why, plus a `TITLE` metadata bump inside the `.cube` file
itself. Don't silently swap the look at a slot without logging it —
anyone already using `Altn_natural2.cube` should know if its curve
changed underneath them.

## 9. Explicitly out of scope (this doc)

- Distribution/download site, licensing page, payment — all website
  concerns, tracked separately per Aaryan's instruction to not plan that
  yet.
- DaVinci *plugin* (batch applier) — separate project, depends on this
  LUT set being done first, not part of this pipeline.
