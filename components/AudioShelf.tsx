"use client";

import { useState } from "react";
import AudioCard from "@/components/AudioCard";
import { useLocale } from "@/components/LocaleProvider";
import type { Audio } from "@/lib/mockData";

type AudioShelfProps = {
  title: string;
  audios: Audio[];
  initialMobileCount?: number;
  initialDesktopCount?: number;
};

export default function AudioShelf({
  title,
  audios,
  initialMobileCount = 2,
  initialDesktopCount = 5,
}: AudioShelfProps) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const visibleAudios = expanded ? audios : audios.slice(0, initialDesktopCount);
  const canExpandOnMobile = audios.length > initialMobileCount;
  const canExpandOnDesktop = audios.length > initialDesktopCount;
  const canExpand = canExpandOnMobile || canExpandOnDesktop;

  return (
    <section className="mb-8 last:mb-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="min-w-0 font-serif text-2xl text-ink md:text-3xl">{title}</h2>
        {canExpand && (
          <button
            onClick={() => setExpanded((value) => !value)}
            className={`shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/60 transition hover:border-coral/50 hover:text-ink ${canExpandOnDesktop ? "" : "md:hidden"}`}
          >
            {expanded ? t("common.hide") : t("common.viewAll")}
          </button>
        )}
      </div>
      <div className={expanded ? "max-h-[min(72vh,760px)] overflow-y-auto pr-1" : ""}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {visibleAudios.map((audio, index) => (
            <div key={audio.id} className={!expanded && index >= initialMobileCount ? "hidden md:block" : ""}>
              <AudioCard audio={audio} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
