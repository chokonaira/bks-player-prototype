"use client";

import { useState } from "react";
import { Bell, CreditCard, Moon, Sun, ChevronRight, LogOut } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

const STATS = [
  { label: "Hours listened", value: "42" },
  { label: "Audios finished", value: "31" },
  { label: "Night streak", value: "12" },
];

const SLEEP_DEFAULTS = [10, 20, 30, 45];

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [sleepIdx, setSleepIdx] = useState(2);
  const [planOpen, setPlanOpen] = useState(false);
  const [signOutNote, setSignOutNote] = useState(false);
  const { light, toggleTheme } = useTheme();

  return (
    <>
      <header className="mb-8 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#4a2b22] to-[#100c0c] font-serif text-xl text-white/80">
          TU
        </div>
        <div>
          <h1 className="font-serif text-2xl text-ink md:text-3xl">Test User</h1>
          <span className="mt-1 inline-block rounded-full bg-coral/15 px-3 py-0.5 text-xs text-coral">
            Secret Tier
          </span>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-3 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center">
            <p className="font-serif text-2xl text-ink md:text-3xl">{s.value}</p>
            <p className="mt-1 text-[11px] text-ink/50">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] transition">
          <button onClick={() => setPlanOpen((o) => !o)}
            className="flex w-full items-center gap-4 p-4 text-left">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
              <CreditCard className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-ink">Manage subscription</span>
              <span className="block truncate text-xs text-ink/50">Secret Tier · renews monthly</span>
            </span>
            <ChevronRight className={`h-4 w-4 shrink-0 text-ink/30 transition-transform ${planOpen ? "rotate-90" : ""}`} />
          </button>
          {planOpen && (
            <div className="border-t border-ink/10 px-4 py-4 text-xs text-ink/50">
              <div className="flex items-center justify-between">
                <span>Secret Tier · $10.99/month · renews Aug 12, 2026</span>
                <button className="rounded-full border border-ink/15 px-3 py-1 text-ink/70 transition hover:border-coral hover:text-coral">
                  Change plan
                </button>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setNotifications((n) => !n)}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <Bell className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">Notifications</span>
            <span className="block truncate text-xs text-ink/50">
              {notifications ? "New releases & listen-alongs" : "Muted"}
            </span>
          </span>
          <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${notifications ? "bg-coral" : "bg-ink/15"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${notifications ? "left-[22px]" : "left-0.5"}`} />
          </span>
        </button>

        <button onClick={toggleTheme}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            {light ? <Sun className="h-5 w-5" strokeWidth={1.8} /> : <Moon className="h-5 w-5" strokeWidth={1.8} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">Appearance</span>
            <span className="block truncate text-xs text-ink/50">
              {light ? "Cream — daylight listening" : "Dark — easy on late nights"}
            </span>
          </span>
          <span className="flex shrink-0 overflow-hidden rounded-full border border-ink/15 text-xs">
            <span className={`px-3 py-1 transition ${!light ? "bg-coral text-black" : "text-ink/50"}`}>Dark</span>
            <span className={`px-3 py-1 transition ${light ? "bg-coral text-black" : "text-ink/50"}`}>Light</span>
          </span>
        </button>

        <button onClick={() => setSleepIdx((i) => (i + 1) % SLEEP_DEFAULTS.length)}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <Moon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">Default sleep timer</span>
            <span className="block truncate text-xs text-ink/50">Tap to change</span>
          </span>
          <span className="shrink-0 rounded-full bg-coral/15 px-3 py-1 text-xs text-coral">
            {SLEEP_DEFAULTS[sleepIdx]} min · fade
          </span>
        </button>

        <button onClick={() => { setSignOutNote(true); setTimeout(() => setSignOutNote(false), 2500); }}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/5 p-4 text-left text-ink/40 transition hover:text-ink/70">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5">
            <LogOut className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="text-sm">{signOutNote ? "Prototype mode — you're staying ♥" : "Sign out"}</span>
        </button>
      </section>
    </>
  );
}
