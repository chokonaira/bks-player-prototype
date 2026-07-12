"use client";

import { AudioLines, Pause, Play, Volume2 } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { usePlayer } from "@/components/PlayerProvider";
import { AUDIOS, initials } from "@/lib/mockData";

const featuredAudio = AUDIOS[1] ?? AUDIOS[0];
const sideAudios = [AUDIOS[0], AUDIOS[2]].filter(Boolean);

export default function FeaturedListenPanel() {
  const { t } = useLocale();
  const { current, playing, play, toggle } = usePlayer();
  const isCurrent = current?.id === featuredAudio.id;

  const onPlay = () => {
    if (isCurrent) {
      toggle();
      return;
    }
    play(featuredAudio);
  };

  return (
    <section className="relative my-10 overflow-hidden py-4 md:my-12 md:py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 text-center">
          <p className="font-serif text-2xl text-ink md:text-3xl">{t("home.featuredTitle")}</p>
          <button
            onClick={onPlay}
            className="mx-auto mt-4 flex h-14 w-full max-w-xs items-center justify-center gap-3 rounded-lg bg-ink px-5 text-sm font-semibold text-[rgb(var(--bg))] shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
          >
            <AudioLines className="h-5 w-5" strokeWidth={2} />
            {t("home.listenFree")}
          </button>
        </div>

        <div className="relative h-[430px] md:h-[450px]">
          <div className="absolute inset-x-[-3rem] top-12 flex justify-between gap-3 opacity-70 md:inset-x-[-5rem]">
            {sideAudios.map((audio) => (
              <div key={audio.id} className="w-40 overflow-hidden rounded-lg bg-surface shadow-lg shadow-black/10 md:w-48">
                <div className={`relative aspect-[3/4] bg-gradient-to-br ${audio.cover}`}>
                  <span aria-hidden className="cover-texture" />
                  <span className="absolute inset-0 grid place-items-center font-serif text-3xl italic text-white/10">
                    {initials(audio.title)}
                  </span>
                </div>
                <div className="p-3">
                  <p className="truncate font-serif text-sm text-ink">{audio.title}</p>
                  <p className="truncate text-xs text-ink/50">{audio.voiceActor}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mx-auto w-[82%] max-w-[320px] rounded-lg border border-ink/10 bg-surface p-4 text-center shadow-2xl shadow-black/15">
            <div className={`relative mx-auto aspect-square w-[70%] overflow-hidden rounded-lg bg-gradient-to-br ${featuredAudio.cover}`}>
              <span aria-hidden className="cover-texture" />
              <span className="absolute inset-0 grid place-items-center font-serif text-5xl italic text-white/10">
                {initials(featuredAudio.title)}
              </span>
            </div>
            <h3 className="mt-4 truncate font-serif text-xl text-ink">{featuredAudio.title}</h3>
            <p className="mt-1 truncate text-xs text-ink/55">{featuredAudio.voiceActor}</p>

            <div className="mt-4 h-1 rounded-full bg-ink/15">
              <div className="h-full w-2/5 rounded-full bg-ink" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-ink/45">
              <span>3:20</span>
              <span>-1:48</span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-5 bg-ink/30" />
              <button
                onClick={onPlay}
                aria-label={isCurrent && playing ? t("detail.pause") : t("detail.play")}
                className="grid h-12 w-12 place-items-center rounded-lg bg-ink/10 text-ink transition hover:bg-coral hover:text-black"
              >
                {isCurrent && playing ? (
                  <Pause className="h-5 w-5 fill-current" strokeWidth={2} />
                ) : (
                  <Play className="h-5 w-5 translate-x-0.5 fill-current" strokeWidth={2} />
                )}
              </button>
              <Volume2 className="h-4 w-4 text-ink/50" strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
