"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Star, User } from "lucide-react";

const TABS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Browse", href: "/browse", Icon: Search },
  { label: "Community", href: "/community", Icon: Heart },
  { label: "Favorites", href: "/favorites", Icon: Star },
  { label: "Profile", href: "/profile", Icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-ink/10 bg-surface md:hidden">
      {TABS.map(({ label, href, Icon }) => {
        const active = href === path;
        return (
          <Link key={label} href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] ${active ? "text-coral" : "text-ink/50"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
