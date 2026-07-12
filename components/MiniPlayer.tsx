"use client";

import { useState, type UIEvent } from "react";
import { usePlayer } from "./PlayerProvider";
import { AUDIOS, initials } from "@/lib/mockData";
import { Play, Pause, Moon, ChevronDown, RotateCcw, RotateCw, Heart } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import { useOffline } from "@/lib/useOffline";
import { useOnlineStatus } from "@/lib/useOnlineStatus";
import { useMoments } from "@/lib/useMoments";
import SeekBar from "./SeekBar";
import AfterglowPanel from "./AfterglowPanel";

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
  const { enabled: savedOffline } = useOffline();
  const { addMoment } = useMoments();
  const online = useOnlineStatus();
  const locked = !online && !savedOffline;
  const [expanded, setExpanded] = useState(false);
  const [artCompact, setArtCompact] = useState(false);
  const [sleepOpen, setSleepOpen] = useState(false);
  const [momentSaved, setMomentSaved] = useState(false);
  if (!p.current) return null;
  const sleepActive = p.sleepRemaining !== null;

  const openExpanded = () => {
    setArtCompact(false);
    setExpanded(true);
  };

  const closeExpanded = () => {
    setExpanded(false);
    setArtCompact(false);
  };

  const handleExpandedScroll = (event: UIEvent<HTMLDivElement>) => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setArtCompact(false);
      return;
    }
    const scrollTop = event.currentTarget.scrollTop;
    setArtCompact((compact) => {
      const next = compact ? scrollTop > 24 : scrollTop > 72;
      return compact === next ? compact : next;
    });
  };

  const saveMoment = () => {
    addMoment(p.current!.id, p.time);
    setMomentSaved(true);
    setTimeout(() => setMomentSaved(false), 1800);
  };

  return (
    <>
      {/* COLLAPSED BAR */}
      {!expanded && (
        <div className="fixed inset-x-0 bottom-14 z-40 border-t border-ink/10 bg-surface/95 backdrop-blur md:bottom-6 md:left-auto md:right-6 md:w-[440px] md:overflow-hidden md:rounded-2xl md:border md:shadow-2xl md:shadow-black/15">
          <div className="-mb-1 px-1">
            <SeekBar compact value={p.time} max={p.duration} onSeek={p.seek} />
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <button onClick={openExpanded} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <div className={`h-10 w-10 shrink-0 rounded-md bg-gradient-to-br ${p.current.cover}`} />
              <div className="min-w-0">
                <p className="truncate font-serif text-[15px] text-ink">{p.current.title}</p>
                <p className={`truncate text-xs ${p.completed ? "text-coral" : "text-ink/50"}`}>
                  {p.completed ? t("afterglow.ready") : p.current.voiceActor}
                </p>
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
        <div
          onScroll={handleExpandedScroll}
          className={`fixed inset-0 z-50 overflow-y-auto bg-base pb-10 transition-colors duration-500 lg:px-8 ${sleepActive ? "sleep-ritual" : ""}`}
        >
          <div className="lg:grid lg:min-h-screen lg:grid-cols-[minmax(360px,480px)_minmax(440px,560px)] lg:items-start lg:justify-center lg:gap-16 lg:py-12">
          <div
            className={`sticky top-0 z-50 bg-base/95 px-6 pt-6 backdrop-blur transition-[padding,box-shadow,background-color] duration-500 ease-out lg:top-12 lg:bg-transparent lg:px-0 lg:pt-0 lg:backdrop-blur-0 ${
              artCompact ? "pb-3 shadow-lg shadow-black/5" : "pb-2"
            }`}
          >
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <button
                onClick={closeExpanded}
                aria-label={t("player.close")}
                className={`transition-all duration-500 ease-out ${
                  artCompact
                    ? "absolute left-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white/90 backdrop-blur hover:bg-black/60"
                    : "mb-4 flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
                <span className={artCompact ? "sr-only" : ""}>{t("player.close")}</span>
              </button>
              <div className={`player-art-shell relative mx-auto w-full shrink-0 overflow-hidden bg-gradient-to-br ${p.current.cover} shadow-xl shadow-black/20 ${p.playing ? "ambient-playing" : ""} ${sleepActive ? "sleep-ritual-art" : ""} ${
                artCompact
                  ? "player-art-compact rounded-xl"
                  : "player-art-expanded rounded-2xl"
              }`}>
                <span aria-hidden className="cover-texture" />
                <div className="ambient-blob ambient-blob-a" />
                <div className="ambient-blob ambient-blob-b" />
                <div className="ambient-spark" style={{ left: "20%", top: "68%" }} />
                <div className="ambient-spark" style={{ left: "72%", top: "58%", animationDelay: "1.8s" }} />
                <div className="ambient-spark" style={{ left: "38%", top: "34%", animationDelay: "3.2s" }} />
                <div className="ambient-spark" style={{ left: "84%", top: "26%", animationDelay: "4.6s" }} />
                <div className="ambient-spark" style={{ left: "55%", top: "78%", animationDelay: "5.7s" }} />
                <span className={`absolute inset-0 grid place-items-center font-serif italic text-white/10 transition-all duration-300 ${
                  artCompact ? "text-5xl" : "text-6xl"
                }`}>
                  {initials(p.current.title)}
                </span>
                {sleepActive && (
                  <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs text-white/85 backdrop-blur">
                    <Moon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {fmt(p.sleepRemaining ?? 0)}
                  </span>
                )}
                <div className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 text-white transition-all duration-300 ${
                  artCompact ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                }`}>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-coral">{t("player.nowPlaying")}</p>
                    <p className="truncate font-serif text-base text-white">{p.current.title}</p>
                  </div>
                  <button
                    onClick={p.toggle}
                    aria-label={p.playing ? "Pause" : "Play"}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral text-black shadow-lg"
                  >
                    {p.playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 translate-x-px fill-current" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-6 w-full max-w-sm px-6 lg:mx-0 lg:mt-11 lg:max-w-none lg:px-0">
            <h2 className="font-serif text-3xl tracking-tight text-ink lg:text-5xl">{p.current.title}</h2>
            <p className="mt-1 text-ink/50 lg:text-base">{p.current.voiceActor}</p>

            {p.completed && (
              <AfterglowPanel
                audio={p.completed}
                locked={locked}
                onDismiss={p.dismissAfterglow}
                onPlay={p.play}
                onReplay={p.replay}
              />
            )}

            <div className="mt-6">
              <SeekBar value={p.time} max={p.duration} onSeek={p.seek} />
            </div>
            <div className="flex justify-between text-xs text-ink/40">
              <span>{fmt(p.time)}</span><span>{fmt(p.duration)}</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8 lg:justify-start lg:gap-7">
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

            <button
              onClick={saveMoment}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                momentSaved
                  ? "border-coral bg-coral/10 text-coral"
                  : "border-ink/10 bg-ink/[0.03] text-ink/65 hover:border-coral/40 hover:text-ink"
              }`}
            >
              <Heart className={`h-4 w-4 ${momentSaved ? "fill-coral text-coral" : ""}`} strokeWidth={1.8} />
              {momentSaved ? t("moments.saved") : t("moments.save")}
            </button>

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
              <button
                onClick={() => setSleepOpen((o) => !o)}
                className={`flex items-center gap-2 text-sm transition ${
                  sleepActive
                    ? "rounded-full bg-coral/10 px-3 py-2 text-coral"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                <Moon className="h-4 w-4" strokeWidth={1.8} />
                {t("player.sleepTimer")} {p.sleepRemaining !== null ? `· ${fmt(p.sleepRemaining)}` : ""}
              </button>
              {sleepActive && (
                <div className="mt-3 rounded-2xl border border-coral/15 bg-coral/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-coral">{t("player.sleepActive")}</p>
                      <p className="mt-0.5 truncate text-sm text-ink/70">{fmt(p.sleepRemaining ?? 0)}</p>
                    </div>
                    <button
                      onClick={() => p.setSleep(null)}
                      className="shrink-0 rounded-full bg-base/70 px-3 py-1.5 text-xs text-ink/70 transition hover:bg-base hover:text-ink"
                    >
                      {t("player.cancel")}
                    </button>
                  </div>
                </div>
              )}
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
                {(() => {
                  const idx = AUDIOS.findIndex((a) => a.id === p.current!.id);
                  return [...AUDIOS.slice(idx + 1), ...AUDIOS.slice(0, idx)].slice(0, 3);
                })().map((a) => (
                  <button key={a.id} onClick={() => !locked && p.play(a)} aria-disabled={locked}
                    className={`group flex w-full items-center gap-3 p-3 text-left transition hover:bg-ink/[0.04] ${locked ? "cursor-not-allowed opacity-40 grayscale" : ""}`}>
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
        </div>
      )}
    </>
  );
}
