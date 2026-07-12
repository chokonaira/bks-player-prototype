"use client";

import { useCallback, useEffect, useState } from "react";

// user-added items persist on the device; seed items stay in code
export function useLocalAdditions<T>(key: string, seed: T[]) {
  const [added, setAdded] = useState<T[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setAdded(JSON.parse(s));
    } catch {}
  }, [key]);

  const add = useCallback((item: T) => {
    setAdded((prev) => {
      const next = [item, ...prev];
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return { items: [...added, ...seed], add };
}
