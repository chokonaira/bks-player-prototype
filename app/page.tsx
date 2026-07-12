"use client";

import ContinueListeningRail from "@/components/ContinueListeningRail";
import HomeHeader from "@/components/HomeHeader";
import { useLocale } from "@/components/LocaleProvider";
import AudioCard from "@/components/AudioCard";
import Discovery from "@/components/Discovery";
import { AUDIOS } from "@/lib/mockData";

export default function Home() {
  const { t } = useLocale();
  return (
    <>
      <HomeHeader />

      <Discovery>
      <ContinueListeningRail />

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-2xl text-ink md:text-3xl">{t("home.forYou")}</h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {AUDIOS.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-2xl text-ink md:text-3xl">{t("home.newReleases")}</h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {[...AUDIOS].reverse().map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </section>
      </Discovery>
    </>
  );
}
