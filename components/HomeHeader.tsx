"use client";

import { useEffect, useState } from "react";

export default function HomeHeader() {
  const [greeting, setGreeting] = useState({ title: "Good evening", sub: "What are you in the mood for tonight?" });

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting({ title: "Good morning", sub: "What are you in the mood for today?" });
    else if (h >= 12 && h < 18) setGreeting({ title: "Good afternoon", sub: "What are you in the mood for today?" });
    else if (h >= 22 || h < 5) setGreeting({ title: "Up late?", sub: "Something soft to fall asleep to…" });
  }, []);

  return (
    <header className="mb-6">
      <p className="text-[10px] uppercase tracking-[0.25em] text-coral">Prototype</p>
      <h1 className="mt-1 font-serif text-4xl tracking-tight text-ink md:text-5xl">{greeting.title}</h1>
      <p className="mt-2 text-sm text-ink/50">{greeting.sub}</p>
    </header>
  );
}
