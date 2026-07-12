"use client";

import AudioCard from "@/components/AudioCard";
import Discovery from "@/components/Discovery";
import { useLocale } from "@/components/LocaleProvider";
import { AUDIOS } from "@/lib/mockData";

export default function Browse() {
  const { t } = useLocale();
  return (
    <>
      <h1 className="mb-4 font-serif text-3xl text-ink md:text-4xl">{t("nav.browse")}</h1>
      <Discovery>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {AUDIOS.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </Discovery>
    </>
  );
}
