"use client";

const TABS = [
  { label: "Home", icon: "⌂" },
  { label: "Browse", icon: "⌕" },
  { label: "Community", icon: "❤" },
  { label: "Favorites", icon: "★" },
  { label: "Profile", icon: "☺" },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-white/10 bg-[#141414] md:hidden">
      {TABS.map((t, i) => (
        <button key={t.label}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${i === 0 ? "text-coral" : "text-white/50"}`}>
          <span className="text-lg leading-none">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
