"use client";

import AudioCard from "@/components/AudioCard";
import { AUDIOS } from "@/lib/mockData";
import { useFavorites } from "@/lib/useFavorites";
import { Heart } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

export default function Favorites() {
  const { favs } = useFavorites();
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
      {favorites.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
