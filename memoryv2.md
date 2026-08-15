# altn — Complete Project Memory v2
*Regenerated & Refined: August 2026*

Everything. Every file, every decision, every dependency. No context loss.

---

## 1. Project Identity

- **Brand:** altn
- **Studio Name:** altn
- **Owner:** AaryanRaj007 (GitHub)
- **Website:** https://altn.studio
- **GitHub Repo (site):** https://github.com/AaryanRaj007/Altnweb
- **GitHub Repo (LUTs):** https://github.com/AaryanRaj007/altn-luts
- **Purpose:** Originally a self-authored 3D LUT pack for trekking/drone footage. Evolved into a complete brand ecosystem including a marketing site and a custom DaVinci Resolve Python plugin.

---

## 2. The LUT Pack Ecosystem

### Final Counts (33 creative + 2 utility = 35 total)

| Category | Count | Files | Notes |
|----------|-------|-------|-------|
| Natural | 5 | `Altn_natural1-5.cube` | Clean baselines, warm/cool shifts, shadow protection. |
| Cinematic | 8 | `Altn_cinematic1-8.cube` | Teal-orange, golden/blue hour, faded film. |
| Mood | 15 | `Altn_mood1-15.cube` | Brand contrast, vintage, desaturated documentary. |
| Drone | 5 | `Altn_drone1-5.cube` | Haze cut, sky punch, water clarity, aerial contrast. |
| Utility | 2 | `Altn_util1.cube`, `Altn_util2.cube` | DJI D-Log and Apple Log normalization. |

*Note on PRD Deviation: The original PRD specified 5 per creative category (20 total). The final delivery includes 33. The spec evolved dynamically during development, though the naming convention remains numerical.*

### Two-Layer Architecture
The system uses a strict pipeline to prevent color breaking:
`Camera Log` → `Utility LUT` → `Rec.709 Intermediate` → `Creative LUT` → `Final Grade`

### Technical Specs
- **Format:** `.cube` (3D LUT)
- **Grid:** 65-point for all creative LUTs (eliminates banding). 33-point for `util1` (reused from DJI).
- **Input range:** 0.0–1.0

---

## 3. Web Architecture

The project contains two distinct frontend repositories in the monolithic structure: `site` (production) and `site_pro` (experimental/unshipped).

### Site v1 (`/site`) — Live at altn.studio
**Stack:** Astro 5.8.1 + React + Tailwind CSS 4.1.8 + MDX
**Design System:** `#fffbe8` (warm cream) bg, `#ffe000` (yellow) accent, `#16150f` text. Fonts: Bagel Fat One, Fredoka.

**Key Features:**
- Client-side bulk downloading using `jszip` and `file-saver`.
- High-performance Before/After slider utilizing native HTML `<input type="range">` and CSS `clip-path`.
- Fully statically generated; hosted on Cloudflare Pages.

### Site v2 (`/site_pro`) — Not Deployed
A more complex, unshipped iteration of the site containing experimental UX features.
**Additions vs v1:**
- **Dark Theme:** `#000` backgrounds, glass-morphism nav (`.glass` with `backdrop-blur`).
- **Video Background:** `/bg-video-optimized.mp4` running at 60% opacity.
- **Framer Motion:** Introduces `motion` (`^13.1.0`) for interactive elements like `hold-to-confirm.tsx`.
- **New Routes:** Includes a `/plugins` route to distribute the DaVinci Resolve YouTube Downloader.

### Reference: SaySo (`/_sayso_ref`)
The web architecture was templated from the author's previous project, "SaySo". The directory structure, Tailwind setup, and base Radix UI components were cloned to save boilerplate time.

---

## 4. DaVinci Resolve Plugin: YouTube Media Importer

### Overview
A standalone desktop application that embeds a YouTube browser directly into DaVinci Resolve. It allows users to browse, select formats, download via `yt-dlp`, and auto-import media straight into the Resolve Media Pool.

### Technical Implementation (`/Davinci_plugins/YouTubeDownloader/`)
- **Framework:** PySide6 (Qt for Python).
- **GUI (`main.py`):** Uses `QWebEngineView` for a fully functional embedded Chromium browser. Custom styled with a high-contrast dark theme. Always pinned on top of Resolve UI.
- **Downloader Engine (`downloader.py`):** Runs `yt-dlp` and `ffmpeg` in an asynchronous `QThread` to prevent blocking the UI. Regex parses `stdout` for real-time progress bars.
- **Resolve API Bridge (`resolve_bridge.py`):** Interacts with Blackmagic's Scripting API to ingest the final files.
- **Installers:** Includes both a GUI installer (`gui_installer.py`) and CLI installer (`install_plugin.py`), along with PyInstaller scripts for packaging into macOS `.dmg` and Windows `.exe`.

---

## 5. Directory Structure & Key Files

```text
tryingsomthingdif/
├── Davinci_plugins/     # YouTube Media Importer source and builds
│   ├── YouTubeDownloader/  # Core plugin (main.py, downloader.py, resolve_bridge.py)
│   ├── gui_installer.py    # Visual installer for macOS/Win
│   └── build_*.py          # PyInstaller scripts
├── luts/                # Raw LUT files (33 .cube files)
│   ├── natural/         
│   ├── cinematic/       
│   ├── mood/            
│   └── drone/           
├── site/                # Production website (Astro/React)
│   └── src/             # Main source for altn.studio
├── site_pro/            # Pro website variant (Unshipped, contains dark mode/animations)
├── things/              # Planning phase docs (prd.md, architecture.md, phases.md)
├── utility/             # Utility LUTs (Altn_util1.cube, Altn_util2.cube)
└── memoryv2.md / analysis.md # System memory and analysis docs
```

---

## 6. Historical Context & Project Evolution

The `things/prd.md` document outlines Phase 0. It explicitly ruled out website creation and plugin development, framing this strictly as a color science task to create 20 LUTs. 

The project successfully bypassed these artificial limitations. It scaled into a full digital product, demonstrating rapid prototyping (reusing SaySo's template) and multi-domain engineering (color grading → web dev → desktop python dev).

---

## 7. Open Items & Technical Debt

1. **Dual Codebases:** `site` and `site_pro` are split. Changes in one are not reflected in the other.
2. **Missing Tests:** Zero test coverage on the React components or the Python backend.
3. **Unfinished Windows Build:** `build_windows_exe.py` lacks the final compilation steps.
4. **Dependency Assumptions:** The DaVinci plugin assumes the user has `yt-dlp` and `ffmpeg` installed locally.
5. **Asset Duplication:** `Altn_util*.cube` files exist in both the root `/utility/` folder and the `/site/public/luts/utility/` folder.
