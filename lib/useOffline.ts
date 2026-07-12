"use client";

import { useCallback, useEffect, useState } from "react";
import { AUDIOS } from "@/lib/mockData";

const AUDIO_CACHE = "bks-audio-v1";
const AUDIO_URLS = Array.from(new Set(AUDIOS.map((a) => a.src)));

export function useOffline() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!("caches" in window)) return;
        setSupported(true);
        const cache = await caches.open(AUDIO_CACHE);
        const hits = await Promise.all(AUDIO_URLS.map((u) => cache.match(u)));
        setEnabled(hits.every(Boolean));
      } catch {}
    })();
  }, []);

  const toggle = useCallback(async () => {
    if (busy || !supported) return;
    setBusy(true);
    try {
      const cache = await caches.open(AUDIO_CACHE);
      if (enabled) {
        await Promise.all(AUDIO_URLS.map((u) => cache.delete(u)));
        setEnabled(false);
      } else {
        await cache.addAll(AUDIO_URLS);
        setEnabled(true);
      }
    } catch {}
    setBusy(false);
  }, [busy, enabled, supported]);

  return { supported, enabled, busy, toggle, count: AUDIO_URLS.length };
}
