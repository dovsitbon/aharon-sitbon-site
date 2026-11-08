import audience from "@/data/audience.json";
import type { Dict, Locale } from "@/lib/i18n";

type L = Locale | "pt" | "ru";
export type Message = {
  n: number;
  lang: L;
  video: keyof typeof audience.videos;
  author: Record<Locale, string>;
  text: string;
  tr: Partial<Record<Locale, string>>;
};

export const messages = audience.messages as Message[];
export const videoOf = (key: keyof typeof audience.videos) => audience.videos[key];
export const ytUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Carte d'un vrai message public YouTube : texte original (dans sa langue et son sens d'écriture),
 * traduction dans la langue de la page (sauf si c'est déjà la même), attribution, vidéo source.
 */
export function MessageCard({ m, lang, d, className = "" }: { m: Message; lang: Locale; d: Dict; className?: string }) {
  const a = d.audience;
  const v = videoOf(m.video);
  const translation = m.lang !== lang ? m.tr[lang as Locale] : undefined;
  return (
    <figure className={`card relative flex flex-col p-6 md:p-7 ${className}`}>
      <span className="absolute end-5 top-3 font-[family-name:var(--font-playfair)] text-[3.2rem] leading-none text-terra/25" aria-hidden="true">
        “
      </span>
      <span className="eyebrow plain !text-[0.6875rem] !tracking-[0.14em] text-muted">{a.langs[m.lang]}</span>
      <blockquote cite={ytUrl(v.id)} className="mt-3">
        <p lang={m.lang} dir={m.lang === "he" ? "rtl" : "ltr"} className={`text-[1.15rem] leading-relaxed text-blue ${m.lang === "he" ? "font-[family-name:var(--font-frank)] text-[1.25rem]" : "font-[family-name:var(--font-playfair)]"}`}>
          {m.text}
        </p>
      </blockquote>
      {translation && (
        <p className="mt-4 border-s-2 border-sand ps-3 text-[0.9rem] leading-relaxed text-muted">
          <span className="me-1 text-[0.75rem] font-medium tracking-wide text-terra uppercase rtl:tracking-normal">{a.translation}{lang === "fr" ? " :" : ":"}</span>
          {translation}
        </p>
      )}
      <figcaption className="mt-5 border-t border-line pt-4 text-[0.875rem]">
        <span className="block font-medium text-ink">{m.author[lang]}</span>
        <a href={ytUrl(v.id)} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1.5 text-muted underline-offset-4 hover:text-terra hover:underline">
          <span dir="auto">{v.title[lang]}</span>
          <span aria-hidden="true">·</span>
          <span>{a.source}</span>
        </a>
      </figcaption>
    </figure>
  );
}
