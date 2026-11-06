import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import concerts from "@/data/concerts.json";
import press from "@/data/press.json";
import { altOf, getDict, isLocale } from "@/lib/i18n";
import { jsonLd } from "@/lib/jsonld";
import { href } from "@/lib/routes";
import { M, Photo } from "@/lib/ui";
import { thumb, trackById } from "@/lib/music";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/PageHero";
import { ListenButton } from "@/components/ListenButton";
import { HeroSlides } from "@/components/HeroSlides";
import { AlbumCards } from "@/components/Discography";
import { Clips } from "@/components/Clips";
import { ArrowIcon } from "@/components/icons";

// Diaporama de l'accueil : [nom dans public/media/slides, cadrage]
const SLIDES: [string, string][] = [
  ["kotel-guitare", "40% 30%"],
  ["guitare-nuit", "62% 30%"],
  ["desert-guitare", "50% 30%"],
  ["tour-de-david-live", "55% 25%"],
  ["terrasse-jerusalem", "50% 30%"],
  ["higia-zman-live", "40% 30%"],
  ["micro-nuit", "55% 30%"],
  ["studio-micro", "60% 30%"],
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const h = d.home;
  const latest = trackById["niggun-yehudi"];
  const media = [...new Set(press.map((p) => p.media))];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang, d)).replace(/</g, "\\u003c") }} />

      {/* Hero plein écran */}
      <section className="on-photo relative flex min-h-[100svh] items-end overflow-hidden bg-blue-deep" aria-labelledby="hero-title">
        {/* Diaporama : ses plus belles photos (provisoires, issues de ses clips) — à remplacer par des photos HD dans public/media/slides/ */}
        <HeroSlides label={d.hero.eyebrow} slides={SLIDES.map(([name, position]) => ({ src: M("slides", name), alt: altOf(d, M("slides", name)), position }))} />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/95 via-blue-deep/40 to-blue-deep/20" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 pt-36 pb-20 md:px-10 md:pb-24">
          <p className="eyebrow rise" style={{ animationDelay: "0.2s" }}>
            {d.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display rise mt-6 max-w-4xl text-[clamp(2.8rem,7.6vw,6.6rem)]" style={{ animationDelay: "0.35s" }}>
            {d.hero.title}
          </h1>
          <p className="lead rise mt-6 max-w-xl" style={{ animationDelay: "0.5s" }}>
            {d.manifesto.text}
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.65s" }}>
            <ListenButton label={d.hero.listen} className="btn" />
            <Link href={href(lang, "story")} className="btn-ghost text-paper">
              {d.hero.book}
            </Link>
          </div>
        </div>
      </section>

      {/* Repères */}
      <section className="border-b border-line bg-paper px-5 md:px-10" aria-label={d.cards.eyebrow}>
        <ul className="mx-auto grid max-w-[1320px] grid-cols-2 md:grid-cols-4">
          {h.facts.map((f, i) => (
            <Reveal as="li" key={f.n} delay={i * 0.08} className={`py-10 md:py-14 ${i % 2 ? "ps-6" : "pe-6"} ${i > 0 ? "md:border-s md:border-line md:ps-8" : ""}`}>
              <p className="num text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-blue">{f.n}</p>
              <p className="mt-3 text-[0.9375rem] leading-snug text-muted">{f.t}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Son histoire */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="h-story">
        <div className="mx-auto grid max-w-[1320px] items-center gap-14 md:grid-cols-2 md:gap-20">
          <Reveal className="relative mx-auto w-full max-w-md">
            <Photo src={M("archives-1977", "portrait-annees-70")} d={d} sizes="(min-width: 768px) 30vw, 70vw" className="arch aspect-[4/5]" position="50% 30%" />
            <div className="absolute -end-4 -bottom-8 w-[46%] overflow-hidden rounded-[1.25rem] border-[6px] border-paper shadow-xl md:-end-12">
              <Photo src={M("portrait", "portrait-chaine")} d={d} sizes="20vw" className="aspect-square" />
            </div>
          </Reveal>
          <Reveal>
            <SectionHead id="h-story" eyebrow={d.story.eyebrow} title={h.storyTitle} />
            <p className="lead mt-6">{h.storyText}</p>
            <Link href={href(lang, "story")} className="link-arrow mt-8">
              {h.storyLink} <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Dernière sortie */}
      <section className="px-5 md:px-10" aria-labelledby="h-latest">
        <Reveal className="dark grain mx-auto grid max-w-[1320px] items-center gap-10 overflow-hidden rounded-[2rem] p-6 md:grid-cols-[1.1fr_1fr] md:p-12">
          <div className="relative aspect-video overflow-hidden rounded-[1.25rem]">
            <Image src={thumb(latest.youtubeId!)} alt="" fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">{h.latestEyebrow}</p>
            <h2 id="h-latest" className="mt-5 font-[family-name:var(--font-frank)] text-[clamp(2.4rem,5vw,3.6rem)] leading-tight" lang="he" dir="rtl">
              {latest.he}
            </h2>
            <p className="mt-1 text-haze">
              {latest.latin}
              {lang !== "he" && <> · {latest.tr[lang]}</>}
            </p>
            <p className="lead mt-5">{h.latestText}</p>
            <ListenButton trackId={latest.id} label={h.latestListen} className="btn mt-8" />
          </div>
        </Reveal>
      </section>

      {/* Albums */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="h-music">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="h-music" eyebrow={d.music.eyebrow} title={h.musicTitle} />
            <Link href={href(lang, "music")} className="link-arrow">
              {h.musicLink} <ArrowIcon />
            </Link>
          </div>
          <AlbumCards />
        </div>
      </section>

      {/* Aujourd'hui */}
      <section className="bg-sand-soft px-5 py-24 md:px-10 md:py-32" aria-labelledby="h-today">
        <div className="mx-auto grid max-w-[1320px] items-center gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <Reveal>
            <SectionHead id="h-today" eyebrow={d.pages.today.eyebrow} title={h.todayTitle} intro={h.todayText} />
            <ul className="mt-8 space-y-3">
              {d.today.releases.slice(0, 3).map((r) => {
                const t = trackById[r.id];
                return (
                  <li key={r.id} className="card flex items-center gap-4 p-3 pe-5">
                    <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-[0.75rem] bg-sand">
                      {t.youtubeId && <Image src={thumb(t.youtubeId)} alt="" fill sizes="112px" className="object-cover" />}
                    </span>
                    <span className="num hidden w-24 shrink-0 text-[0.9rem] text-terra sm:block">{r.date}</span>
                    <span className="min-w-0">
                      <span className="block font-[family-name:var(--font-frank)] text-[1.15rem] text-blue" lang="he" dir="rtl">
                        {t.he}
                      </span>
                      <span className="block truncate text-[0.875rem] text-muted">
                        <span className="text-terra sm:hidden">{r.date} · </span>
                        {lang === "he" ? t.latin : t.tr[lang]}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link href={href(lang, "today")} className="btn mt-9">
              {h.todayLink}
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
            <Photo src={M("scene", "studio-micro")} d={d} sizes="(min-width: 768px) 25vw, 90vw" className="col-span-2 aspect-[16/10] rounded-[1.25rem]" />
            <Photo src={M("famille", "achake-lo-david")} d={d} sizes="(min-width: 768px) 13vw, 45vw" className="aspect-square rounded-[1.25rem]" />
            <Photo src={M("famille", "modeh-ani-petit-fils")} d={d} sizes="(min-width: 768px) 13vw, 45vw" className="aspect-square rounded-[1.25rem]" />
          </Reveal>
        </div>
      </section>

      {/* Clips */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="h-videos">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="h-videos" eyebrow={d.clips.eyebrow} title={h.videosTitle} />
            <Link href={href(lang, "videos")} className="link-arrow">
              {h.videosLink} <ArrowIcon />
            </Link>
          </div>
          <Clips limit={3} filters={false} />
        </div>
      </section>

      {/* Événements */}
      <section className="border-t border-line px-5 py-24 md:px-10 md:py-32" aria-labelledby="h-events">
        <div className="mx-auto grid max-w-[1320px] gap-14 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal>
            <SectionHead id="h-events" eyebrow={d.pages.events.eyebrow} title={h.eventsTitle} />
            <p className="lead mt-6">{h.eventsText}</p>
            <Link href={href(lang, "events")} className="link-arrow mt-8">
              {h.eventsLink} <ArrowIcon />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="card divide-y divide-line">
              {concerts.past.slice(0, 4).map((p, i) => (
                <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-4 px-6 py-5">
                  <span className="num pt-0.5 text-[1.3rem] text-terra">{p.year}</span>
                  <span>
                    <span className="block font-medium text-blue">{p.place[lang]}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{p.text[lang]}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Presse : défilement des médias */}
      <section className="overflow-hidden border-t border-line py-16" aria-labelledby="h-press">
        <div className="mx-auto mb-10 flex max-w-[1320px] flex-wrap items-end justify-between gap-6 px-5 md:px-10">
          <SectionHead id="h-press" eyebrow={d.press.eyebrow} title={h.pressTitle} />
          <Link href={href(lang, "press")} className="link-arrow">
            {h.pressLink} <ArrowIcon />
          </Link>
        </div>
        <div className="marquee" aria-hidden="true">
          {[...media, ...media].map((m, i) => (
            <span key={i} className="mx-8 font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3vw,2.4rem)] whitespace-nowrap text-blue/70 italic" dir="ltr">
              {m}
              <span className="ms-16 text-terra">·</span>
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

export const dynamic = "force-static";
