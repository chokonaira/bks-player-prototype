"use client";

import { usePlayer } from "./PlayerProvider";
import { initials, type Audio } from "@/lib/mockData";
import Link from "next/link";

export default function AudioCard({ audio }: { audio: Audio }) {
  const { play, current, playing } = usePlayer();
  const isCurrent = current?.id === audio.id;
  return (
    <div className="group w-40 shrink-0 md:w-48">
      <button
        onClick={() => play(audio)}
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br ${audio.cover}
          outline-none focus-visible:ring-2 focus-visible:ring-coral`}
      >
        {/* artwork label so it never looks like a broken image */}
        <span className="absolute inset-0 grid place-items-center font-serif text-4xl text-white/15">
          {initials(audio.title)}
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-left text-xs font-medium text-white/90">
          {audio.title}
        </span>
        <span className="absolute inset-0 grid place-items-center text-3xl text-white opacity-0 transition group-hover:opacity-100">
          {isCurrent && playing ? "❚❚" : "►"}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80">
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
