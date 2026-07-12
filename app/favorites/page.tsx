"use client";

import AudioCard from "@/components/AudioCard";
import { AUDIOS } from "@/lib/mockData";
import { useFavorites } from "@/lib/useFavorites";
import { useMoments } from "@/lib/useMoments";
import { Heart, Clock, X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

const fmt = (s: number) => {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function Favorites() {
  const { favs } = useFavorites();
  const { moments, removeMoment } = useMoments();
  const { t } = useLocale();
  const favorites = AUDIOS.filter((a) => favs.includes(a.id));
  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{t("nav.favorites")}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/50">
          <Heart className="h-3.5 w-3.5 text-coral" strokeWidth={1.8} />
          {favorites.length} {t("fav.saved")}
        </p>
      </header>

      {moments.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl text-ink md:text-3xl">{t("moments.title")}</h2>
            <span className="text-xs text-ink/40">{moments.length}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {moments.slice(0, 6).map((moment) => {
              const audio = AUDIOS.find((a) => a.id === moment.audioId);
              if (!audio) return null;
              return (
                <div key={moment.id} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-ink/[0.03] p-3">
                  <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${audio.cover}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[15px] text-ink">{audio.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-coral">
                      <Clock className="h-3 w-3" strokeWidth={1.8} />
                      {fmt(moment.time)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMoment(moment.id)}
                    aria-label={t("moments.remove")}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/45 transition hover:bg-ink/10 hover:text-ink"
                  >
                    <X className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {favorites.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {favorites.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-8 text-center">
          <Heart className="mx-auto h-8 w-8 text-ink/20" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-ink/50">
            {t("fav.empty")}
          </p>
        </div>
      )}
    </>
  );
}
