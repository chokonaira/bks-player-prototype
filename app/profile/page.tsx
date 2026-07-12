"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CreditCard, Moon, Sun, Globe, Download, ChevronRight, LogOut } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { useLocale } from "@/components/LocaleProvider";
import { LOCALES } from "@/lib/i18n";
import { useOffline } from "@/lib/useOffline";

const STATS = [
  { key: "profile.hours", value: "42" },
  { key: "profile.finished", value: "31" },
  { key: "profile.streak", value: "12" },
];

const SLEEP_DEFAULTS = [10, 20, 30, 45];

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [sleepIdx, setSleepIdx] = useState(2);
  const [signOutNote, setSignOutNote] = useState(false);
  const { light, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const offline = useOffline();

  return (
    <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">
      <aside>
        <header className="mb-8 flex items-center gap-4 lg:block">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#4a2b22] to-[#100c0c] font-serif text-xl text-white/80 lg:h-24 lg:w-24 lg:text-3xl">
            TU
          </div>
          <div className="lg:mt-4">
            <h1 className="font-serif text-2xl text-ink md:text-3xl">Test User</h1>
            <span className="mt-1 inline-block rounded-full bg-coral/15 px-3 py-0.5 text-xs text-coral">
              Secret Tier
            </span>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-3 gap-3 lg:grid-cols-1">
          {STATS.map((s) => (
            <div key={s.key} className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-center lg:text-left">
              <p className="font-serif text-2xl text-ink md:text-3xl">{s.value}</p>
              <p className="mt-1 text-[11px] text-ink/50">{t(s.key)}</p>
            </div>
          ))}
        </section>
      </aside>

      <section className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        <Link href="/plans"
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <CreditCard className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">{t("profile.manageSub")}</span>
            <span className="block truncate text-xs text-ink/50">{t("profile.renews")}</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-ink/30" />
        </Link>

        <button onClick={() => setNotifications((n) => !n)}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <Bell className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">{t("profile.notifications")}</span>
            <span className="block truncate text-xs text-ink/50">
              {notifications ? t("profile.notifNote") : t("profile.muted")}
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
            <span className="block text-sm text-ink">{t("profile.appearance")}</span>
            <span className="block truncate text-xs text-ink/50">
              {light ? t("profile.lightNote") : t("profile.darkNote")}
            </span>
          </span>
          <span className="flex shrink-0 overflow-hidden rounded-full border border-ink/15 text-xs">
            <span className={`px-3 py-1 transition ${!light ? "bg-coral text-black" : "text-ink/50"}`}>{t("profile.dark")}</span>
            <span className={`px-3 py-1 transition ${light ? "bg-coral text-black" : "text-ink/50"}`}>{t("profile.light")}</span>
          </span>
        </button>

        <div className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <Globe className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">{t("profile.language")}</span>
            <span className="block truncate text-xs text-ink/50">
              {LOCALES.find((l) => l.code === locale)?.name}
            </span>
          </span>
          <span className="flex shrink-0 overflow-hidden rounded-full border border-ink/15 text-xs">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`px-3 py-1 transition ${locale === l.code ? "bg-coral text-black" : "text-ink/50 hover:text-ink"}`}
              >
                {l.label}
              </button>
            ))}
          </span>
        </div>

        <button onClick={offline.toggle} disabled={!offline.supported || offline.busy}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06] disabled:opacity-60">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <Download className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">{t("profile.offline")}</span>
            <span className="block truncate text-xs text-ink/50">
              {offline.busy ? t("profile.saving") : offline.enabled ? t("profile.offlineOn") : t("profile.offlineOff")}
            </span>
          </span>
          <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${offline.enabled ? "bg-coral" : "bg-ink/15"}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${offline.enabled ? "left-[22px]" : "left-0.5"}`} />
          </span>
        </button>

        <button onClick={() => setSleepIdx((i) => (i + 1) % SLEEP_DEFAULTS.length)}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-left transition hover:bg-ink/[0.06]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/70">
            <Moon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-ink">{t("profile.sleepDefault")}</span>
            <span className="block truncate text-xs text-ink/50">{t("profile.tapToChange")}</span>
          </span>
          <span className="shrink-0 rounded-full bg-coral/15 px-3 py-1 text-xs text-coral">
            {SLEEP_DEFAULTS[sleepIdx]} {t("profile.fade")}
          </span>
        </button>

        <button onClick={() => { setSignOutNote(true); setTimeout(() => setSignOutNote(false), 2500); }}
          className="flex w-full items-center gap-4 rounded-2xl border border-ink/5 p-4 text-left text-ink/40 transition hover:text-ink/70">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/5">
            <LogOut className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="text-sm">{signOutNote ? t("profile.stayNote") : t("profile.signOut")}</span>
        </button>
      </section>
    </div>
  );
}
