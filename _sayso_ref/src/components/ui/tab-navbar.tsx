import * as React from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import SaySoWordmark from "@/components/logo/SaySoWordmark";
import GithubIcon from "@/components/icons/GithubIcon";
import { GITHUB_URL } from "@/config/site";

/**
 * The site navbar.
 *
 * Adapted from the shadcn tab-navbar pattern. Deliberate differences from the
 * stock component: no search field and no sign-in button (SaySo has no
 * accounts and nothing to search), and plain <a> instead of next/link because
 * this is an Astro site, not Next.js.
 */

const INSTALL_METHODS: { href: string; title: string; blurb: string }[] = [
  {
    href: "/download#homebrew",
    title: "Homebrew",
    blurb: "One command, no security warning. The smoothest option.",
  },
  {
    href: "/download#direct",
    title: "Direct download",
    blurb: "Grab the .dmg and drag it to Applications.",
  },
  {
    href: "/download#source",
    title: "Build from source",
    blurb: "Clone the repo and build it yourself.",
  },
];

const DOC_LINKS: { href: string; title: string; blurb: string }[] = [
  {
    href: "/docs/getting-started",
    title: "Getting started",
    blurb: "Your first transcription in under a minute.",
  },
  {
    href: "/docs/models",
    title: "Models",
    blurb: "Pick the speech model that fits your machine.",
  },
  {
    href: "/docs/general",
    title: "Settings",
    blurb: "Shortcuts, microphones, and output behaviour.",
  },
  {
    href: "/docs/troubleshooting",
    title: "Troubleshooting",
    blurb: "When something isn't behaving.",
  },
];

function ListItem({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="!list-none">
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-lg p-3 leading-none !no-underline outline-none transition-colors hover:bg-sayso-yellow/25 focus:bg-sayso-yellow/25"
        >
          <div className="text-sm font-bold leading-none text-sayso-text">
            {title}
          </div>
          <p className="!m-0 line-clamp-2 text-sm leading-snug text-sayso-text/60">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export default function TabNavbar({ currentPath = "" }: { currentPath?: string }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");

  return (
    <header className="w-full sm:pt-8 pt-4" role="banner">
      <nav className="flex items-center justify-between gap-4">
        <a href="/" aria-label="SaySo home" className="shrink-0">
          <SaySoWordmark className="text-[2.25rem] sm:text-[2.75rem]" />
        </a>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>install</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[420px] lg:grid-cols-[.9fr_1fr] !my-0 !pl-0 !list-none">
                    <li className="row-span-3 !list-none">
                      <NavigationMenuLink asChild>
                        <a
                          href="/download"
                          className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-sayso-yellow p-4 !no-underline outline-none transition-colors hover:bg-sayso-light-yellow"
                        >
                          <div className="mb-1 text-lg font-bold text-sayso-deep">
                            Download SaySo
                          </div>
                          <p className="!m-0 text-sm leading-tight text-sayso-deep/70">
                            Free, offline, no account.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {INSTALL_METHODS.map((item) => (
                      <ListItem
                        key={item.href}
                        href={item.href}
                        title={item.title}
                      >
                        {item.blurb}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>docs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4 md:grid-cols-2 !my-0 !pl-0 !list-none">
                    {DOC_LINKS.map((item) => (
                      <ListItem
                        key={item.href}
                        href={item.href}
                        title={item.title}
                      >
                        {item.blurb}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "!no-underline",
                    isActive("about") && "text-sayso-gold",
                  )}
                  href="/about"
                >
                  about
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-lg hover:bg-sayso-yellow/25 transition-colors"
          >
            <GithubIcon width={20} height={20} className="fill-current" />
          </a>

          <a
            href="/download"
            className="px-5 py-2 rounded-lg bg-sayso-yellow !text-sayso-deep hover:bg-sayso-light-yellow font-bold text-sm !no-underline transition-colors"
          >
            download
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-sayso-yellow/25 bg-transparent cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden mt-3 rounded-xl border border-sayso-text/10 bg-background p-2"
        >
          <a
            href="/download"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/25"
          >
            download
          </a>
          {INSTALL_METHODS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-6 py-1.5 rounded-lg text-sm !font-normal !no-underline text-sayso-text/70 hover:bg-sayso-yellow/25"
            >
              {item.title}
            </a>
          ))}
          <a
            href="/docs"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/25"
          >
            docs
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/25"
          >
            about
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/25"
          >
            github
          </a>
        </div>
      )}
    </header>
  );
}
