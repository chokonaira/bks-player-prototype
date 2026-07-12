"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";

const LINKS = [
  { key: "nav.home", href: "/" },
  { key: "nav.browse", href: "/browse" },
  { key: "nav.community", href: "/community" },
  { key: "nav.favorites", href: "/favorites" },
  { key: "nav.profile", href: "/profile" },
];

export default function TopNav() {
  const path = usePathname();
  const { t } = useLocale();
  return (
    <header className="sticky top-0 z-30 hidden border-b border-ink/10 bg-base/90 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="font-serif text-lg tracking-wide text-ink">
          Best Kept Secret
          <span className="ml-2 align-middle text-[10px] uppercase tracking-widest text-coral">Prototype</span>
        </Link>
        <nav className="flex items-center gap-6">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition ${path === l.href ? "text-coral" : "text-ink/60 hover:text-ink"}`}>
              {t(l.key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
