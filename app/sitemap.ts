import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { defaultLocale, locales } from "@/lib/locales";
import { PAGES } from "@/lib/routes";
import { albums } from "@/lib/music";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...PAGES.map((p) => `/${p}`), ...albums.map((a) => `/music/${a.id}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? (lang === defaultLocale ? 1 : 0.9) : 0.7,
      alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])), "x-default": `${site.url}/${defaultLocale}${path}` } },
    })),
  );
}
