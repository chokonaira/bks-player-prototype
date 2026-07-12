"use client";

import { usePlayer } from "./PlayerProvider";
import { CONTINUE } from "@/lib/mockData";
import { useLocale } from "./LocaleProvider";
import { Play, Pause } from "lucide-react";

export default function ContinueListeningRail() {
  const { play, current, playing } = usePlayer();
  const { t } = useLocale();
  if (!CONTINUE.length) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-2xl text-ink md:text-3xl">{t("home.continueListening")}</h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {CONTINUE.map((a) => (
          <button key={a.id} onClick={() => play(a)}
            className="group flex w-64 shrink-0 items-center gap-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-3 text-left shadow-lg shadow-black/5 transition hover:bg-ink/[0.06]">
            <div className={`relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br ${a.cover}`}>
              {current?.id === a.id && playing
                ? <Pause className="h-5 w-5 fill-current text-white opacity-0 transition group-hover:opacity-100" />
                : <Play className="h-5 w-5 translate-x-px fill-current text-white opacity-0 transition group-hover:opacity-100" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[15px] text-ink">{a.title}</p>
              <p className="truncate text-xs text-ink/50">{a.voiceActor}</p>
              <div className="mt-2 h-1 w-full rounded bg-ink/10">
                <div className="h-full rounded bg-coral" style={{ width: `${(a.progress ?? 0) * 100}%` }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
