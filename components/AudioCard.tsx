"use client";

import { usePlayer } from "./PlayerProvider";
import { initials, type Audio } from "@/lib/mockData";
import { useFavorites } from "@/lib/useFavorites";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";

export default function AudioCard({ audio }: { audio: Audio }) {
  const { play, current, playing } = usePlayer();
  const { isFav, toggle } = useFavorites();
  const isCurrent = current?.id === audio.id;
  const fav = isFav(audio.id);
  return (
    <div className="group relative w-40 shrink-0 md:w-48">
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
        <span className="absolute inset-0 grid place-items-center text-white opacity-0 transition group-hover:opacity-100">
          {isCurrent && playing
            ? <Pause className="h-9 w-9 fill-current drop-shadow" />
            : <Play className="h-9 w-9 translate-x-0.5 fill-current drop-shadow" />}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80">
          {audio.tier}
        </span>
      </button>
      <button
        onClick={() => toggle(audio.id)}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/50 backdrop-blur-sm transition hover:scale-110"
      >
        <Heart className={`h-3.5 w-3.5 transition ${fav ? "fill-coral text-coral" : "text-white/70"}`} strokeWidth={1.8} />
      </button>
      <Link href={`/audio/${audio.id}`} className="mt-2 block truncate text-sm font-medium text-ink hover:text-coral">
        {audio.title}
      </Link>
      <p className="truncate text-xs text-ink/50">{audio.voiceActor}</p>
    </div>
  );
}
