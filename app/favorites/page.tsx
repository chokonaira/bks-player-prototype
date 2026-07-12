"use client";

import { useState } from "react";
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
  const [showAllMoments, setShowAllMoments] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const favorites = AUDIOS.filter((a) => favs.includes(a.id));
  const visibleMoments = showAllMoments ? moments : moments.slice(0, 2);
  const visibleFavorites = showAllFavorites ? favorites : favorites.slice(0, 4);
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
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl text-ink md:text-3xl">{t("moments.title")}</h2>
              <p className="text-xs text-ink/45">{moments.length} {t("moments.count")}</p>
            </div>
            {moments.length > 2 && (
              <button
                onClick={() => setShowAllMoments((v) => !v)}
                className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/60 transition hover:border-coral/50 hover:text-ink"
              >
                {showAllMoments ? t("moments.hide") : t("moments.viewAll")}
              </button>
            )}
          </div>
          <div className="grid gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3">
            {visibleMoments.map((moment) => {
              const audio = AUDIOS.find((a) => a.id === moment.audioId);
              if (!audio) return null;
              return (
                <div key={moment.id} className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-white/75 p-2.5 shadow-sm shadow-black/5 md:gap-3 md:rounded-2xl md:p-3">
                  <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${audio.cover} md:h-12 md:w-12 md:rounded-xl`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm text-ink md:text-[15px]">{audio.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-coral">
                      <Clock className="h-3 w-3" strokeWidth={1.8} />
                      {fmt(moment.time)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMoment(moment.id)}
                    aria-label={t("moments.remove")}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/45 transition hover:bg-ink/10 hover:text-ink md:h-8 md:w-8"
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
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl text-ink md:text-3xl">{t("fav.audios")}</h2>
              <p className="text-xs text-ink/45">{favorites.length} {t("fav.saved")}</p>
            </div>
            {favorites.length > 4 && (
              <button
                onClick={() => setShowAllFavorites((v) => !v)}
                className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/60 transition hover:border-coral/50 hover:text-ink"
              >
                {showAllFavorites ? t("fav.hide") : t("fav.viewAll")}
              </button>
            )}
          </div>
          <div className={showAllFavorites ? "max-h-[min(72vh,760px)] overflow-y-auto pr-1" : ""}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {visibleFavorites.map((a) => <AudioCard key={a.id} audio={a} />)}
            </div>
          </div>
        </section>
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
