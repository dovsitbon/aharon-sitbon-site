"use client";

import Image from "next/image";
import Link from "next/link";
import archives from "@/data/archives.json";
import { useLocale } from "@/components/providers";
import { usePlayer } from "@/components/Player";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, DownloadIcon, PauseIcon, PlayIcon, ShuffleIcon } from "@/components/icons";
import { fill } from "@/lib/i18n";
import { albums, albumTracks, playable, singles, thumb, trOf, type Album, type Track } from "@/lib/music";
import { href } from "@/lib/routes";

/** Pochette provisoire tant que le fichier HD n'est pas fourni : titre hébreu sur fond tekhelet, cadre sable. */
function TypeCover({ he, latin, year }: { he: string; latin: string; year: number | string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue p-6 text-center text-paper">
      <div className="absolute inset-4 rounded-[0.75rem] border border-sand/50" aria-hidden="true" />
      <p className="font-[family-name:var(--font-frank)] text-[clamp(1.8rem,4vw,2.8rem)] leading-tight" lang="he" dir="rtl">
        {he}
      </p>
      <p className="mt-3 font-[family-name:var(--font-playfair)] text-[0.95rem] tracking-[0.25em] text-sand uppercase" dir="ltr">
        {latin}
      </p>
      <p className="num mt-6 text-[0.85rem] text-haze">{year}</p>
    </div>
  );
}

export function AlbumCover({ album, sizes, priority = false }: { album: Album; sizes: string; priority?: boolean }) {
  return album.cover ? (
    <Image src={album.cover} alt={`${album.he} – ${album.latin}`} fill sizes={sizes} priority={priority} className="object-cover" />
  ) : (
    <TypeCover he={album.he} latin={album.latin} year={album.year} />
  );
}

function Bars({ paused }: { paused: boolean }) {
  return (
    <span className={`eq flex h-3 items-end gap-[2px] text-terra ${paused ? "paused" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

/** Cartes des albums (accueil et page Albums) : chaque carte mène à la fiche de l'album */
export function AlbumCards() {
  const { lang, d } = useLocale();
  return (
    <ul className="grid gap-10 md:grid-cols-2 md:gap-12">
      {albums.map((a, i) => (
        <Reveal as="li" key={a.id} delay={i * 0.12}>
          <Link href={href(lang, `music/${a.id}`)} className="group glow card flex flex-col overflow-hidden p-4 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(31,78,121,0.35)] sm:flex-row sm:items-center sm:gap-7">
            <span className="shine relative block aspect-square w-full shrink-0 overflow-hidden rounded-[0.9rem] sm:w-[44%]">
              <AlbumCover album={a} sizes="(min-width: 768px) 22vw, 90vw" />
            </span>
            <span className="block px-2 pt-5 pb-2 sm:p-0">
              <span className="eyebrow plain">
                {d.music.album} · <span className="num">{a.year}</span>
              </span>
              <span className="mt-3 block font-[family-name:var(--font-frank)] text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-blue" lang="he" dir="rtl">
                {a.he}
              </span>
              <span className="mt-1 block text-muted">
                {a.latin}
                {lang !== "he" && <> · {trOf(a, lang)}</>}
              </span>
              <span className="mt-2 block text-[0.875rem] text-muted">{fill(d.music.tracks, { n: a.tracks.length })}</span>
              <span className="link-arrow mt-5">
                {d.music.open} <ArrowIcon />
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

function SingleCard({ t, i, list }: { t: Track; i: number; list: Track[] }) {
  const { lang, d } = useLocale();
  const { current, playing, playTracks, toggle } = usePlayer();
  const isCurrent = current?.id === t.id;
  return (
    <Reveal as="li" delay={(i % 4) * 0.07}>
      <button type="button" onClick={() => (isCurrent ? toggle() : playTracks(list, i))} aria-label={fill(d.music.listenTrack, { title: t.latin })} className="group glow block w-full text-start">
        <span className="shine relative block aspect-square overflow-hidden rounded-[1rem] bg-sand">
          {t.youtubeId && <Image src={thumb(t.youtubeId)} alt="" fill sizes="(min-width: 640px) 31vw, 46vw" className="object-cover" style={{ objectPosition: `${t.focal ?? 50}% 50%` }} />}
          <span className="absolute end-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-terra shadow-md transition-colors group-hover:bg-terra group-hover:text-white">
            {isCurrent && playing ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
          </span>
        </span>
        <span className="mt-4 flex items-center gap-3 font-[family-name:var(--font-frank)] text-[1.25rem] text-blue" lang="he" dir="rtl">
          {t.he}
          {isCurrent && <Bars paused={!playing} />}
        </span>
        <span className="mt-0.5 block text-[0.9375rem] text-muted">
          {t.latin}
          {lang !== "he" && <> · {t.tr[lang]}</>}
        </span>
        <span className="num mt-1 block text-[0.8125rem] text-terra">
          {d.music.single} · {t.year}
        </span>
      </button>
    </Reveal>
  );
}

export function SinglesGrid({ limit }: { limit?: number }) {
  const list = limit ? singles.slice(0, limit) : singles;
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:gap-x-10">
      {list.map((t, i) => (
        <SingleCard key={t.id} t={t} i={i} list={singles} />
      ))}
    </ul>
  );
}

export function ArchivesGrid() {
  const { d } = useLocale();
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
      {archives.singles.map((s, i) => (
        <Reveal as="li" key={s.ref} delay={(i % 4) * 0.07}>
          <div className="group">
            <span className="relative block aspect-square overflow-hidden rounded-[1rem] bg-[#2b2622]">
              {/* Pochette du 45 tours à fournir par l'artiste ; en attendant, un disque au trait */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-sand/50 transition-transform duration-[2s] group-hover:rotate-45" aria-hidden="true" fill="none" stroke="currentColor">
                <circle cx="100" cy="100" r="82" />
                <circle cx="100" cy="100" r="70" strokeOpacity="0.4" />
                <circle cx="100" cy="100" r="58" strokeOpacity="0.3" />
                <circle cx="100" cy="100" r="26" fill="#b5552b" fillOpacity="0.85" stroke="none" />
                <circle cx="100" cy="100" r="3" fill="#2b2622" />
              </svg>
              <span className="absolute inset-x-0 bottom-3 text-center text-[0.6875rem] tracking-[0.18em] text-sand/80 uppercase">{d.french.coverSoon}</span>
            </span>
            <span className="mt-4 block font-[family-name:var(--font-playfair)] text-[1.25rem] leading-tight text-blue italic" lang="fr" dir="ltr">
              {s.a}
            </span>
            <span className="mt-1 block text-[0.875rem] text-muted" dir="ltr">
              {s.artist} · <span className="num">{s.year}</span> · {s.label}
            </span>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

/** Liste des titres d'un album, avec lecture, crédits et téléchargement (si autorisé) */
export function Tracklist({ album }: { album: Album }) {
  const { lang, d } = useLocale();
  const { current, playing, playTracks, toggle } = usePlayer();
  const list = albumTracks(album);
  const m = d.music;
  const credit = (v: string | null) => v ?? m.toConfirm;
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={() => playTracks(list)}>
          <PlayIcon className="h-3 w-3" />
          {m.playAlbum}
        </button>
        <button type="button" className="btn-ghost text-blue" onClick={() => playTracks(list, 0, { shuffle: true })}>
          <ShuffleIcon className="h-3.5 w-3.5" />
          {m.shuffle}
        </button>
        {album.zip && (
          <a href={album.zip} download className="btn-ghost text-blue">
            <DownloadIcon className="h-3.5 w-3.5" />
            {m.downloadAll}
          </a>
        )}
      </div>
      {!album.zip && <p className="mt-4 text-[0.875rem] text-muted">{m.downloadOff}</p>}

      <ol className="card mt-8 divide-y divide-line overflow-hidden">
        {list.map((t, i) => {
          const isCurrent = current?.id === t.id;
          return (
            <li key={t.id} className={isCurrent ? "bg-sand-soft" : ""}>
              <div className="flex items-center gap-4 px-4 py-4 md:px-6">
                <span className="num w-6 shrink-0 text-[0.9rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  disabled={!playable(t)}
                  onClick={() => (isCurrent ? toggle() : playTracks(list, i))}
                  aria-label={fill(m.listenTrack, { title: t.latin })}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terra text-white transition-colors hover:bg-terra-deep disabled:bg-line disabled:text-muted"
                >
                  {isCurrent && playing ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-frank)] text-[1.2rem] text-blue" lang="he" dir="rtl">
                      {t.he}
                    </span>
                    {isCurrent && <Bars paused={!playing} />}
                  </p>
                  <p className="truncate text-[0.9rem] text-muted">
                    {t.latin}
                    {lang !== "he" && <> · {t.tr[lang]}</>}
                    {t.featuring && (
                      <>
                        {" "}
                        · {m.featuring} {t.featuring}
                      </>
                    )}
                    {!playable(t) && <> · {m.noVideo}</>}
                  </p>
                </div>
                <span className="num hidden shrink-0 text-[0.9rem] text-muted sm:block">{t.duration ?? "–:––"}</span>
                {t.downloadable && t.audioFile && (
                  <a href={t.audioFile} download aria-label={m.download} className="flex h-10 w-10 items-center justify-center text-muted hover:text-terra">
                    <DownloadIcon />
                  </a>
                )}
              </div>
              <details className="group/cr px-4 pb-4 ps-[5.5rem] text-[0.875rem] text-muted md:px-6 md:ps-[6rem]">
                <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-2 hover:text-terra [&::-webkit-details-marker]:hidden">
                  <span className="text-terra transition-transform group-open/cr:rotate-45">+</span> {m.credits}
                </summary>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <dt>{m.composer}</dt>
                  <dd className="text-ink">{credit(t.composer)}</dd>
                  <dt>{m.lyrics}</dt>
                  <dd className="text-ink">{t.lyrics ?? m.liturgy}</dd>
                  <dt>{m.production}</dt>
                  <dd className="text-ink">{credit(t.production)}</dd>
                </dl>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
