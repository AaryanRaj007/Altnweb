# altn LUT Pack — Project Memory
*Generated: August 2026*

This document serves as the complete brain-dump of everything built during the altn LUT pack and website development sessions. Use this to restore context in future sessions if token limits truncate history.

## 1. The LUT Pack (25 total)
We built a professional, mathematically pure 3D LUT pack for trekking and drone footage, avoiding the banding common in 33-point exports from DaVinci.

**Utility Layer (2 LUTs)**
- `Altn_util1` (33-point): DJI D-Log to Rec.709 conversion.
- `Altn_util2` (65-point): Apple Log to Rec.709 conversion (mathematical inversion of Apple's OETF + BT.2020 matrix).

**Creative Layer (23 LUTs, 65-point)**
Built via Python scripts (`utility/gen_*.py`) to guarantee strict 65-point mathematical grids.
- **Natural (5):** Baselines, warm/cool shifts, shadow protection.
- **Cinematic (8):** Teal-orange, golden/blue hour, Himalayan cold blue, faded film. Includes bold extensions (`cinematic6`, `7`, `8`).
- **Mood (5):** Brand contrast, night blue hour, muted vintage, vlog, desaturated documentary.
- **Drone (5):** Haze cut, sky punch, terrain contrast, water clarity, sunset aerial.

## 2. Website Development (`/site`)
We cloned the `sayso-website` repo into the `site/` subfolder, stripping all SaySo-specific content (docs, downloads, etc.) while preserving the Astro + React + Tailwind 4 architecture.

**Design System**
- Reverted to the requested SaySo aesthetic: Cream background (`#fffbe8`), Brand Yellow accent (`#ffe000`), Dark text (`#16150f`).
- Fonts: *Bagel Fat One* (headings) and *Fredoka* (body).
- Resolved Tailwind v4 `theme()` syntax bugs by replacing them with native CSS `rgba` values.

**Pages & Routing**
- **Home (`/`)**: Hero, feature grid (Self-authored, Two sources, 65-point, DaVinci native), and category shortcuts.
- **LUTs (`/luts`)**: Full catalog with individual cards and direct download buttons for all 23 creative LUTs.
- **Utility (`/utility`)**: Pipeline documentation (`Log -> Utility LUT -> Rec.709 -> Creative LUT`) and DaVinci node setup instructions, with downloads for the 2 utility LUTs.
- **About (`/about`)**: Studio philosophy (self-authored, no licensing risk).

## 3. Interactive Previews
- **Before/After Slider**: Built a custom, zero-dependency React component (`BeforeAfterSlider.tsx`) using native HTML range inputs for 60fps performance.
- **True Image Generation**: Wrote `apply_luts.py` using `Pillow` to mathematically apply the `.cube` files directly to user-provided base images. 
  - Applied the utility LUTs to the provided flat log image.
  - Applied the creative LUTs to the provided color-corrected image.
- Results were saved as optimized JPEGs in `site/public/previews/` and wired into the UI. No AI image generation was used for the previews — they are 100% accurate representations of the LUT math.

## 4. Deployment
- The `site/` directory was initialized as a Git repo.
- Pushed to `https://github.com/AaryanRaj007/Altnweb`.
- Deployed automatically via Cloudflare Pages (configured to use the `Astro` framework preset, `npm run build`, output `dist`).
