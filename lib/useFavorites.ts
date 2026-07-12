"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "bks-favs";
const DEFAULT_FAVS = ["539", "845", "1108"];

const read = (): string[] => {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return DEFAULT_FAVS;
};

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>(DEFAULT_FAVS);

  useEffect(() => {
    setFavs(read());
    const sync = () => setFavs(read());
    window.addEventListener("bks-favs", sync);
    return () => window.removeEventListener("bks-favs", sync);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event("bks-favs"));
      return next;
    });
  }, []);

  return { favs, toggle, isFav: (id: string) => favs.includes(id) };
}
