"use client";

import { useState } from "react";
import { usePlayer } from "./PlayerProvider";
import { AUDIOS, initials } from "@/lib/mockData";
import { Play, Pause, Moon, ChevronDown, RotateCcw, RotateCw } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import SeekBar from "./SeekBar";

const fmt = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const SLEEP_OPTS = [10, 20, 30, 45];

export default function MiniPlayer() {
  const p = usePlayer();
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const [sleepOpen, setSleepOpen] = useState(false);
  if (!p.current) return null;

  return (
    <>
      {/* COLLAPSED BAR */}
      {!expanded && (
        <div className="fixed inset-x-0 bottom-14 md:bottom-0 z-40 border-t border-ink/10 bg-surface/95 backdrop-blur">
          <div className="-mb-1 px-1">
            <SeekBar compact value={p.time} max={p.duration} onSeek={p.seek} />
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <button onClick={() => setExpanded(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <div className={`h-10 w-10 shrink-0 rounded-md bg-gradient-to-br ${p.current.cover}`} />
              <div className="min-w-0">
                <p className="truncate font-serif text-[15px] text-ink">{p.current.title}</p>
                <p className="truncate text-xs text-ink/50">{p.current.voiceActor}</p>
              </div>
            </button>
            <button onClick={() => p.skip(-15)} aria-label="Back 15 seconds" className="relative grid place-items-center text-ink/70 hover:text-ink">
              <RotateCcw className="h-6 w-6" strokeWidth={1.6} />
              <span className="absolute text-[7px] font-semibold">15</span>
            </button>
            <button onClick={p.toggle} aria-label={p.playing ? "Pause" : "Play"} className="grid h-9 w-9 place-items-center rounded-full bg-coral text-black">
              {p.playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 translate-x-px fill-current" />}
            </button>
            <button onClick={() => p.skip(30)} aria-label="Forward 30 seconds" className="relative grid place-items-center text-ink/70 hover:text-ink">
              <RotateCw className="h-6 w-6" strokeWidth={1.6} />
              <span className="absolute text-[7px] font-semibold">30</span>
            </button>
          </div>
        </div>
      )}

      {/* EXPANDED FULL-SCREEN */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-base px-6 pb-10 pt-6">
          <button onClick={() => setExpanded(false)} className="flex items-center gap-1 self-start text-sm text-ink/60">
            <ChevronDown className="h-4 w-4" /> {t("player.close")}
          </button>
          <div className={`relative mx-auto mt-4 aspect-square w-full max-w-[300px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${p.current.cover} shadow-xl shadow-black/20 ${p.playing ? "ambient-playing" : ""}`}>
            <span aria-hidden className="cover-texture" />
            <div className="ambient-blob ambient-blob-a" />
            <div className="ambient-blob ambient-blob-b" />
            <div className="ambient-spark" style={{ left: "20%", top: "68%" }} />
            <div className="ambient-spark" style={{ left: "72%", top: "58%", animationDelay: "1.8s" }} />
            <div className="ambient-spark" style={{ left: "38%", top: "34%", animationDelay: "3.2s" }} />
            <div className="ambient-spark" style={{ left: "84%", top: "26%", animationDelay: "4.6s" }} />
            <div className="ambient-spark" style={{ left: "55%", top: "78%", animationDelay: "5.7s" }} />
            <span className="absolute inset-0 grid place-items-center font-serif text-6xl italic text-white/10">
              {initials(p.current.title)}
            </span>
          </div>
          <div className="mx-auto mt-6 w-full max-w-sm">
            <h2 className="font-serif text-3xl tracking-tight text-ink">{p.current.title}</h2>
            <p className="mt-1 text-ink/50">{p.current.voiceActor}</p>

            <div className="mt-6">
              <SeekBar value={p.time} max={p.duration} onSeek={p.seek} />
            </div>
            <div className="flex justify-between text-xs text-ink/40">
              <span>{fmt(p.time)}</span><span>{fmt(p.duration)}</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8">
              <button onClick={() => p.skip(-15)} aria-label="Back 15 seconds" className="relative grid place-items-center text-ink/80">
                <RotateCcw className="h-8 w-8" strokeWidth={1.6} />
                <span className="absolute text-[9px] font-semibold">15</span>
              </button>
              <button onClick={p.toggle} aria-label={p.playing ? "Pause" : "Play"} className="grid h-16 w-16 place-items-center rounded-full bg-coral text-black">
                {p.playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 translate-x-0.5 fill-current" />}
              </button>
              <button onClick={() => p.skip(30)} aria-label="Forward 30 seconds" className="relative grid place-items-center text-ink/80">
                <RotateCw className="h-8 w-8" strokeWidth={1.6} />
                <span className="absolute text-[9px] font-semibold">30</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {/* speed */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/40">{t("player.speed")}</span>
                {SPEEDS.map((s) => (
                  <button key={s} onClick={() => p.setSpeed(s)}
                    className={`rounded px-2 py-1 text-xs ${p.speed === s ? "bg-coral text-black" : "text-ink/60"}`}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            {/* sleep timer */}
            <div className="mt-4">
              <button onClick={() => setSleepOpen((o) => !o)} className="flex items-center gap-2 text-sm text-ink/70">
                <Moon className="h-4 w-4" strokeWidth={1.8} />
                {t("player.sleepTimer")} {p.sleepRemaining !== null ? `· ${fmt(p.sleepRemaining)}` : ""}
              </button>
              {sleepOpen && (
                <div className="mt-2 flex gap-2">
                  {SLEEP_OPTS.map((m) => (
                    <button key={m} onClick={() => { p.setSleep(m); setSleepOpen(false); }}
                      className="rounded bg-ink/5 px-3 py-1 text-xs text-ink/80 hover:bg-ink/10">
                      {m}m
                    </button>
                  ))}
                  <button onClick={() => { p.setSleep(null); setSleepOpen(false); }}
                    className="rounded px-3 py-1 text-xs text-coral">{t("player.off")}</button>
                </div>
              )}
            </div>

            {/* about */}
            <div className="mt-6 border-t border-ink/10 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-coral/15 px-3 py-1 text-xs text-coral">{p.current.category}</span>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs text-ink/60">{p.current.tier} Tier</span>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs text-ink/60">{Math.round(p.current.duration / 60)} {t("player.min")}</span>
              </div>
              <p className="mt-3 text-xs text-ink/40">Written by {p.current.writer}</p>
            </div>

            {/* queue */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-ink/70">{t("player.upNext")}</h3>
              <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.02]">
                <div className="flex items-center gap-3 bg-coral/5 p-3">
                  <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${p.current.cover}`}>
                    <span className="absolute inset-0 grid place-items-center font-serif text-sm italic text-white/25">
                      {initials(p.current.title)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wide text-coral">{t("player.nowPlaying")}</p>
                    <p className="truncate font-serif text-[15px] text-ink">{p.current.title}</p>
                  </div>
                  <div className={`eq shrink-0 ${p.playing ? "" : "paused"}`} aria-hidden>
                    <span /><span /><span />
                  </div>
                </div>
                {AUDIOS.filter((a) => a.id !== p.current!.id).slice(0, 3).map((a) => (
                  <button key={a.id} onClick={() => p.play(a)}
                    className="group flex w-full items-center gap-3 p-3 text-left transition hover:bg-ink/[0.04]">
                    <div className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${a.cover}`}>
                      <span className="absolute inset-0 grid place-items-center font-serif text-sm italic text-white/25">
                        {initials(a.title)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[15px] text-ink">{a.title}</p>
                      <p className="truncate text-xs text-ink/50">{a.voiceActor} · {Math.round(a.duration / 60)} {t("player.min")}</p>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-ink/50 transition group-hover:border-coral group-hover:bg-coral group-hover:text-black">
                      <Play className="h-3.5 w-3.5 translate-x-px fill-current" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
