"use client";

import ContinueListeningRail from "@/components/ContinueListeningRail";
import HomeHeader from "@/components/HomeHeader";
import { useLocale } from "@/components/LocaleProvider";
import AudioShelf from "@/components/AudioShelf";
import Discovery from "@/components/Discovery";
import { AUDIOS } from "@/lib/mockData";

export default function Home() {
  const { t } = useLocale();
  return (
    <>
      <HomeHeader />

      <Discovery>
        <ContinueListeningRail />

        <AudioShelf title={t("home.forYou")} audios={AUDIOS} />

        <AudioShelf title={t("home.newReleases")} audios={[...AUDIOS].reverse()} />
      </Discovery>
    </>
  );
}
