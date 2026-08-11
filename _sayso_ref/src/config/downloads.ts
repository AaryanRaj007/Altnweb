import { RELEASES_URL } from "./site";

export const VERSION = "0.9.4";
export const VERSION_TAG = `v${VERSION}`;

export const GITHUB_RELEASE_BASE = `${RELEASES_URL}/releases/download/${VERSION_TAG}`;

/**
 * SaySo targets macOS (Apple Silicon) and Windows x64 only.
 *
 * Intel Macs, Windows on ARM and Linux are deliberately not shipped: no
 * prebuilt binaries are produced for them, so listing them would hand people
 * download links that 404. Building from source still works on those platforms.
 */
/**
 * Windows builds cannot be produced on macOS (Tauri needs the MSVC toolchain,
 * WebView2 and NSIS/WiX), so no Windows artifacts have been released yet.
 * Until the GitHub Actions release workflow has run on a Windows runner, the
 * UI advertises Windows as "coming soon" instead of linking to files that 404.
 * Flip this to true once the .exe/.msi are attached to a release.
 */
export const WINDOWS_AVAILABLE = false;

export type Platform = "mac" | "windows" | "unknown";

/**
 * The macOS build is served straight from this site (public/), so the download
 * works the moment the site is deployed, with no GitHub release required.
 * Windows will move to a release asset once CI produces one.
 */
export const MAC_DMG = `/SaySo_${VERSION}_aarch64.dmg`;

export const DOWNLOAD_LINKS: Record<Platform, string> = {
  mac: MAC_DMG,
  windows: `${GITHUB_RELEASE_BASE}/SaySo_${VERSION}_x64-setup.exe`,
  unknown: "/download", // fallback to download page
};

export const PLATFORM_DOWNLOADS = {
  mac: [
    {
      href: MAC_DMG,
      label: "Apple Silicon",
      extension: ".dmg",
    },
  ],
  windowsX64: [
    {
      href: `${GITHUB_RELEASE_BASE}/SaySo_${VERSION}_x64-setup.exe`,
      label: "Installer",
      extension: ".exe",
    },
    {
      href: `${GITHUB_RELEASE_BASE}/SaySo_${VERSION}_x64_en-US.msi`,
      label: "MSI",
      extension: ".msi",
    },
  ],
};

export const detectPlatform = (): Platform => {
  if (typeof window === "undefined") return "unknown"; // safety for SSR
  const { userAgent, platform } = window.navigator;

  if (/Win/i.test(platform) || /Windows NT/i.test(userAgent)) return "windows";
  if (/Mac/i.test(platform) || /Mac OS X/i.test(userAgent)) return "mac";

  return "unknown";
};

export const friendlyName = (p: Platform) => (p === "unknown" ? "" : `for ${p}`);
