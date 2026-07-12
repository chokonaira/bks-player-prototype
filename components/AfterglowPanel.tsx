"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Heart, RotateCcw, Sparkles, X } from "lucide-react";
import { AUDIOS, initials, type Audio } from "@/lib/mockData";
import { useFavorites } from "@/lib/useFavorites";
import { AFTERGLOW_MOODS, recommendationFor } from "@/lib/afterglowRecommendations.mjs";
import { useLocale } from "./LocaleProvider";

type Mood = "soft" | "wanted" | "comforted" | "part2";

const MOODS = AFTERGLOW_MOODS as Mood[];

export default function AfterglowPanel({
  audio,
  locked,
  onDismiss,
  onPlay,
  onReplay,
}: {
  audio: Audio;
  locked: boolean;
  onDismiss: () => void;
  onPlay: (audio: Audio) => void;
  onReplay: (audio: Audio) => void;
}) {
  const { t } = useLocale();
  const { isFav, toggle } = useFavorites();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const saved = isFav(audio.id);
  const recommendation = useMemo(
    () => recommendationFor(AUDIOS, audio, selectedMood) as Audio,
    [audio, selectedMood]
  );

  useEffect(() => {
    setSelectedMood(null);
  }, [audio.id]);

  return (
    <section className="afterglow-callout relative mt-5 overflow-hidden rounded-2xl border border-coral/35 bg-gradient-to-br from-coral/15 via-surface to-coral/[0.04] shadow-xl shadow-coral/10 ring-1 ring-coral/10">
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-coral" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral text-black shadow-md shadow-coral/25">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-coral">{t("afterglow.eyebrow")}</p>
              <h3 className="mt-1 font-serif text-2xl leading-tight text-ink">{t("afterglow.title")}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">{t("afterglow.note")}</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            aria-label={t("afterglow.dismiss")}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/55 transition hover:bg-ink/10 hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {MOODS.map((mood) => {
            const active = selectedMood === mood;
            return (
              <button
                key={mood}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedMood(active ? null : mood)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-coral bg-coral text-black"
                    : "border-ink/10 bg-base/65 text-ink/65 hover:border-coral/50 hover:text-ink"
                }`}
              >
                {t(`afterglow.mood.${mood}`)}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink/10 bg-base/70 p-3">
          <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${recommendation.cover}`}>
            <span aria-hidden className="cover-texture" />
            <span className="absolute inset-0 grid place-items-center font-serif text-sm italic text-white/25">
              {initials(recommendation.title)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wide text-coral">{t("afterglow.nextMatch")}</p>
            <p className="truncate font-serif text-[15px] text-ink">{recommendation.title}</p>
            <p className="truncate text-xs text-ink/50">{recommendation.category}</p>
          </div>
          <button
            onClick={() => onPlay(recommendation)}
            disabled={locked}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t("afterglow.keepListening")}
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => onReplay(audio)}
            disabled={locked}
            className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full bg-ink/5 px-3 py-2 text-xs text-ink/70 transition hover:bg-ink/10 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span className="truncate">{t("afterglow.replay")}</span>
          </button>
          <button
            onClick={() => !saved && toggle(audio.id)}
            aria-pressed={saved}
            className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs transition ${
              saved ? "bg-coral/15 text-coral" : "bg-ink/5 text-ink/70 hover:bg-ink/10 hover:text-ink"
            }`}
          >
            {saved ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Heart className="h-3.5 w-3.5" strokeWidth={1.8} />}
            <span className="truncate">{saved ? t("afterglow.saved") : t("afterglow.save")}</span>
          </button>
          <button
            onClick={() => onPlay(recommendation)}
            disabled={locked}
            className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full bg-coral px-3 py-2 text-xs text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="truncate">{t("afterglow.keepListening")}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
