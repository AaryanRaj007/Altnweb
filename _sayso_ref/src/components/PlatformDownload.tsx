import { useEffect, useState } from "react";
import {
  PLATFORM_DOWNLOADS,
  VERSION_TAG,
  detectPlatform,
  type Platform,
} from "../config/downloads";
import { platformStore, type PlatformTab } from "../lib/platformStore";
import { usePlatform } from "../hooks/usePlatform";

const TABS: { id: PlatformTab; label: string }[] = [
  { id: "mac", label: "macOS" },
  { id: "windows", label: "Windows" },
];

const platformToTab = (p: Platform): PlatformTab => {
  if (p === "windows") return "windows";
  return "mac";
};

interface DownloadItem {
  href: string;
  label: string;
  extension: string;
}

interface DownloadGroup {
  arch: string;
  items: DownloadItem[];
}

const DOWNLOADS: Record<PlatformTab, DownloadGroup[]> = {
  mac: [
    {
      arch: "Download",
      items: [
        {
          href: PLATFORM_DOWNLOADS.mac[0].href,
          label: "Apple Silicon",
          extension: ".dmg",
        },
      ],
    },
  ],
  windows: [
    {
      arch: "Download",
      items: [
        {
          href: PLATFORM_DOWNLOADS.windowsX64[0].href,
          label: "x64",
          extension: ".exe",
        },
        {
          href: PLATFORM_DOWNLOADS.windowsX64[1].href,
          label: "x64",
          extension: ".msi",
        },
      ],
    },
  ],
};

function CopyableCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="!text-xs !leading-relaxed !bg-sayso-text/5 px-3 py-2 pr-10 !rounded-lg font-mono overflow-x-auto my-2 select-all">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-1/2 -translate-y-1/2 right-2 p-1 rounded bg-transparent hover:bg-sayso-text/5 text-sayso-text/30 hover:text-sayso-text/60 transition-colors cursor-pointer"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        )}
      </button>
    </div>
  );
}

function Instructions({ platform }: { platform: PlatformTab }) {
  const codeStyle = "text-xs bg-sayso-text/5 px-1.5 py-0.5 rounded font-mono";
  const preStyle =
    "!text-xs !leading-relaxed !bg-sayso-text/5 px-3 py-2 !rounded-lg font-mono overflow-x-auto my-2 select-all";
  const noteStyle = "text-xs text-sayso-text/50 mt-2";

  if (platform === "mac") {
    return (
      <div className="text-sm leading-relaxed text-sayso-text/70 mt-3">
        <p className="m-0 !mb-2">
          Open the <code className={codeStyle}>.dmg</code> and drag SaySo to
          your Applications folder.
        </p>
        {/* The upstream site offered a Homebrew cask here. SaySo does not have
            a tap yet, so the block is removed rather than left pointing at the
            upstream project's cask. Restore it once a SaySo tap exists. */}
      </div>
    );
  }

  // Windows is the only remaining branch.
  if (platform === "windows") {
    return (
      <div className="text-sm leading-relaxed text-sayso-text/70 mt-3">
        <p className="m-0 !mb-0">
          Run the <code className={codeStyle}>.exe</code> or{" "}
          <code className={codeStyle}>.msi</code> installer and follow the
          prompts. SaySo will be available from the Start menu.
        </p>
        {/* Upstream had a winget package here; SaySo has none yet. */}
      </div>
    );
  }

  return null;
}

export default function PlatformDownload() {
  const active = usePlatform();

  useEffect(() => {
    platformStore.set(platformToTab(detectPlatform()));
  }, []);

  const groups = DOWNLOADS[active];

  return (
    <div className="not-prose my-4 rounded-xl border border-sayso-text/8 bg-sayso-text/[0.02] p-4 sm:p-5">
      {/* Version tag + platform selector */}
      <div className="flex items-end justify-between border-b-2 border-sayso-text/10 mb-4">
        <div className="flex gap-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => platformStore.set(tab.id)}
              className={`text-sm pb-2 -mb-[2px] border-b-2 cursor-pointer transition-colors bg-transparent ${
                active === tab.id
                  ? "text-sayso-gold border-sayso-yellow font-semibold"
                  : "font-normal text-sayso-text/80 hover:text-sayso-gold border-transparent hover:border-sayso-yellow"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-sayso-text/35 pb-2">{VERSION_TAG}</span>
      </div>

      {/* Download buttons */}
      <div className="flex flex-col">
        {groups.map((group) => (
          <div key={group.arch || "default"}>
            {group.arch && (
              <div className="text-xs font-semibold text-sayso-text/50 uppercase tracking-wider mb-1.5">
                {group.arch}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sayso-yellow !text-sayso-deep hover:bg-sayso-light-yellow text-sm font-semibold !no-underline"
                >
                  {item.label}
                  <span className="opacity-60 text-xs">{item.extension}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Instructions platform={active} />
    </div>
  );
}
