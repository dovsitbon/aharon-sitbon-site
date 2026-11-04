import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

export const EVENT_TYPES = ["concert", "wedding", "barmitzvah", "chabad", "community", "corporate", "zoom", "other"] as const;
export const FORMULAS = ["band", "guitar", "david", "zoom"] as const;
export const COUNTRIES = ["IL", "FR", "other"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export type Formula = (typeof FORMULAS)[number];
export type Country = (typeof COUNTRIES)[number];

export const takenDates = new Set<string>(calendar.taken as string[]);

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

export type Request = {
  type: EventType | "";
  date: string;
  city: string;
  country: Country | "";
  guests: string;
  formula: Formula | "";
  budget: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

/** Récapitulatif envoyé sur WhatsApp, dans la langue du visiteur. */
export function requestMessage(q: Request, lang: Locale, d: Dict) {
  const b = d.booking;
  const m = b.wa;
  const c = lang === "fr" ? " :" : ":";
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  const blocks = [
    [`*${m.title}*`],
    [
      line(m.type, q.type ? b.types[q.type] : ""),
      line(m.date, q.date ? formatDay(q.date, lang) : ""),
      line(m.city, q.city),
      line(m.country, q.country ? b.countries[q.country] : ""),
      line(m.guests, q.guests),
      line(m.formula, q.formula ? b.formulas[q.formula] : ""),
      line(m.budget, q.budget),
    ],
    [line(m.name, q.name), line(m.phone, q.phone), line(m.email, q.email)],
    [line(m.message, q.message)],
    [m.closing],
  ];
  return blocks.map((x) => x.filter(Boolean).join("\n")).filter(Boolean).join("\n\n");
}
