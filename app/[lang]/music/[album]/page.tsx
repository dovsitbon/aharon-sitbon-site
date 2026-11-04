import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import site from "@/data/site.json";
import { fill, getDict, isLocale, locales } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href } from "@/lib/routes";
import { albums, trOf } from "@/lib/music";
import { AlbumCover, Tracklist } from "@/components/Discography";
import { AppleMusicIcon, ArrowIcon, YouTubeIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((lang) => albums.map((a) => ({ lang, album: a.id })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/music/[album]">): Promise<Metadata> {
  const { lang, album } = await params;
  const a = albums.find((x) => x.id === album);
  if (!isLocale(lang) || !a) return {};
  const d = getDict(lang);
  const title = `${a.he} – ${a.latin} (${a.year})`;
  const desc = `${d.music.album} ${a.year} · ${fill(d.music.tracks, { n: a.tracks.length })} · ${a.producers}${lang === "he" ? "" : ` · ${trOf(a, lang)}`}`;
  return pageMetadata(lang, `/music/${a.id}`, title, desc, a.cover ?? "/og.jpg");
}

export default async function AlbumPage({ params }: PageProps<"/[lang]/music/[album]">) {
  const { lang, album } = await params;
  const a = albums.find((x) => x.id === album);
  if (!isLocale(lang) || !a) notFound();
  const d = getDict(lang);
  const other = albums.find((x) => x.id !== a.id)!;
  const m = d.music;

  return (
    <section className="grain bg-sand-soft px-5 pt-28 pb-24 md:px-10 md:pt-36 md:pb-32">
      <div className="relative mx-auto max-w-[1320px]">
        <nav aria-label="breadcrumb" className="text-[0.875rem] text-muted">
          <Link href={`/${lang}`} className="hover:text-terra">
            {d.nav.home}
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <Link href={href(lang, "music")} className="hover:text-terra">
            {d.nav.music}
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span aria-current="page">{a.latin}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] shadow-[0_40px_80px_-40px_rgba(31,78,121,0.5)]">
              <AlbumCover album={a} sizes="(min-width: 1024px) 40vw, 92vw" priority />
            </div>
            <div className="card mt-6 p-6">
              <p className="eyebrow plain">{m.alsoOn}</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {a.appleMusic && (
                  <li>
                    <a href={a.appleMusic} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-11 !px-5 text-blue">
                      <AppleMusicIcon className="h-4 w-4" /> Apple Music
                    </a>
                  </li>
                )}
                <li>
                  <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-11 !px-5 text-blue">
                    <YouTubeIcon className="h-4 w-4" /> YouTube
                  </a>
                </li>
                {a.spotify && (
                  <li>
                    <a href={a.spotify} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-11 !px-5 text-blue">
                      Spotify
                    </a>
                  </li>
                )}
              </ul>
              <p className="mt-5 text-[0.875rem] text-muted">
                {m.producers}
                {lang === "fr" ? " :" : ":"} <span dir="auto">{a.producers}</span>
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow">
              {m.album} · <span className="num">{a.year}</span> · {fill(m.tracks, { n: a.tracks.length })}
            </p>
            <h1 className="mt-5 font-[family-name:var(--font-frank)] text-[clamp(2.8rem,6vw,4.6rem)] leading-tight text-blue" lang="he" dir="rtl">
              {a.he}
            </h1>
            <p className="mt-2 text-[1.15rem] text-muted">
              {a.latin}
              {lang !== "he" && <> · {trOf(a, lang)}</>}
            </p>
            <div className="mt-10">
              <Tracklist album={a} />
            </div>
            <Link href={href(lang, `music/${other.id}`)} className="card group mt-10 flex items-center justify-between gap-6 p-6 transition-colors hover:border-terra/50">
              <span>
                <span className="eyebrow plain">
                  {m.album} · <span className="num">{other.year}</span>
                </span>
                <span className="mt-2 block font-[family-name:var(--font-frank)] text-[1.6rem] text-blue" lang="he" dir="rtl">
                  {other.he}
                </span>
              </span>
              <span className="text-terra transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <ArrowIcon className="h-5 w-5 rtl:-scale-x-100" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
