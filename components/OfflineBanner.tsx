"use client";

import { CloudOff } from "lucide-react";
import { useOnlineStatus } from "@/lib/useOnlineStatus";
import { useLocale } from "./LocaleProvider";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  const { t } = useLocale();
  if (online) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-surface/95 px-4 py-2 text-xs text-ink/80 shadow-lg shadow-black/20 backdrop-blur">
        <CloudOff className="h-3.5 w-3.5 shrink-0 text-coral" strokeWidth={1.8} />
        {t("offline.banner")}
      </div>
    </div>
  );
}
