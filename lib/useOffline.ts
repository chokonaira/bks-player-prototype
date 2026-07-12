"use client";

import { useCallback, useEffect, useState } from "react";
import { AUDIOS } from "@/lib/mockData";

// explicit saves live here; the service worker's playback cache is separate,
// so merely playing a track never counts as saving it
const AUDIO_CACHE = "bks-audio-saved-v1";
const LEGACY_AUDIO_CACHE = "bks-audio-v1";
const FLAG = "bks-offline-on";
const AUDIO_URLS = Array.from(new Set(AUDIOS.map((a) => a.src)));
let clearImplicitCachesPromise: Promise<void> | null = null;

function clearImplicitOfflineCaches() {
  clearImplicitCachesPromise ??= Promise.all([
    caches.delete(LEGACY_AUDIO_CACHE),
    caches.open(AUDIO_CACHE).then((cache) => Promise.all(AUDIO_URLS.map((u) => cache.delete(u)))),
  ]).then(() => undefined).catch(() => undefined);
  return clearImplicitCachesPromise;
}

export function useOffline() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        if (!("caches" in window)) return;
        setSupported(true);
        const saved = localStorage.getItem(FLAG) === "1";
        setEnabled(saved);
        if (!saved) void clearImplicitOfflineCaches();
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
        await Promise.all([
          ...AUDIO_URLS.map((u) => cache.delete(u)),
          caches.delete(LEGACY_AUDIO_CACHE),
        ]);
        localStorage.setItem(FLAG, "0");
        setEnabled(false);
      } else {
        await cache.addAll(AUDIO_URLS);
        localStorage.setItem(FLAG, "1");
        setEnabled(true);
      }
    } catch {}
    setBusy(false);
    window.dispatchEvent(new Event("bks-offline"));
  }, [busy, enabled, supported]);

  // count reflects saved titles, not underlying files (titles share placeholder clips)
  return { supported, enabled, busy, toggle, count: AUDIOS.length };
}
