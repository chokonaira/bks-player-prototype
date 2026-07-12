import type { Audio } from "@/lib/mockData";

export type PlaybackProgress = {
  time: number;
  duration: number;
  updatedAt: number;
};

const PROGRESS_KEY = "bks-playback-progress";
const CLEARED_KEY = "bks-playback-cleared";

const canStore = () => typeof window !== "undefined" && "localStorage" in window;

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canStore()) return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canStore()) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const emitProgressChange = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("bks-progress"));
};

export function readProgressEntries(): Record<string, PlaybackProgress> {
  return readJson<Record<string, PlaybackProgress>>(PROGRESS_KEY, {});
}

export function readClearedProgress(): string[] {
  return readJson<string[]>(CLEARED_KEY, []);
}

export function saveProgress(audioId: string, time: number, duration: number) {
  if (!duration || time < 5 || time >= duration - 5) return;
  const entries = readProgressEntries();
  entries[audioId] = {
    time: Math.round(time),
    duration: Math.round(duration),
    updatedAt: Date.now(),
  };
  writeJson(PROGRESS_KEY, entries);
  writeJson(CLEARED_KEY, readClearedProgress().filter((id) => id !== audioId));
  emitProgressChange();
}

export function clearProgress(audioId: string) {
  const entries = readProgressEntries();
  delete entries[audioId];
  writeJson(PROGRESS_KEY, entries);
  writeJson(CLEARED_KEY, Array.from(new Set([...readClearedProgress(), audioId])));
  emitProgressChange();
}

export function getSavedProgress(audioId: string) {
  return readProgressEntries()[audioId] ?? null;
}

export function getContinueAudios(catalog: Audio[]) {
  const entries = readProgressEntries();
  const cleared = new Set(readClearedProgress());
  return catalog
    .map((audio) => {
      const saved = entries[audio.id];
      if (saved) {
        const progress = saved.duration ? saved.time / saved.duration : 0;
        return { ...audio, progress: Math.min(0.98, Math.max(0.01, progress)) };
      }
      if (cleared.has(audio.id)) return null;
      return audio.progress ? audio : null;
    })
    .filter((audio): audio is Audio => Boolean(audio));
}
