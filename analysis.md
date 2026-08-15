# altn — Comprehensive Project Analysis
*August 2026*

---

## 1. Executive Summary

**altn** is a multi-faceted digital product suite built by a solo developer (Aaryan). What began as a strictly scoped color grading LUT pack (defined in `prd.md`) organically evolved into a full-scale ecosystem comprising:

1. **A professional 35-LUT pack** (33 creative, 2 utility) engineered for DaVinci Resolve.
2. **A production marketing website** (`site`) deployed on Cloudflare Pages.
3. **An extended "Pro" website variant** (`site_pro`) with experimental features and animations.
4. **A standalone DaVinci Resolve desktop plugin** built in Python (PySide6) for importing YouTube media directly into the Media Pool.

This analysis evaluates the architecture, code quality, strategic drift, and technical debt of the entire repository.

---

## 2. Strategic Deviations from PRD

The original `prd.md` explicitly stated **"No website work"**, **"No DaVinci plugin work"**, and **"20 creative LUTs"**. 

**Reality vs. Plan:**
- **LUT Count:** Planned 20, delivered 33 (15 Mood LUTs instead of 5, 8 Cinematic instead of 5). 
- **Website:** Built an Astro + React frontend from scratch, reusing a template from a previous project (`SaySo`).
- **Plugin:** Built a full desktop GUI application using PySide6 and `yt-dlp`.

*Insight:* The project exhibits classic "solo developer scope expansion." While the scope creep resulted in high-quality deliverables, the discrepancy between planning documents (`things/`) and the actual codebase (`site/`, `Davinci_plugins/`) indicates that the documentation stopped being the source of truth mid-way through development.

---

## 3. Architecture Deep Dive

### 3.1 Color Pipeline (The Core Product)
- **Two-layer normalization:** The architecture correctly isolates camera-specific log curves (Apple Log, DJI D-Log) from the creative grading. This is a studio-grade approach.
- **65-point Grid Precision:** Deliberately chosen over 33-point grids. This is crucial for avoiding gradient banding in skies (drone footage) and 10-bit log processing.
- **Procedural Generation:** Using Python to generate the LUTs (`apply_luts.py`, `gen_*.py`) ensures mathematical correctness and eliminates manual UI errors in DaVinci.

### 3.2 Frontend Architecture (Websites)
- **Stack:** Astro 5.8 (Static Site Generation) + React + Tailwind CSS v4.
- **Performance First:** Astro was chosen to ship zero JavaScript by default. React is strictly hydrated (`client:load`) only for interactive islands (e.g., `LutGallery`, `BeforeAfterSlider`).
- **Client-Side Heavy Lifting:** The batch ZIP download uses `jszip` and `file-saver` entirely in the browser. This eliminates the need for a backend server, slashing hosting costs to zero (Cloudflare Pages free tier).
- **Dual-Site Fragmentation:** The repository contains `site` (production) and `site_pro` (experimental). `site_pro` contains a plugins page, `BackgroundCanvas.tsx`, `RandomGlowBackground.tsx`, and Framer Motion (`hold-to-confirm.tsx`), but these were never merged into production.

### 3.3 DaVinci Resolve Plugin (Python Desktop App)
- **Stack:** PySide6 (Qt) for the GUI, `yt-dlp` for downloading, `ffmpeg` for merging streams.
- **UX:** Embeds a full Chromium browser (`QWebEngineView`) inside a dark-themed PyQt window that floats above DaVinci Resolve. It listens for the DaVinci Scripting API to auto-import downloaded files into the Media Pool.
- **Multi-threading:** Uses `QThread` (`downloader.py`) to prevent GUI freezing during heavy `yt-dlp` subprocess executions. Parses `stdout` via regex to update a live progress bar.

---

## 4. Code Quality & Technical Debt Assessment

### 4.1 Frontend (Grade: A-)
- **Strengths:** Excellent separation of concerns. Semantic HTML. High-quality CSS architecture leveraging Tailwind v4 features. The Before/After slider implementation is brilliant—using a native HTML range input coupled with a CSS `clip-path` instead of a heavy third-party library.
- **Weaknesses:** Complete lack of automated testing (no Vitest/Playwright). Type safety is mostly enforced, but there are unhandled edge cases (e.g., if a LUT preview image fails to load, there's no fallback UI).

### 4.2 Python Plugin (Grade: B)
- **Strengths:** Robust threading model. Good error handling around `yt-dlp` edge cases. The GUI is polished with a consistent dark theme matching Resolve.
- **Weaknesses:** 
  - **Dependency Hell:** Relies on the user having `ffmpeg` and `yt-dlp` installed or bundled. 
  - **Incomplete Build Scripts:** `build_windows_exe.py` is unfinished.
  - **Security/Safety:** Executing `subprocess.Popen` on external binaries is standard, but relies on trusting the system's `PATH`.

### 4.3 Documentation & Tooling (Grade: C+)
- The `things/` directory is outdated compared to the shipped code. 
- There is no unified `README.md` that explains how to run the website locally or build the plugin.
- Duplicate utility LUTs exist in both `/utility/` and `/site/public/luts/utility/`.

---

## 5. Security & Risk Analysis

- **Web:** Negligible risk. It's a static site. No database, no user inputs hitting a server.
- **Plugin:** Medium risk. The plugin bridges external web data (YouTube) directly into the local file system. If YouTube changes their DOM or streaming protocols, `yt-dlp` will break, breaking the plugin. 

---

## 6. Actionable Recommendations

### Immediate Priority (Next Dev Session)
1. **Reconcile the Dual Sites:** The existence of `site` and `site_pro` is a trap. Merge the `plugins` page and Framer Motion components from `site_pro` into `site`, then delete `site_pro` entirely to establish a single source of truth.
2. **Update Documentation:** Write a root `README.md`. Acknowledge that the PRD was expanded. Document how to run the Astro dev server.
3. **Deduplicate Assets:** Remove `/utility/Altn_util*.cube` and strictly use `/site/public/luts/utility/` as the canonical source.

### Medium-Term Optimization
4. **Implement CI/CD:** Add a simple GitHub Actions workflow to run `npm run typecheck` and `npm run build` on PRs to prevent broken static builds from reaching Cloudflare Pages.
5. **Optimize Preview Images:** Convert the 29 JPG/PNG preview files to WebP or AVIF format. Implement lazy loading (`loading="lazy"`) to improve the Largest Contentful Paint (LCP) metric as the gallery grows.
6. **Bundle Plugin Dependencies:** Finish the PyInstaller scripts (`build_windows_exe.py`) so they bundle `yt-dlp` and `ffmpeg` explicitly. Expecting video editors to manage their system `PATH` is a bad UX pattern.

---

## 7. Conclusion
The **altn** project is a remarkable showcase of full-stack capability by a solo developer, bridging color science, modern web frameworks (Astro/React), and desktop GUI engineering (PySide6). While it suffers from typical solo-dev ailments (scope creep, fragmented codebases, lack of tests), the foundations are highly resilient and production-ready.
