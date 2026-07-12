"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { Check, CreditCard, CalendarDays } from "lucide-react";

const TIERS = [
  {
    id: "secret",
    name: "Secret Tier",
    rank: 3,
    price: "$10.99",
    perks: ["12–14 new audios / month", "Full 900+ audio library", "Members-only Discord", "Priority story requests"],
  },
  {
    id: "angel",
    name: "Angel Tier",
    rank: 2,
    price: "$7.99",
    perks: ["8–10 new audios / month", "Full 900+ audio library", "Members-only Discord"],
  },
  {
    id: "honey",
    name: "Honey Tier",
    rank: 1,
    price: "$4.99",
    perks: ["4–6 new audios / month", "Standard library access"],
  },
];

export default function Plans() {
  const { t } = useLocale();
  const [active, setActive] = useState("secret");
  const activeRank = TIERS.find((x) => x.id === active)?.rank ?? 0;
  const [note, setNote] = useState<string | null>(null);

  const flash = (msg: string) => {
    setNote(msg);
    setTimeout(() => setNote(null), 2600);
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{t("plans.title")}</h1>
        <p className="mt-1 text-sm text-ink/50">{t("plans.sub")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => {
          const isActive = tier.id === active;
          return (
            <div key={tier.id}
              className={`flex flex-col rounded-2xl border p-5 transition ${
                isActive ? "border-coral/60 bg-coral/5" : "border-ink/10 bg-ink/[0.03]"
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-serif text-xl text-ink">{tier.name}</h2>
                  <p className="mt-0.5 text-sm text-ink/60">
                    <span className="font-medium text-ink">{tier.price}</span> {t("plans.perMonth")}
                  </p>
                </div>
                {isActive && (
                  <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-500">
                    {t("plans.active")}
                  </span>
                )}
              </div>

              <ul className="mt-4 flex-1 space-y-2">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-ink/60">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral" strokeWidth={2.5} />
                    {p}
                  </li>
                ))}
              </ul>

              {isActive ? (
                <>
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-ink/50">
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Feb 13, 2026 – Dec 31, 2099
                  </p>
                  <button
                    onClick={() => flash(t("plans.cancelNote"))}
                    className="mt-3 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/60 transition hover:border-coral hover:text-coral"
                  >
                    {t("plans.cancel")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setActive(tier.id); flash(t("plans.switched")); }}
                  className="mt-4 rounded-full bg-coral px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                >
                  {tier.rank > activeRank ? t("plans.upgrade") : t("plans.downgrade")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => flash(t("plans.paymentNote"))}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4 text-sm text-ink/70 transition hover:bg-ink/[0.06] md:w-auto md:px-8"
      >
        <CreditCard className="h-4 w-4" strokeWidth={1.8} />
        {t("plans.payment")}
      </button>

      {note && (
        <p className="mt-4 text-sm text-coral">{note}</p>
      )}
    </>
  );
}
