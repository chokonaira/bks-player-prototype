"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { useOffline } from "@/lib/useOffline";
import { ArrowDownToLine } from "lucide-react";

export default function HomeHeader() {
  const { t } = useLocale();
  const { enabled: savedOffline, count } = useOffline();
  const [slot, setSlot] = useState<"evening" | "morning" | "afternoon" | "late">("evening");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setSlot("morning");
    else if (h >= 12 && h < 18) setSlot("afternoon");
    else if (h >= 22 || h < 5) setSlot("late");
  }, []);

  const title =
    slot === "morning" ? t("home.goodMorning")
    : slot === "afternoon" ? t("home.goodAfternoon")
    : slot === "late" ? t("home.upLate")
    : t("home.goodEvening");
  const sub =
    slot === "late" ? t("home.somethingSoft")
    : slot === "evening" ? t("home.moodTonight")
    : t("home.moodToday");

  return (
    <header className="mb-6 lg:mb-8 lg:max-w-3xl">
      <p className="text-[10px] uppercase tracking-[0.25em] text-coral">Prototype</p>
      <h1 className="mt-1 font-serif text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">{title}</h1>
      <p className="mt-2 text-sm text-ink/50 lg:text-base">{sub}</p>
      {savedOffline && (
        <Link href="/downloads"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1 text-xs text-coral transition hover:bg-coral/20">
          <ArrowDownToLine className="h-3 w-3" strokeWidth={2} />
          {t("offline.ready")} · {count} {t("offline.savedCount")}
        </Link>
      )}
    </header>
  );
}
