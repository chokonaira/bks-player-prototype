"use client";

import { useCallback, useEffect, useState } from "react";
import { AUDIOS } from "@/lib/mockData";

// explicit saves live here; the service worker's playback cache is separate,
// so merely playing a track never counts as saving it
const AUDIO_CACHE = "bks-audio-saved-v1";
const LEGACY_AUDIO_CACHE = "bks-audio-v1";
const FLAG = "bks-offline-explicit-v2";
const LEGACY_FLAGS = ["bks-offline-on"];
const AUDIO_URLS = Array.from(new Set(AUDIOS.map((a) => a.src)));

function readOfflinePreference() {
  return localStorage.getItem(FLAG) === "1";
}

function clearLegacyPreferenceFlags() {
  LEGACY_FLAGS.forEach((key) => localStorage.removeItem(key));
}

function clearOfflineAudioCaches() {
  return Promise.all([
    caches.delete(LEGACY_AUDIO_CACHE),
    caches.delete(AUDIO_CACHE),
  ]).then(() => undefined).catch(() => undefined);
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
        clearLegacyPreferenceFlags();
        const saved = readOfflinePreference();
        setEnabled(saved);
        if (!saved) void clearOfflineAudioCaches();
      } catch {}
    };
    check();
    window.addEventListener("bks-offline", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("bks-offline", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  const toggle = useCallback(async () => {
    if (busy || !supported) return;
    setBusy(true);
    try {
      if (enabled) {
        localStorage.removeItem(FLAG);
        await clearOfflineAudioCaches();
        setEnabled(false);
      } else {
        const cache = await caches.open(AUDIO_CACHE);
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
