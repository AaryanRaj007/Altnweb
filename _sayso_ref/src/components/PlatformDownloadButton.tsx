import { useEffect, useState } from "react";
import {
  DOWNLOAD_LINKS,
  WINDOWS_AVAILABLE,
  detectPlatform,
  friendlyName,
  type Platform,
} from "../config/downloads";

const PlatformDownloadButton = () => {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // No Windows build has shipped yet, so send Windows visitors to the download
  // page (which says "coming soon") rather than at a release asset that 404s.
  const windowsPending = platform === "windows" && !WINDOWS_AVAILABLE;
  const href = windowsPending ? "/download#windows" : DOWNLOAD_LINKS[platform];

  return (
    <a
      href={href}
      className="text-base sm:text-xl px-6 py-4 rounded-lg bg-sayso-yellow !text-sayso-deep hover:bg-sayso-light-yellow"
      aria-label={
        windowsPending
          ? "Windows build coming soon, see the download page"
          : `Download SaySo ${platform === "unknown" ? "for your operating system" : `for ${platform}`}`
      }
      role="button"
    >
      {windowsPending
        ? "windows coming soon"
        : `download sayso ${friendlyName(platform)}`}
    </a>
  );
};

export default PlatformDownloadButton;
