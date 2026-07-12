export const LAST_ACTIVE_TAB_KEY = "bks-last-active-tab";

export const MAIN_TAB_HREFS = ["/", "/browse", "/community", "/favorites", "/profile"] as const;

export type MainTabHref = (typeof MAIN_TAB_HREFS)[number];

export function tabForPath(path: string | null): MainTabHref | null {
  return MAIN_TAB_HREFS.find((href) => href === path) ?? null;
}

export function fallbackTabForPath(path: string | null): MainTabHref {
  if (path?.startsWith("/downloads") || path?.startsWith("/plans")) return "/profile";
  if (path?.startsWith("/audio")) return "/browse";
  return "/";
}

export function isMainTabHref(value: string | null): value is MainTabHref {
  return MAIN_TAB_HREFS.includes(value as MainTabHref);
}
