"use client";

import {
  createContext, useContext, useRef, useState,
  useEffect, useCallback, ReactNode,
} from "react";
import { AUDIOS, type Audio } from "@/lib/mockData";

type PlayerState = {
  current: Audio | null;
  completed: Audio | null;
  playing: boolean;
  time: number;
  duration: number;
  speed: number;
  sleepRemaining: number | null; // seconds left, null = off
  play: (a: Audio) => void;
  replay: (a?: Audio) => void;
  playNextFrom: (a: Audio) => void;
  dismissAfterglow: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  skip: (delta: number) => void;
  setSpeed: (s: number) => void;
  setSleep: (minutes: number | null) => void;
};

const Ctx = createContext<PlayerState | null>(null);
export const usePlayer = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used within PlayerProvider");
  return c;
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Audio | null>(null);
  const [completed, setCompleted] = useState<Audio | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeedState] = useState(1);
  const [sleepRemaining, setSleepRemaining] = useState<number | null>(null);
  const currentRef = useRef<Audio | null>(null);
  const speedRef = useRef(1);

  // one <audio> element for the whole app -> playback persists across routes
  useEffect(() => {
    const el = new window.Audio();
    // let speed changes shift pitch too, audible even on ambient placeholder
    // tones; real spoken-word would re-enable pitch preservation
    el.preservesPitch = false;
    (el as any).webkitPreservesPitch = false;
    audioRef.current = el;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => {
      const cur = currentRef.current;
      if (!cur) { setPlaying(false); return; }
      setPlaying(false);
      setTime(el.duration || el.currentTime || 0);
      setSleepRemaining(null);
      setCompleted(cur);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const play = useCallback((a: Audio) => {
    const el = audioRef.current;
    if (!el) return;
    setCompleted(null);
    if (current?.id !== a.id) {
      el.src = a.src;
      el.playbackRate = speed;
      // resume where the user left off (persisted in real app via events API);
      // progress is a 0..1 fraction of the loaded file, applied once metadata
      // arrives so it stays valid even when the clip length differs from mock data
      const resumeAt = a.progress ?? 0;
      el.addEventListener("loadedmetadata", () => {
        if (resumeAt && el.duration) el.currentTime = resumeAt * el.duration;
      }, { once: true });
      currentRef.current = a;
      setCurrent(a);
    }
    el.play().then(() => setPlaying(true)).catch(() => {});
  }, [current, speed]);

  const replay = useCallback((a?: Audio) => {
    const el = audioRef.current;
    const target = a ?? currentRef.current ?? current;
    if (!el || !target) return;
    setCompleted(null);
    if (currentRef.current?.id !== target.id) {
      el.src = target.src;
      currentRef.current = target;
      setCurrent(target);
    }
    el.playbackRate = speedRef.current;
    el.currentTime = 0;
    setTime(0);
    el.play().then(() => setPlaying(true)).catch(() => {});
  }, [current]);

  const playNextFrom = useCallback((a: Audio) => {
    const idx = AUDIOS.findIndex((item) => item.id === a.id);
    const next = AUDIOS[(idx + 1) % AUDIOS.length] ?? AUDIOS[0];
    replay(next);
  }, [replay]);

  const dismissAfterglow = useCallback(() => {
    setCompleted(null);
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    if (playing) { el.pause(); setPlaying(false); }
    else {
      if (el.ended || completed) {
        el.currentTime = 0;
        setTime(0);
        setCompleted(null);
      }
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, current, completed]);

  const seek = useCallback((t: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setTime(t);
      setCompleted(null);
    }
  }, []);

  const skip = useCallback((delta: number) => {
    const el = audioRef.current;
    if (el) {
      el.currentTime = Math.max(0, el.currentTime + delta);
      setCompleted(null);
    }
  }, []);

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
    speedRef.current = s;
    if (audioRef.current) audioRef.current.playbackRate = s;
  }, []);

  // Sleep timer with graceful fade-out over the final 8s
  const setSleep = useCallback((minutes: number | null) => {
    setSleepRemaining(minutes === null ? null : minutes * 60);
  }, []);

  useEffect(() => {
    if (sleepRemaining === null) return;
    if (sleepRemaining <= 0) {
      const el = audioRef.current;
      if (el) { el.pause(); el.volume = 1; }
      setPlaying(false);
      setSleepRemaining(null);
      return;
    }
    const el = audioRef.current;
    if (el) el.volume = sleepRemaining <= 8 ? Math.max(0, sleepRemaining / 8) : 1;
    const t = setTimeout(() => setSleepRemaining((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [sleepRemaining]);

  return (
    <Ctx.Provider value={{
      current, completed, playing, time, duration, speed, sleepRemaining,
      play, replay, playNextFrom, dismissAfterglow, toggle, seek, skip, setSpeed, setSleep,
    }}>
      {children}
    </Ctx.Provider>
  );
}
