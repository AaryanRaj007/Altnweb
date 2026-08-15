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
import AltnWordmark from "@/components/logo/AltnWordmark";

const LUT_CATEGORIES: { href: string; title: string; blurb: string }[] = [
  {
    href: "/luts#natural",
    title: "Natural",
    blurb: "Neutral baselines and gentle corrections. 5 LUTs.",
  },
  {
    href: "/luts#cinematic",
    title: "Cinematic",
    blurb: "Film looks, teal-orange, golden/blue hour. 8 LUTs.",
  },
  {
    href: "/luts#mood",
    title: "Mood",
    blurb: "Bold creative grades - vintage, vlog, documentary. 5 LUTs.",
  },
  {
    href: "/luts#drone",
    title: "Drone",
    blurb: "Haze cut, sky punch, terrain, water, sunset. 5 LUTs.",
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
          className="block select-none space-y-1 rounded-lg p-3 leading-none !no-underline outline-none transition-colors hover:bg-sayso-yellow/10 focus:bg-sayso-yellow/10"
        >
          <div className="text-sm font-bold leading-none text-sayso-text">
            {title}
          </div>
          <p className="!m-0 line-clamp-2 text-sm leading-snug text-sayso-text/50">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export default function TabNavbar({ currentPath = "" }: { currentPath?: string }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");

  return (
    <header 
      className={cn(
        "w-full sm:pt-8 pt-4 relative z-50 transition-all duration-500",
        isScrolled ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100"
      )} 
      role="banner"
    >
      <nav className="flex items-center justify-between gap-4">
        <a href="/" aria-label="altn home" className="shrink-0">
          <AltnWordmark className="text-[2.25rem] sm:text-[2.75rem]" />
        </a>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>luts</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[420px] lg:grid-cols-[.9fr_1fr] !my-0 !pl-0 !list-none">
                    <li className="row-span-4 !list-none">
                      <NavigationMenuLink asChild>
                        <a
                          href="/luts"
                          className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-sayso-yellow/10 border border-sayso-yellow/20 p-4 !no-underline outline-none transition-colors hover:bg-sayso-yellow/15"
                        >
                          <div className="mb-1 text-lg font-bold text-sayso-yellow">
                            33 LUTs
                          </div>
                          <p className="!m-0 text-sm leading-tight text-sayso-text/60">
                            Self-authored. No licensing risk.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {LUT_CATEGORIES.map((item) => (
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
                    isActive("plugins") && "text-sayso-yellow",
                  )}
                  href="/plugins"
                >
                  plugins
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "!no-underline",
                    isActive("utility") && "text-sayso-yellow",
                  )}
                  href="/utility"
                >
                  utility
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "!no-underline",
                    isActive("about") && "text-sayso-yellow",
                  )}
                  href="/about"
                >
                  about
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <a
            href="/luts"
            className="px-5 py-2 rounded-lg bg-white text-black hover:bg-gray-200 font-bold text-sm !no-underline transition-colors"
          >
            get the pack
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-sayso-yellow/10 bg-transparent cursor-pointer"
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
            href="/luts"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/10"
          >
            luts
          </a>
          {LUT_CATEGORIES.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-6 py-1.5 rounded-lg text-sm !font-normal !no-underline text-sayso-text/60 hover:bg-sayso-yellow/10"
            >
              {item.title}
            </a>
          ))}
          <a
            href="/plugins"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/10"
          >
            plugins
          </a>
          <a
            href="/utility"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/10"
          >
            utility
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-lg font-bold !no-underline hover:bg-sayso-yellow/10"
          >
            about
          </a>
        </div>
      )}
    </header>
  );
}
