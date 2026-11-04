import type { Metadata } from "next";
import site from "@/data/site.json";
import { getDict, locales, ogLocale, type Locale } from "@/lib/i18n";

/** Métadonnées d'une page : titre, description, canonique, hreflang vers les 3 autres langues, Open Graph. */
export function pageMetadata(lang: Locale, path: string, title: string, description: string, image = "/og.jpg"): Metadata {
  const d = getDict(lang);
  const url = `/${lang}${path}`;
  return {
    title: `${title} | ${lang === "he" ? "אהרון סיטבון" : "Aharon Sitbon"}`,
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])), "x-default": `/he${path}` },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Aharon Sitbon · אהרון סיטבון",
      title,
      description,
      locale: ogLocale[lang],
      images: [{ url: image, width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const absolute = (p: string) => `${site.url}${p}`;
