"use client";

import { usePlayer } from "./PlayerProvider";
import { CONTINUE } from "@/lib/mockData";

export default function ContinueListeningRail() {
  const { play } = usePlayer();
  if (!CONTINUE.length) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-2xl text-ink md:text-3xl">Continue Listening</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {CONTINUE.map((a) => (
          <button key={a.id} onClick={() => play(a)}
            className="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-ink/10 bg-ink/[0.03] p-3 text-left">
            <div className={`h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br ${a.cover}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{a.title}</p>
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
