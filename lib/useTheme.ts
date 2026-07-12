"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "bks-theme";

export function useTheme() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggleTheme = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", next);
      try { localStorage.setItem(KEY, next ? "light" : "dark"); } catch {}
      return next;
    });
  }, []);

  return { light, toggleTheme };
}
