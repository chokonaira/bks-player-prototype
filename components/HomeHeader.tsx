"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";

export default function HomeHeader() {
  const { t } = useLocale();
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
    <header className="mb-6">
      <p className="text-[10px] uppercase tracking-[0.25em] text-coral">Prototype</p>
      <h1 className="mt-1 font-serif text-4xl tracking-tight text-ink md:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">{sub}</p>
    </header>
  );
}
