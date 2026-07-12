"use client";

import Link from "next/link";
import { usePlayer } from "./PlayerProvider";
import type { Audio } from "@/lib/mockData";

export default function AudioCard({ audio }: { audio: Audio }) {
  const { play, current, playing } = usePlayer();
  const isCurrent = current?.id === audio.id;
  return (
    <div className="group w-40 shrink-0 md:w-48">
      <button onClick={() => play(audio)}
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br ${audio.cover}`}>
        <span className="absolute inset-0 grid place-items-center text-3xl text-white/90 opacity-0 transition group-hover:opacity-100">
          {isCurrent && playing ? "❚❚" : "►"}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/80">
          {audio.tier}
        </span>
      </button>
      <Link href={`/audio/${audio.id}`} className="mt-2 block truncate text-sm font-medium text-white hover:text-coral">
        {audio.title}
      </Link>
      <p className="truncate text-xs text-white/50">{audio.voiceActor}</p>
    </div>
  );
}
