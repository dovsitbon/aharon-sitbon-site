import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import site from "@/data/site.json";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { M, Photo } from "@/lib/ui";
import { thumb, trackById } from "@/lib/music";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ListenButton } from "@/components/ListenButton";
import { WatchButton } from "@/components/Clips";
import { AppleMusicIcon, FacebookIcon, YouTubeIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/today">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/today", d.pages.today.title, d.pages.today.desc, "/og/today.jpg");
}

export default async function Today({ params }: PageProps<"/[lang]/today">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.today;
  const t = d.today;
  const howPhotos = [M("scene", "studio-gam-ki-elech"), M("scene", "interview-hamevaker"), M("famille", "achake-lo-david")];

  return (
    <>
      <JsonLd data={breadcrumbLd(lang, d, [[d.nav.today, `/${lang}/today`]])} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "desert-guitare")} position="55% 30%">
        <ListenButton label={d.hero.listen} />
      </PageHero>

      {/* Les dernières sorties */}
      <section className="px-5 py-24 md:px-10 md:py-28" aria-labelledby="releases">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <SectionHead id="releases" eyebrow={t.releasesEyebrow} title={t.releasesTitle} />
          </Reveal>
          <ol className="relative mt-14 space-y-5">
            {t.releases.map((r, i) => {
              const tr = trackById[r.id];
              return (
                <Reveal as="li" key={r.id} delay={0.04} className="card grid gap-5 overflow-hidden p-4 sm:grid-cols-[15rem_1fr] sm:items-center sm:gap-8 md:p-5">
                  <div className="relative aspect-video overflow-hidden rounded-[0.9rem] bg-sand">
                    {tr.youtubeId && <Image src={thumb(tr.youtubeId)} alt="" fill sizes="(min-width: 640px) 15rem, 90vw" className="object-cover" />}
                  </div>
                  <div className="px-2 pb-2 sm:p-0">
                    <p className="num text-[0.95rem] text-terra">
                      {String(i + 1).padStart(2, "0")} · {r.date}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-frank)] text-[1.7rem] leading-tight text-blue" lang="he" dir="rtl">
                      {tr.he}
                    </h3>
                    <p className="text-[0.9375rem] text-muted">
                      {tr.latin}
                      {lang !== "he" && <> · {tr.tr[lang]}</>}
                    </p>
                    <p className="mt-3 leading-relaxed text-ink">{r.note}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <ListenButton trackId={tr.id} label={d.music.listen} className="btn !min-h-11 !px-5" />
                      {tr.youtubeId && <WatchButton id={tr.youtubeId} title={`${tr.he} – ${tr.latin}`} label={d.clips.play} className="btn-ghost !min-h-11 !px-5 text-blue" />}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Sa façon de travailler */}
      <section className="bg-sand-soft px-5 py-24 md:px-10 md:py-28" aria-labelledby="how">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="how" eyebrow={t.howEyebrow} title={t.howTitle} />
          </Reveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {t.how.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 0.08} className="card overflow-hidden">
                <Photo src={howPhotos[i]} d={d} sizes="(min-width: 768px) 31vw, 92vw" className="aspect-[16/10]" />
                <div className="p-7">
                  <span className="num text-terra">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-2 text-[1.7rem]">{h.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Sa mission */}
      <section className="dark grain relative overflow-hidden px-5 py-28 text-center md:px-10 md:py-36" aria-labelledby="mission">
        <Reveal className="relative mx-auto max-w-3xl">
          <p className="eyebrow">{t.missionEyebrow}</p>
          <p id="mission" className="display mt-8 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.25]">
            {t.mission}
          </p>
          <p className="mt-6 text-[0.875rem] text-haze">{t.missionNote}</p>
        </Reveal>
      </section>

      {/* Le suivre */}
      <section className="px-5 py-24 md:px-10 md:py-28" aria-labelledby="follow">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <SectionHead id="follow" eyebrow={t.followEyebrow} title={t.followTitle} intro={t.followText} />
          </Reveal>
          <Reveal delay={0.1} className="grid gap-4">
            <a href={site.youtube} target="_blank" rel="noopener noreferrer" className="card group flex items-center gap-5 p-6 transition-colors hover:border-terra/50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terra text-white">
                <YouTubeIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[1.2rem] font-medium text-blue">YouTube</span>
                <span className="block text-muted">{t.subscribers}</span>
              </span>
            </a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-5 p-6 transition-colors hover:border-terra/50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-soft text-blue">
                <FacebookIcon className="h-6 w-6" />
              </span>
              <span className="text-[1.2rem] font-medium text-blue">Facebook</span>
            </a>
            <a href={site.appleMusic} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-5 p-6 transition-colors hover:border-terra/50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-soft text-blue">
                <AppleMusicIcon className="h-6 w-6" />
              </span>
              <span className="text-[1.2rem] font-medium text-blue">Apple Music</span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
