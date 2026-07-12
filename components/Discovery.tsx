"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import AudioCard from "./AudioCard";
import { AUDIOS } from "@/lib/mockData";

const CATEGORIES = Array.from(new Set(AUDIOS.map((a) => a.category)));

// each mood tile borrows the cover gradient of its first audio
const moodCover = (c: string) =>
  AUDIOS.find((a) => a.category === c)?.cover ?? "from-stone-700 to-stone-900";

export default function Discovery({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const active = query.trim() !== "" || category !== null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AUDIOS.filter((a) => {
      if (category && a.category !== category) return false;
      if (!q) return true;
      return [a.title, a.voiceActor, a.writer, a.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  const pickMood = (c: string) => {
    setCategory(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3 rounded-full border border-ink/10 bg-ink/[0.04] px-5 py-3 backdrop-blur transition focus-within:border-coral/50 focus-within:bg-ink/[0.06]">
          <Search className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.8} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your perfect audio"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/35 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-ink/40 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory(null)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
              category === null
                ? "border-coral bg-coral text-black"
                : "border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
            }`}
          >
            All moods
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                setCategory(category === c ? null : c);
                e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
              }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
                category === c
                  ? "border-coral bg-coral text-black"
                  : "border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-ink">
              {category ?? "Results"}
            </h2>
            <span className="text-xs text-ink/40">
              {results.length} {results.length === 1 ? "audio" : "audios"}
            </span>
          </div>
          {results.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {results.map((a) => <AudioCard key={a.id} audio={a} />)}
            </div>
          ) : (
            <p className="text-sm text-ink/50">
              Nothing matches — try another mood or clear the search.
            </p>
          )}
        </section>
      ) : (
        <>
          {children}

          <section className="mt-10">
            <h2 className="mb-4 text-center font-serif text-2xl text-ink md:text-3xl">Browse by Mood</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => pickMood(c)}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${moodCover(c)} transition hover:scale-[1.02]`}
                >
                  <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" />
                  <span className="absolute inset-0 grid place-items-center px-3">
                    <span className="rounded-full bg-black/45 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                      {c}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
