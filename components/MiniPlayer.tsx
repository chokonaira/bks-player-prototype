"use client";

import { useState } from "react";
import { usePlayer } from "./PlayerProvider";

const fmt = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const SLEEP_OPTS = [10, 20, 30, 45];

export default function MiniPlayer() {
  const p = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const [sleepOpen, setSleepOpen] = useState(false);
  if (!p.current) return null;

  const pct = p.duration ? (p.time / p.duration) * 100 : 0;

  return (
    <>
      {/* COLLAPSED BAR */}
      {!expanded && (
        <div className="fixed inset-x-0 bottom-14 md:bottom-0 z-40 border-t border-white/10 bg-[#141414]/95 backdrop-blur">
          <div className="h-0.5 w-full bg-white/10">
            <div className="h-full bg-coral" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center gap-3 px-4 py-2">
            <button onClick={() => setExpanded(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <div className={`h-10 w-10 shrink-0 rounded-md bg-gradient-to-br ${p.current.cover}`} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{p.current.title}</p>
                <p className="truncate text-xs text-white/50">{p.current.voiceActor}</p>
              </div>
            </button>
            <button onClick={() => p.skip(-15)} className="text-white/70 hover:text-white text-xs">−15</button>
            <button onClick={p.toggle} className="grid h-9 w-9 place-items-center rounded-full bg-coral text-black">
              {p.playing ? "❚❚" : "►"}
            </button>
            <button onClick={() => p.skip(30)} className="text-white/70 hover:text-white text-xs">+30</button>
          </div>
        </div>
      )}

      {/* EXPANDED FULL-SCREEN */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#0d0d0d] px-6 pb-10 pt-6">
          <button onClick={() => setExpanded(false)} className="self-start text-white/60">▼ Close</button>
          <div className={`mx-auto mt-6 aspect-square w-full max-w-sm rounded-2xl bg-gradient-to-br ${p.current.cover}`} />
          <div className="mx-auto mt-8 w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-white">{p.current.title}</h2>
            <p className="mt-1 text-white/50">{p.current.voiceActor}</p>

            <input
              type="range" min={0} max={p.duration || 0} value={p.time}
              onChange={(e) => p.seek(Number(e.target.value))}
              className="mt-6 w-full accent-coral"
            />
            <div className="flex justify-between text-xs text-white/40">
              <span>{fmt(p.time)}</span><span>{fmt(p.duration)}</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8">
              <button onClick={() => p.skip(-15)} className="text-white/80">−15s</button>
              <button onClick={p.toggle} className="grid h-16 w-16 place-items-center rounded-full bg-coral text-2xl text-black">
                {p.playing ? "❚❚" : "►"}
              </button>
              <button onClick={() => p.skip(30)} className="text-white/80">+30s</button>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {/* speed */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Speed</span>
                {SPEEDS.map((s) => (
                  <button key={s} onClick={() => p.setSpeed(s)}
                    className={`rounded px-2 py-1 text-xs ${p.speed === s ? "bg-coral text-black" : "text-white/60"}`}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            {/* sleep timer */}
            <div className="mt-6">
              <button onClick={() => setSleepOpen((o) => !o)} className="text-sm text-white/70">
                🌙 Sleep timer {p.sleepRemaining !== null ? `· ${fmt(p.sleepRemaining)}` : ""}
              </button>
              {sleepOpen && (
                <div className="mt-2 flex gap-2">
                  {SLEEP_OPTS.map((m) => (
                    <button key={m} onClick={() => { p.setSleep(m); setSleepOpen(false); }}
                      className="rounded bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10">
                      {m}m
                    </button>
                  ))}
                  <button onClick={() => { p.setSleep(null); setSleepOpen(false); }}
                    className="rounded px-3 py-1 text-xs text-coral">Off</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
