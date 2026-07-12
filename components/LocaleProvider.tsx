"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DICT, type Locale } from "@/lib/i18n";

type LocaleCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const Ctx = createContext<LocaleCtx | null>(null);

export const useLocale = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLocale must be used within LocaleProvider");
  return c;
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const s = localStorage.getItem("bks-locale") as Locale | null;
      if (s && s in DICT) setLocaleState(s);
    } catch {}
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("bks-locale", l); } catch {}
  }, []);

  const t = useCallback(
    (key: string) => DICT[locale][key] ?? DICT.en[key] ?? key,
    [locale]
  );

  return <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>;
}
