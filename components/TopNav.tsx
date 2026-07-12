"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "Community", href: "/community" },
  { label: "Favorites", href: "/favorites" },
  { label: "Profile", href: "/profile" },
];

export default function TopNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 hidden border-b border-ink/10 bg-base/90 backdrop-blur md:block">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-serif text-lg tracking-wide text-ink">
          Best Kept Secret
          <span className="ml-2 align-middle text-[10px] uppercase tracking-widest text-coral">Prototype</span>
        </Link>
        <nav className="flex items-center gap-6">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition ${path === l.href ? "text-coral" : "text-ink/60 hover:text-ink"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
