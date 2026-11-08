import site from "@/data/site.json";
import concerts from "@/data/concerts.json";
import type { Dict, Locale } from "@/lib/i18n";
import { albums, albumTracks, singles, type Track } from "@/lib/music";

const sameAs = [site.youtube, site.facebook, site.appleMusic, site.shazam, site.spotify, site.instagram].filter(Boolean);

function recording(t: Track, lang: Locale) {
  return {
    "@type": "MusicRecording",
    name: t.he,
    alternateName: lang === "he" ? t.latin : [t.latin, t.tr[lang]],
    byArtist: { "@id": `${site.url}/#artist` },
    ...(t.duration ? { duration: `PT${t.duration.split(":")[0]}M${t.duration.split(":")[1]}S` } : {}),
    ...(t.youtubeId ? { url: `https://www.youtube.com/watch?v=${t.youtubeId}`, image: `${site.url}/media/clips/${t.youtubeId}.jpg` } : {}),
    ...(t.composer ? { recordingOf: { "@type": "MusicComposition", name: t.he, composer: { "@type": "Person", name: t.composer.replace(/ \(.*\)$/, "") } } } : {}),
    copyrightYear: t.year,
  };
}

/** Données structurées schema.org : l'artiste (Person + MusicGroup), ses albums, ses singles et les concerts à venir. */
export function jsonLd(lang: Locale, d: Dict) {
  const url = `${site.url}/${lang}`;
  type Upcoming = { date: string; time?: string; city: Record<Locale, string>; venue: string; country: string; tickets?: string };
  const upcoming = concerts.upcoming as Upcoming[];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Aharon Sitbon · אהרון סיטבון",
        inLanguage: ["he", "fr", "en", "es"],
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: "Aharon Sitbon",
        alternateName: ["אהרון סיטבון", "Gilbert Mathis", "Gilbert Sitbon"],
        jobTitle: d.footer.tagline,
        telephone: site.phoneIntl,
        nationality: { "@type": "Country", name: "Israel" },
        description: d.meta.description,
        image: `${site.url}/media/portrait/portrait-chaine.jpg`,
        homeLocation: { "@type": "City", name: "Jerusalem" },
        knowsLanguage: ["he", "fr"],
        sameAs,
        url,
      },
      {
        "@type": "MusicGroup",
        "@id": `${site.url}/#artist`,
        name: "Aharon Sitbon",
        alternateName: ["אהרון סיטבון", "Gilbert Sitbon"],
        genre: ["Jewish music", "Chassidic music", "מוזיקה חסידית"],
        member: { "@id": `${site.url}/#person` },
        image: `${site.url}/og.jpg`,
        url,
        sameAs,
        album: albums.map((a) => ({ "@id": `${site.url}/#album-${a.id}` })),
      },
      ...albums.map((a) => ({
        "@type": "MusicAlbum",
        "@id": `${site.url}/#album-${a.id}`,
        name: a.he,
        alternateName: lang === "he" ? a.latin : [a.latin, a.tr[lang]],
        byArtist: { "@id": `${site.url}/#artist` },
        datePublished: String(a.year),
        albumProductionType: "https://schema.org/StudioAlbum",
        numTracks: a.tracks.length,
        ...(a.cover ? { image: `${site.url}${a.cover}` } : {}),
        sameAs: [a.appleMusic, a.spotify].filter(Boolean),
        track: albumTracks(a).map((t, i) => ({ "@type": "ListItem", position: i + 1, item: recording(t, lang) })),
      })),
      ...singles.map((t) => ({ ...recording(t, lang), inAlbum: undefined })),
      ...upcoming.map((c) => ({
        "@type": "MusicEvent",
        name: `Aharon Sitbon – ${c.venue}`,
        startDate: c.time ? `${c.date}T${c.time}` : c.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: c.venue, address: { "@type": "PostalAddress", addressLocality: c.city[lang], addressCountry: c.country } },
        performer: { "@id": `${site.url}/#artist` },
        ...(c.tickets ? { offers: { "@type": "Offer", url: c.tickets } } : {}),
      })),
    ],
  };
}

const nameOf = (lang: Locale) => (lang === "he" ? "אהרון סיטבון" : "Aharon Sitbon");

/** Fil d'Ariane (BreadcrumbList) d'une page intérieure */
export function breadcrumbLd(lang: Locale, d: Dict, items: [string, string][]) {
  const all: [string, string][] = [[d.nav.home, `/${lang}`], ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path}` })),
  };
}

/** Page d'un album : MusicAlbum complet avec ses titres */
export function albumLd(lang: Locale, id: string) {
  const a = albums.find((x) => x.id === id)!;
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: a.he,
    alternateName: lang === "he" ? a.latin : [a.latin, a.tr[lang]],
    url: `${site.url}/${lang}/music/${a.id}`,
    byArtist: { "@type": "MusicGroup", name: "Aharon Sitbon", alternateName: ["אהרון סיטבון", "Gilbert Sitbon"], url: `${site.url}/${lang}`, sameAs },
    datePublished: String(a.year),
    albumProductionType: "https://schema.org/StudioAlbum",
    genre: ["Chassidic music", "Jewish music"],
    numTracks: a.tracks.length,
    image: `${site.url}${a.cover ?? "/og/album-" + a.id + ".jpg"}`,
    sameAs: [a.appleMusic, a.spotify].filter(Boolean),
    track: { "@type": "ItemList", numberOfItems: a.tracks.length, itemListElement: albumTracks(a).map((t, i) => ({ "@type": "ListItem", position: i + 1, item: recording(t, lang) })) },
  };
}

/** Page Albums : la discographie sous forme de liste */
export function discographyLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${nameOf(lang)} – discography`,
    itemListElement: [
      ...albums.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/${lang}/music/${a.id}`, name: `${a.he} – ${a.latin} (${a.year})` })),
      ...singles.map((t, i) => ({ "@type": "ListItem", position: albums.length + i + 1, item: recording(t, lang) })),
    ],
  };
}

/** Page Son histoire : profil de l'artiste */
export function profileLd(lang: Locale, d: Dict) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}/${lang}/story`,
    inLanguage: lang,
    mainEntity: { "@id": `${site.url}/#person`, "@type": "Person", name: "Aharon Sitbon", alternateName: ["אהרון סיטבון", "Gilbert Mathis", "Gilbert Sitbon"], description: d.pages.story.desc, sameAs },
  };
}

/** Page Contact */
export function contactLd(lang: Locale, d: Dict) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${site.url}/${lang}/contact`,
    inLanguage: lang,
    description: d.pages.contact.desc,
    mainEntity: { "@type": "Person", name: "Aharon Sitbon", telephone: site.phoneIntl, contactPoint: { "@type": "ContactPoint", telephone: site.phoneIntl, contactType: "customer support", availableLanguage: ["he", "fr", "en"] } },
  };
}
