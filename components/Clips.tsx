"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { usePlayer } from "@/components/Player";
import { CloseIcon, PlayIcon, YouTubeIcon } from "@/components/icons";
import { fill } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";
import { clips, thumb, trackById, type Clip } from "@/lib/music";

const KINDS = ["all", "spanish", "official", "live", "interview", "archive"] as const;
type Kind = (typeof KINDS)[number];
const STEP = 12;

/** Lecteur YouTube léger : rien n'est chargé avant le clic, puis l'iframe (youtube-nocookie) s'ouvre en grand. */
export function VideoDialog({ id, title, onClose }: { id: string; title: string; onClose: () => void }) {
  const { lang, d } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    return () => lenis?.start();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-label={title}
      className="m-auto w-[min(1200px,94vw)] overflow-visible bg-transparent p-0 backdrop:bg-blue-deep/90 backdrop:backdrop-blur-sm"
    >
      <div className="fade-in">
        <div className="mb-3 flex items-center justify-between gap-4 text-paper">
          <p className="truncate text-[0.9375rem]">{title}</p>
          <button type="button" onClick={() => ref.current?.close()} aria-label={d.music.close} className="flex h-11 w-11 shrink-0 items-center justify-center hover:text-sand">
            <CloseIcon />
          </button>
        </div>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&hl=${lang}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="aspect-video w-full rounded-xl bg-black"
        />
      </div>
    </dialog>
  );
}

export function clipTitle(c: Clip, lang: Locale) {
  if (c.title) return c.title[lang];
  const t = c.track ? trackById[c.track] : null;
  return t ? (lang === "he" ? t.he : t.latin) : "";
}

export function Clips({ limit, filters = true }: { limit?: number; filters?: boolean } = {}) {
  const { lang, d } = useLocale();
  const { playing, toggle } = usePlayer();
  const [kind, setKind] = useState<Kind>("all");
  const [shown, setShown] = useState(limit ?? STEP);
  const [open, setOpen] = useState<Clip | null>(null);
  const list = kind === "all" ? clips : kind === "spanish" ? clips.filter((c) => c.spanish) : clips.filter((c) => c.kind === kind);

  // Lien direct vers un filtre : /videos#spanish
  useEffect(() => {
    const h = window.location.hash.slice(1) as Kind;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- l'ancre n'est connue que dans le navigateur
    if (filters && (KINDS as readonly string[]).includes(h)) setKind(h);
  }, [filters]);
  const nf = new Intl.NumberFormat(intlLocale[lang], { notation: "compact", maximumFractionDigits: 0 });

  const play = (c: Clip) => {
    if (playing) toggle(); // une seule musique à la fois
    setOpen(c);
  };

  return (
    <>
      {filters && (<div className="mt-12 flex flex-wrap gap-2" role="group" aria-label={d.nav.clips}>
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            className="chip text-[0.9375rem]"
            aria-pressed={kind === k}
            onClick={() => {
              setKind(k);
              setShown(STEP);
            }}
          >
            {d.clips.filters[k]}
          </button>
        ))}
      </div>)}

      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, shown).map((c) => {
          const t = c.track ? trackById[c.track] : null;
          const title = clipTitle(c, lang);
          const sub = c.title ? null : t ? (lang === "he" ? t.latin : t.tr[lang]) : null;
          return (
            <li key={c.id} className="fade-in">
              <button type="button" onClick={() => play(c)} className="group glow block w-full text-start" aria-haspopup="dialog" aria-label={`${d.clips.play} : ${title}`}>
                <span className="shine relative block aspect-video overflow-hidden rounded-[1rem] bg-sand">
                  <Image src={thumb(c.id)} alt="" fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw" className="object-cover" />
                  <span className="absolute inset-0 bg-blue-deep/15 transition-colors duration-700 group-hover:bg-transparent" aria-hidden="true" />
                  <span className="absolute start-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-terra shadow-md transition-colors group-hover:bg-terra group-hover:text-white">
                    <PlayIcon />
                  </span>
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className={`text-[1.15rem] leading-snug text-blue ${t && !c.title ? "font-[family-name:var(--font-frank)]" : ""}`} lang={t && !c.title ? "he" : undefined} dir={t && !c.title && lang !== "he" ? "rtl" : undefined}>
                    {t && !c.title ? t.he : title}
                  </span>
                  <span className="eyebrow plain shrink-0 !text-[0.6875rem]">{c.spanish ? d.clips.filters.spanish : d.clips.filters[c.kind]}</span>
                </span>
                {(sub || c.note || c.views) && (
                  <span className="mt-1 block text-[0.875rem] text-muted">
                    {[sub, c.note?.[lang], c.views ? fill(d.clips.views, { n: nf.format(c.views) }) : null].filter(Boolean).join(" · ")}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
        {!limit && shown < list.length && (
          <button type="button" className="btn-ghost text-blue" onClick={() => setShown((s) => s + STEP)}>
            {d.clips.more}
          </button>
        )}
        <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="btn">
          <YouTubeIcon className="h-4 w-4" />
          {d.clips.channel}
        </a>
      </div>

      {open && <VideoDialog id={open.id} title={clipTitle(open, lang)} onClose={() => setOpen(null)} />}
    </>
  );
}

/** Bouton qui ouvre une vidéo précise (archive 1977, etc.) */
export function WatchButton({ id, title, label, className = "btn-ghost" }: { id: string; title: string; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <PlayIcon className="h-3 w-3" />
        {label}
      </button>
      {open && <VideoDialog id={id} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}
