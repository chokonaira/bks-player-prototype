"use client";

import { useCallback, useEffect, useState } from "react";

export type Moment = {
  id: string;
  audioId: string;
  time: number;
  createdAt: number;
};

const KEY = "bks-moments";

const read = (): Moment[] => {
  try {
    const value = localStorage.getItem(KEY);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function useMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    setMoments(read());
    const sync = () => setMoments(read());
    window.addEventListener("bks-moments", sync);
    return () => window.removeEventListener("bks-moments", sync);
  }, []);

  const addMoment = useCallback((audioId: string, time: number) => {
    const roundedTime = Math.max(0, Math.round(time));
    const moment: Moment = {
      id: `${audioId}-${roundedTime}-${Date.now()}`,
      audioId,
      time: roundedTime,
      createdAt: Date.now(),
    };
    setMoments((prev) => {
      const next = [moment, ...prev].slice(0, 40);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event("bks-moments"));
      return next;
    });
    return moment;
  }, []);

  const removeMoment = useCallback((id: string) => {
    setMoments((prev) => {
      const next = prev.filter((moment) => moment.id !== id);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event("bks-moments"));
      return next;
    });
  }, []);

  return { moments, addMoment, removeMoment };
}
