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
    const check = async () => {
      try {
        if (!("caches" in window)) return;
        setSupported(true);
        const cache = await caches.open(AUDIO_CACHE);
        const hits = await Promise.all(AUDIO_URLS.map((u) => cache.match(u)));
        setEnabled(hits.every(Boolean));
      } catch {}
    };
    check();
    window.addEventListener("bks-offline", check);
    return () => window.removeEventListener("bks-offline", check);
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
    window.dispatchEvent(new Event("bks-offline"));
  }, [busy, enabled, supported]);

  return { supported, enabled, busy, toggle, count: AUDIO_URLS.length };
}
