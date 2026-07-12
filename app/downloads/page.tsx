"use client";

import Link from "next/link";
import AudioCard from "@/components/AudioCard";
import { AUDIOS } from "@/lib/mockData";
import { useOffline } from "@/lib/useOffline";
import { useLocale } from "@/components/LocaleProvider";
import { ArrowDownToLine } from "lucide-react";

export default function Downloads() {
  const { enabled } = useOffline();
  const { t } = useLocale();
  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{t("profile.offline")}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/50">
          <ArrowDownToLine className="h-3.5 w-3.5 text-coral" strokeWidth={1.8} />
          {enabled ? `${AUDIOS.length} ${t("offline.savedCount")} · ${t("offline.pageNote")}` : t("offline.pageNote")}
        </p>
      </header>
      {enabled ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {AUDIOS.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-8 text-center">
          <ArrowDownToLine className="mx-auto h-8 w-8 text-ink/20" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-ink/50">{t("offline.empty")}</p>
          <Link href="/profile"
            className="mt-4 inline-block rounded-full bg-coral px-5 py-2 text-sm font-medium text-black transition hover:opacity-90">
            {t("profile.offline")}
          </Link>
        </div>
      )}
    </>
  );
}
