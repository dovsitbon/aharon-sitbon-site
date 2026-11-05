import site from "@/data/site.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

export const CONTACT_TYPES = ["message", "press", "media", "rights", "other"] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export function formatDay(iso: string, lang: Locale, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { ...opts, timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d || 1)));
}

/** Date du jour au format AAAA-MM-JJ, en heure d'Israël. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export type Request = { type: ContactType | ""; name: string; phone: string; email: string; message: string };

/** Récapitulatif envoyé sur WhatsApp, dans la langue du visiteur. */
export function requestMessage(q: Request, lang: Locale, d: Dict) {
  const b = d.booking;
  const m = b.wa;
  const c = lang === "fr" ? " :" : ":";
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  const blocks = [[`*${m.title}*`], [line(m.type, q.type ? b.types[q.type] : "")], [line(m.name, q.name), line(m.phone, q.phone), line(m.email, q.email)], [line(m.message, q.message)], [m.closing]];
  return blocks
    .map((x) => x.filter(Boolean).join("\n"))
    .filter(Boolean)
    .join("\n\n");
}
