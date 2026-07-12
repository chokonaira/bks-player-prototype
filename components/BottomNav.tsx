"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Star, User } from "lucide-react";

const TABS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Browse", href: "/browse", Icon: Search },
  { label: "Community", href: "/", Icon: Heart },
  { label: "Favorites", href: "/", Icon: Star },
  { label: "Profile", href: "/", Icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-white/10 bg-[#141414] md:hidden">
      {TABS.map(({ label, href, Icon }) => {
        // placeholder tabs point at "/" — only Home may claim it as active
        const active = href === path && (href !== "/" || label === "Home");
        return (
          <Link key={label} href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] ${active ? "text-coral" : "text-white/50"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
