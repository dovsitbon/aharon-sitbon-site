import type { Locale } from "@/lib/locales";

/** Pages du site (mêmes adresses dans les 4 langues : /he/story, /fr/story…) */
export const PAGES = ["story", "music", "videos", "services", "events", "press", "contact"] as const;
export type PageKey = (typeof PAGES)[number];

export const href = (lang: Locale, page?: PageKey | string) => (page ? `/${lang}/${page}` : `/${lang}`);
