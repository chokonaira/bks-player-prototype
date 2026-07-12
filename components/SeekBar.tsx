"use client";

import { useRef, type PointerEvent } from "react";

// custom scrubber: native range inputs ignore track taps on iOS Safari
export default function SeekBar({
  value,
  max,
  onSeek,
  compact = false,
}: {
  value: number;
  max: number;
  onSeek: (t: number) => void;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pct = max ? Math.min(100, (value / max) * 100) : 0;

  const seekFromEvent = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !max) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * max);
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        seekFromEvent(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) seekFromEvent(e);
      }}
      className={`relative w-full cursor-pointer touch-none ${compact ? "py-1.5" : "py-2"}`}
    >
      <div className={`${compact ? "h-1" : "h-1.5"} w-full rounded-full bg-ink/15`}>
        <div className="relative h-full rounded-full bg-coral" style={{ width: `${pct}%` }}>
          {!compact && (
            <span className="absolute -right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-coral shadow" />
          )}
        </div>
      </div>
    </div>
  );
}
