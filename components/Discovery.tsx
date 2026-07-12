"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import AudioCard from "./AudioCard";
import { AUDIOS } from "@/lib/mockData";
import { useLocale } from "./LocaleProvider";

const CATEGORY_ORDER = ["In Charge", "Friends to Lovers", "Strangers to Lovers", "Comfy Boyfriend", "Against the Rules"];
const CATEGORIES = Array.from(new Set(AUDIOS.map((a) => a.category))).sort((a, b) => {
  const ai = CATEGORY_ORDER.indexOf(a);
  const bi = CATEGORY_ORDER.indexOf(b);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
});

const MOOD_BACKDROPS: Record<string, string> = {
  "In Charge": "from-[#18100f] via-[#583429] to-[#c48266]",
  "Friends to Lovers": "from-[#f5dccb] via-[#b77b65] to-[#2d1a18]",
  "Strangers to Lovers": "from-[#f4f1eb] via-[#6f6a68] to-[#111111]",
  "Comfy Boyfriend": "from-[#30323d] via-[#202229] to-[#090a0d]",
  "Against the Rules": "from-[#4b2731] via-[#2d1723] to-[#09070a]",
};

const moodCover = (c: string) =>
  MOOD_BACKDROPS[c] ?? AUDIOS.find((a) => a.category === c)?.cover ?? "from-stone-700 to-stone-900";

const moodTileLayout = (index: number) =>
  index === 2
    ? "col-span-2 aspect-[2.08/1] md:col-span-1 md:aspect-[4/3]"
    : "aspect-[1.02/1] md:aspect-[4/3]";

export default function Discovery({ children }: { children: ReactNode }) {
  const { t } = useLocale();
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
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 rounded-full border border-ink/10 bg-ink/[0.04] px-5 py-3 backdrop-blur transition focus-within:border-coral/50 focus-within:bg-ink/[0.06] lg:max-w-2xl">
          <Search className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.8} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/35 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-ink/40 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
          <button
            onClick={() => setCategory(null)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
              category === null
                ? "border-coral bg-coral text-black"
                : "border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
            }`}
          >
            {t("search.allMoods")}
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
              {category ?? t("search.results")}
            </h2>
            <span className="text-xs text-ink/40">
              {results.length} {results.length === 1 ? t("search.audio") : t("search.audios")}
            </span>
          </div>
          {results.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {results.map((a) => <AudioCard key={a.id} audio={a} />)}
            </div>
          ) : (
            <p className="text-sm text-ink/50">
              {t("search.empty")}
            </p>
          )}
        </section>
      ) : (
        <>
          {children}

          <section className="mt-10">
            <h2 className="mb-4 text-center font-serif text-2xl text-ink md:text-3xl">{t("browse.byMood")}</h2>
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
              {CATEGORIES.map((c, index) => (
                <button
                  key={c}
                  onClick={() => pickMood(c)}
                  className={`group relative overflow-hidden rounded-lg bg-gradient-to-br ${moodCover(c)} ${moodTileLayout(index)} shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15`}
                >
                  <span aria-hidden className="cover-texture" />
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_38%,rgba(0,0,0,0.42))] transition group-hover:opacity-80" />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute inset-0 grid place-items-center px-3">
                    <span className="max-w-[92%] rounded-full bg-black/45 px-3 py-1 text-center text-xs font-semibold text-white shadow-sm backdrop-blur-sm md:px-4 md:py-1.5 md:text-sm">
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
