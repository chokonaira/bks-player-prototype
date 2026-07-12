export const AFTERGLOW_MOODS = ["soft", "wanted", "comforted", "part2"];

export function nextAudio(audios, audio) {
  const idx = audios.findIndex((item) => item.id === audio.id);
  return audios[(idx + 1) % audios.length] ?? audios[0];
}

export function recommendationFor(audios, audio, mood) {
  const pool = audios.filter((item) => item.id !== audio.id);
  if (!mood) return nextAudio(audios, audio);

  const match =
    mood === "comforted"
      ? pool.find((item) => item.category === "Comfy Boyfriend")
      : mood === "soft"
        ? pool.find((item) => item.category === audio.category || item.category === "Friends to Lovers")
        : mood === "wanted"
          ? pool.find((item) => item.tier === "Secret" && item.category !== audio.category)
          : pool.find((item) => item.category === audio.category || item.voiceActor === audio.voiceActor);

  return match ?? nextAudio(audios, audio);
}
