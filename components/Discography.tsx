"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import site from "@/data/site.json";
import archives from "@/data/archives.json";
import { useLocale } from "@/components/providers";
import { usePlayer } from "@/components/Player";
import { Reveal } from "@/components/Reveal";
import { AppleMusicIcon, CloseIcon, DownloadIcon, PauseIcon, PlayIcon, ShuffleIcon, YouTubeIcon } from "@/components/icons";
import { fill } from "@/lib/i18n";
import { albums, albumTracks, playable, singles, thumb, trOf, type Album, type Track } from "@/lib/music";

/** Pochette provisoire tant que le fichier HD n'est pas fourni : titre hébreu au trait doré sur bleu nuit. */
function TypeCover({ he, latin, year }: { he: string; latin: string; year: number | string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-night-2 p-6 text-center">
      <div className="absolute inset-3 border border-gold/40" aria-hidden="true" />
      <p className="font-[family-name:var(--font-frank)] text-[clamp(1.6rem,4vw,2.6rem)] leading-tight font-light text-parchment" lang="he" dir="rtl">
        {he}
      </p>
      <p className="mt-3 font-[family-name:var(--font-cormorant)] text-[0.95rem] tracking-[0.3em] text-gold uppercase" dir="ltr">
        {latin}
      </p>
      <p className="num mt-6 text-[0.8rem] text-mist">{year}</p>
    </div>
  );
}

function AlbumCover({ album, sizes }: { album: Album; sizes: string }) {
  return album.cover ? (
    <Image src={album.cover} alt={`${album.he} – ${album.latin}`} fill sizes={sizes} className="object-cover" />
  ) : (
    <TypeCover he={album.he} latin={album.latin} year={album.year} />
  );
}

function PlayingBars({ paused }: { paused: boolean }) {
  return (
    <span className={`eq flex h-3 items-end gap-[2px] ${paused ? "paused" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function AlbumSheet({ album, onClose }: { album: Album; onClose: () => void }) {
  const { lang, d } = useLocale();
  const { current, playing, playTracks, toggle } = usePlayer();
  const ref = useRef<HTMLDialogElement>(null);
  const list = albumTracks(album);
  const m = d.music;

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    dlg.showModal();
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  const credit = (v: string | null) => v ?? m.toConfirm;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-labelledby={`sheet-${album.id}`}
      className="fade-in m-auto max-h-[92dvh] w-[min(1100px,94vw)] overflow-y-auto overscroll-contain bg-night-2 p-0 text-parchment backdrop:bg-night/85 backdrop:backdrop-blur-sm"
    >
      <div className="grid gap-10 p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:p-12">
        <div>
          <div className="relative aspect-square overflow-hidden">
            <AlbumCover album={album} sizes="(min-width: 768px) 440px, 90vw" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-solid" onClick={() => playTracks(list)}>
              <PlayIcon className="h-3 w-3" />
              {m.playAlbum}
            </button>
            <button type="button" className="btn-line" onClick={() => playTracks(list, 0, { shuffle: true })}>
              <ShuffleIcon className="h-3.5 w-3.5" />
              {m.shuffle}
            </button>
          </div>
          {album.zip ? (
            <a href={album.zip} download className="btn-line mt-3 w-full">
              <DownloadIcon className="h-3.5 w-3.5" />
              {m.downloadAll}
            </a>
          ) : (
            <p className="mt-5 text-[0.875rem] leading-relaxed text-mist">{m.downloadOff}</p>
          )}
          <div className="mt-8 border-t border-line-dark pt-6">
            <p className="eyebrow">{m.alsoOn}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[0.9375rem]">
              {album.appleMusic && (
                <li>
                  <a href={album.appleMusic} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-gold">
                    <AppleMusicIcon className="h-4 w-4" /> Apple Music
                  </a>
                </li>
              )}
              <li>
                <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-gold">
                  <YouTubeIcon className="h-4 w-4" /> YouTube
                </a>
              </li>
              {album.spotify && (
                <li>
                  <a href={album.spotify} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-gold">
                    Spotify
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow">
                {m.album} · <span className="num">{album.year}</span>
              </p>
              <h3 id={`sheet-${album.id}`} className="mt-4 font-[family-name:var(--font-frank)] text-[clamp(2rem,4vw,3rem)] leading-tight font-light" lang="he" dir="rtl">
                {album.he}
              </h3>
              <p className="mt-2 text-mist">
                {album.latin}
                {lang !== "he" && <span> · {album.tr[lang]}</span>}
              </p>
            </div>
            <button type="button" onClick={() => ref.current?.close()} aria-label={m.close} className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center text-mist hover:text-parchment">
              <CloseIcon />
            </button>
          </div>

          <ol className="mt-8 border-t border-line-dark">
            {list.map((t, i) => {
              const isCurrent = current?.id === t.id;
              return (
                <li key={t.id} className="border-b border-line-dark">
                  <div className="flex items-center gap-4 py-3.5">
                    <span className="num w-7 shrink-0 text-[0.8rem] text-mist">{String(i + 1).padStart(2, "0")}</span>
                    <button
                      type="button"
                      disabled={!playable(t)}
                      onClick={() => (isCurrent ? toggle() : playTracks(list, i))}
                      aria-label={fill(m.listenTrack, { title: t.latin })}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors hover:bg-gold hover:text-night disabled:border-line-dark disabled:text-line-dark"
                    >
                      {isCurrent && playing ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-3">
                        <span className="font-[family-name:var(--font-frank)] text-[1.15rem]" lang="he" dir="rtl">
                          {t.he}
                        </span>
                        {isCurrent && <PlayingBars paused={!playing} />}
                      </p>
                      <p className="truncate text-[0.875rem] text-mist">
                        {t.latin}
                        {lang !== "he" && <span> · {t.tr[lang]}</span>}
                        {t.featuring && (
                          <span>
                            {" "}
                            · {m.featuring} {t.featuring}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="num hidden shrink-0 text-[0.8rem] text-mist sm:block">{t.duration ?? "–:––"}</span>
                    {t.downloadable && t.audioFile && (
                      <a href={t.audioFile} download aria-label={m.download} className="flex h-9 w-9 items-center justify-center text-mist hover:text-gold">
                        <DownloadIcon />
                      </a>
                    )}
                  </div>
                  <details className="group/cr pb-3 ps-11 text-[0.8125rem] text-mist">
                    <summary className="inline-flex min-h-8 cursor-pointer list-none items-center gap-2 tracking-wide hover:text-parchment [&::-webkit-details-marker]:hidden">
                      <span className="text-gold transition-transform group-open/cr:rotate-45">+</span> {m.credits}
                    </summary>
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                      <dt>{m.composer}</dt>
                      <dd className="text-parchment/85">{credit(t.composer)}</dd>
                      <dt>{m.lyrics}</dt>
                      <dd className="text-parchment/85">{t.lyrics ?? m.liturgy}</dd>
                      <dt>{m.production}</dt>
                      <dd className="text-parchment/85">{credit(t.production)}</dd>
                    </dl>
                  </details>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-[0.8125rem] text-mist">
            {m.producers}{lang === "fr" ? " :" : ":"} <span dir="auto">{album.producers}</span>
          </p>
        </div>
      </div>
    </dialog>
  );
}

function SingleCard({ t, i }: { t: Track; i: number }) {
  const { lang, d } = useLocale();
  const { current, playing, playTracks, toggle } = usePlayer();
  const isCurrent = current?.id === t.id;
  return (
    <Reveal as="li" delay={(i % 4) * 0.08}>
      <button
        type="button"
        onClick={() => (isCurrent ? toggle() : playTracks(singles, i))}
        aria-label={fill(d.music.listenTrack, { title: t.latin })}
        className="group stage-light block w-full text-start"
      >
        <span className="shine relative block aspect-square bg-night-2">
          {t.youtubeId && <Image src={thumb(t.youtubeId)} alt="" fill sizes="(min-width: 640px) 30vw, 46vw" className="object-cover" style={{ objectPosition: `${t.focal ?? 50}% 50%` }} />}
          <span className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" aria-hidden="true" />
          <span className="absolute end-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full border border-parchment/70 bg-night/40 text-parchment backdrop-blur-sm transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-night">
            {isCurrent && playing ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
          </span>
        </span>
        <span className="mt-4 flex items-center gap-3 font-[family-name:var(--font-frank)] text-[1.2rem]" lang="he" dir="rtl">
          {t.he}
          {isCurrent && <PlayingBars paused={!playing} />}
        </span>
        <span className="mt-1 block text-[0.875rem] text-mist">
          {t.latin}
          {lang !== "he" && <> · {t.tr[lang]}</>}
        </span>
        <span className="num mt-1 block text-[0.75rem] text-gold">
          {d.music.single} · {t.year}
        </span>
      </button>
    </Reveal>
  );
}

export function Discography() {
  const { lang, d } = useLocale();
  const [open, setOpen] = useState<Album | null>(null);
  const m = d.music;

  return (
    <>
      <div className="mt-20">
        <div className="flex items-baseline justify-between gap-6 border-b border-line-dark pb-4">
          <h3 className="eyebrow">{m.albums}</h3>
          <span className="num text-[0.75rem] text-mist">2016 · 2021</span>
        </div>
        <ul className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          {albums.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 0.12}>
              <button type="button" onClick={() => setOpen(a)} className="group stage-light block w-full text-start" aria-haspopup="dialog">
                <span className="shine relative block aspect-square">
                  <AlbumCover album={a} sizes="(min-width: 768px) 44vw, 92vw" />
                </span>
                <span className="mt-6 flex items-start justify-between gap-6">
                  <span>
                    <span className="block font-[family-name:var(--font-frank)] text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-light" lang="he" dir="rtl">
                      {a.he}
                    </span>
                    <span className="mt-1 block text-mist">
                      {a.latin}
                      {lang !== "he" && <> · {trOf(a, lang)}</>}
                    </span>
                  </span>
                  <span className="shrink-0 text-end">
                    <span className="num block text-gold">{a.year}</span>
                    <span className="mt-1 block text-[0.8125rem] text-mist">{fill(m.tracks, { n: a.tracks.length })}</span>
                  </span>
                </span>
                <span className="nav-link link-line mt-5 inline-block text-parchment">{m.open}</span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="mt-24">
        <div className="flex items-baseline justify-between gap-6 border-b border-line-dark pb-4">
          <h3 className="eyebrow">{m.singles}</h3>
          <span className="num text-[0.75rem] text-mist">2019 · 2026</span>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:gap-x-10">
          {singles.map((t, i) => (
            <SingleCard key={t.id} t={t} i={i} />
          ))}
        </ul>
      </div>

      <div className="mt-24">
        <div className="flex items-baseline justify-between gap-6 border-b border-line-dark pb-4">
          <h3 className="eyebrow">{m.archives}</h3>
          <span className="num text-[0.75rem] text-mist">1971 · 1980</span>
        </div>
        <p className="mt-6 max-w-xl text-mist">{m.archivesText}</p>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {archives.singles.map((s, i) => (
            <Reveal as="li" key={s.ref} delay={(i % 4) * 0.08}>
              <a href="#french" className="group stage-light block">
                <span className="relative block aspect-square overflow-hidden bg-[#1c1712]">
                  {/* Pochette du 45 tours à fournir par l'artiste ; en attendant, un disque au trait */}
                  <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-gold/50 transition-transform duration-[2s] group-hover:rotate-45" aria-hidden="true" fill="none" stroke="currentColor">
                    <circle cx="100" cy="100" r="82" />
                    <circle cx="100" cy="100" r="70" strokeOpacity="0.4" />
                    <circle cx="100" cy="100" r="58" strokeOpacity="0.3" />
                    <circle cx="100" cy="100" r="26" />
                    <circle cx="100" cy="100" r="3" fill="currentColor" />
                  </svg>
                  <span className="absolute inset-x-0 bottom-3 text-center text-[0.6875rem] tracking-[0.2em] text-mist uppercase">{d.french.coverSoon}</span>
                </span>
                <span className="mt-4 block font-[family-name:var(--font-cormorant)] text-[1.3rem] leading-tight italic" lang="fr" dir="ltr">
                  {s.a}
                </span>
                <span className="mt-1 block text-[0.875rem] text-mist" dir="ltr">
                  {s.artist} · <span className="num">{s.year}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      {open && <AlbumSheet album={open} onClose={() => setOpen(null)} />}
    </>
  );
}
