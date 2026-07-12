"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Users, User } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import { fallbackTabForPath, isMainTabHref, LAST_ACTIVE_TAB_KEY, tabForPath, type MainTabHref } from "@/lib/navTabs";
import { useEffect, useState } from "react";

const TABS = [
  { key: "nav.home", href: "/", Icon: Home },
  { key: "nav.browse", href: "/browse", Icon: Search },
  { key: "nav.community", href: "/community", Icon: Users },
  { key: "nav.favorites", href: "/favorites", Icon: Heart },
  { key: "nav.profile", href: "/profile", Icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  const { t } = useLocale();
  const [activeHref, setActiveHref] = useState<MainTabHref>(() => tabForPath(path) ?? "/");

  useEffect(() => {
    const directTab = tabForPath(path);
    if (directTab) {
      setActiveHref(directTab);
      try { localStorage.setItem(LAST_ACTIVE_TAB_KEY, directTab); } catch {}
      return;
    }

    try {
      const stored = localStorage.getItem(LAST_ACTIVE_TAB_KEY);
      setActiveHref(isMainTabHref(stored) ? stored : fallbackTabForPath(path));
    } catch {
      setActiveHref(fallbackTabForPath(path));
    }
  }, [path]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-ink/10 bg-surface md:hidden">
      {TABS.map(({ key, href, Icon }) => {
        const active = href === activeHref;
        return (
          <Link key={key} href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] ${active ? "text-coral" : "text-ink/50"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
