// Langues du site, sans les textes : importable côté client sans embarquer les dictionnaires.
export const locales = ["he", "fr", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (lang: Locale) => (lang === "he" ? "rtl" : "ltr");

export const ogLocale: Record<Locale, string> = { he: "he_IL", fr: "fr_FR", en: "en_US", es: "es_ES" };
export const intlLocale: Record<Locale, string> = { he: "he-IL", fr: "fr-FR", en: "en-GB", es: "es-ES" };
