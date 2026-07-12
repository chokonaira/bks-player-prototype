"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Home", icon: "⌂", href: "/" },
  { label: "Browse", icon: "⌕", href: "/browse" },
  { label: "Community", icon: "❤", href: "/" },
  { label: "Favorites", icon: "★", href: "/" },
  { label: "Profile", icon: "☺", href: "/" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-white/10 bg-[#141414] md:hidden">
      {TABS.map((t) => {
        // placeholder tabs point at "/" — only Home may claim it as active
        const active = t.href === path && (t.href !== "/" || t.label === "Home");
        return (
          <Link key={t.label} href={t.href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${active ? "text-coral" : "text-white/50"}`}>
            <span className="text-lg leading-none">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
