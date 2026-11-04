import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import archives from "@/data/archives.json";
import concerts from "@/data/concerts.json";
import press from "@/data/press.json";
import { altOf, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { jsonLd } from "@/lib/jsonld";
import { formatDay } from "@/lib/booking";
import { Reveal } from "@/components/Reveal";
import { Mark, SkylineRule } from "@/components/Logo";
import { ListenButton } from "@/components/ListenButton";
import { Discography } from "@/components/Discography";
import { Clips, WatchButton } from "@/components/Clips";
import { BookingForm } from "@/components/BookingForm";
import { ArrowIcon } from "@/components/icons";

const M = (cat: string, name: string) => `/media/${cat}/${name}.jpg`;

function Photo({ src, d, sizes, className = "", priority = false, position }: { src: string; d: Dict; sizes: string; className?: string; priority?: boolean; position?: string }) {
  return (
    <div className={`shine relative overflow-hidden bg-night-2 ${className}`}>
      <Image src={src} alt={altOf(d, src)} fill sizes={sizes} priority={priority} className="object-cover" style={position ? { objectPosition: position } : undefined} />
    </div>
  );
}

function Head({ eyebrow, title, intro, center = false, id }: { eyebrow: string; title: ReactNode; intro?: string; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-6 text-[clamp(2.6rem,6vw,4.75rem)]">
        {title}
      </h2>
      {intro && <p className={`lead mt-7 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{intro}</p>}
    </Reveal>
  );
}

function Hero({ d, lang }: { d: Dict; lang: Locale }) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-night text-parchment" aria-labelledby="hero-title">
      {/* Emplacement du hero : remplacer par une boucle vidéo silencieuse (public/media/hero/boucle.mp4) dès que l'artiste fournit les sources */}
      <div className="drift absolute inset-0">
        <Image src={M("hero", "guitare-nuit")} alt={altOf(d, M("hero", "guitare-nuit"))} fill priority sizes="100vw" className="object-cover object-[58%_25%] md:object-[68%_30%]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgb(15_20_36/0.85),transparent_65%)]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-40 pb-24 text-center md:px-10 md:pb-28">
        <p className="eyebrow rise" style={{ animationDelay: "0.2s" }}>
          {d.hero.eyebrow}
        </p>
        <h1 id="hero-title" className="display rise mx-auto mt-8 max-w-5xl text-[clamp(2.9rem,8.4vw,7.4rem)]" style={{ animationDelay: "0.35s" }}>
          {d.hero.title}
        </h1>
        <div className="rise mt-12 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.6s" }}>
          <ListenButton label={d.hero.listen} className="btn-line border-gold text-gold hover:!text-night" />
          <Link href={`/${lang}#contact`} className="btn-line">
            {d.hero.book}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 pb-6 md:flex" aria-hidden="true">
        <span className="h-12 w-px overflow-hidden">
          <span className="scroll-line block h-full w-px bg-gold" />
        </span>
      </div>
    </section>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const nf = (iso: string) => (iso.length === 4 ? iso : formatDay(iso, lang, { day: "numeric", month: "long", year: "numeric" }));
  const cardImages = [M("archives-1977", "portrait-annees-70"), M("scene", "studio-micro"), M("scene", "tour-de-david-live")];
  const upClose = [M("scene", "higia-zman-live"), M("scene", "sur-scene-chapeau"), M("scene", "tzama-5781"), M("scene", "melech-hamashiach-live"), M("scene", "studio-gam-ki-elech")];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang, d)).replace(/</g, "\\u003c") }} />

      <Hero d={d} lang={lang} />

      {/* Manifeste */}
      <section className="grain bg-night px-5 py-28 text-center md:py-40" aria-label={d.manifesto.eyebrow}>
        <Reveal className="mx-auto max-w-4xl">
          <Mark className="mx-auto h-6 w-16 text-gold" />
          <p className="eyebrow mt-10">{d.manifesto.eyebrow}</p>
          <p className="display mt-10 text-[clamp(1.75rem,3.6vw,2.9rem)] leading-[1.35] text-parchment rtl:leading-[1.5]">{d.manifesto.text}</p>
          <p className="mt-12 font-[family-name:var(--font-frank)] text-[1.35rem] text-gold" dir="rtl" lang="he">
            אהרון סיטבון
          </p>
        </Reveal>
      </section>

      {/* 001 · 002 · 003 */}
      <section className="bg-night-2 px-5 py-24 md:px-10 md:py-32" aria-label={d.cards.eyebrow}>
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow text-center">{d.cards.eyebrow}</p>
          <ul className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
            {d.cards.items.map((c, i) => (
              <Reveal as="li" key={c.n} delay={i * 0.12}>
                <Link href={`/${lang}#${c.href}`} className="group block">
                  <Photo src={cardImages[i]} d={d} sizes="(min-width: 768px) 31vw, 92vw" className="aspect-[4/5]" position={i === 0 ? "50% 30%" : undefined} />
                  <span className="num mt-7 block text-[0.85rem] text-gold">{c.n}</span>
                  <span className="display mt-3 block text-[2.2rem]">{c.title}</span>
                  <span className="mt-4 block leading-relaxed text-mist">{c.text}</span>
                  <span className="nav-link mt-6 inline-flex items-center gap-3 text-parchment transition-colors group-hover:text-gold">
                    {c.link} <ArrowIcon />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 1977 · 2026 */}
      <section className="relative overflow-hidden bg-night" aria-labelledby="span-title">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[88vh]">
            <Image src={M("archives-1977", "tele-1977")} alt={altOf(d, M("archives-1977", "tele-1977"))} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover grayscale-[35%] sepia-[20%]" />
            <span className="absolute start-5 bottom-5 eyebrow !text-parchment md:start-10 md:bottom-10">{d.span.then}</span>
          </div>
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[88vh]">
            <Image src={M("scene", "kotel-guitare")} alt={altOf(d, M("scene", "kotel-guitare"))} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[40%_30%]" />
            <span className="absolute end-5 bottom-5 eyebrow !text-parchment md:end-10 md:bottom-10">{d.span.now}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-night/55" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <Reveal className="max-w-3xl text-center">
            <p className="num text-[clamp(1rem,2vw,1.25rem)] text-gold" dir="ltr">
              {d.span.eyebrow}
            </p>
            <h2 id="span-title" className="display mt-6 text-[clamp(2.6rem,7vw,6rem)]">
              {d.span.title}
            </h2>
            <p className="mx-auto mt-8 max-w-xl leading-relaxed text-parchment/90">{d.span.text}</p>
            <div className="mt-10">
              <WatchButton id="1k-gm2mR9vg" title={d.french.tvTitle} label={d.span.watch} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* L'histoire */}
      <section id="story" className="light stone-bg px-5 py-28 md:px-10 md:py-40" aria-labelledby="story-title">
        <div className="mx-auto max-w-[1400px]">
          <Head id="story-title" eyebrow={d.story.eyebrow} title={d.story.title} intro={d.story.intro} />
          <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
            <div className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                <Photo src={M("portrait", "regard-jerusalem")} d={d} sizes="38vw" className="aspect-[4/5]" />
                <Photo src={M("archives-1977", "portrait-annees-70")} d={d} sizes="20vw" className="ms-auto aspect-[4/3] w-2/3" />
              </div>
            </div>
            <ol className="relative border-s border-gold-ink/30">
              {d.story.steps.map((s, i) => (
                <Reveal as="li" key={s.title} className="relative ps-10 pb-16 last:pb-0 md:ps-14" delay={0.05}>
                  <span className="absolute -start-[5px] top-2 h-[9px] w-[9px] rounded-full border border-gold-ink bg-stone" aria-hidden="true" />
                  <p className="eyebrow">
                    <span className="num me-3">{String(i + 1).padStart(2, "0")}</span>
                    {s.year}
                  </p>
                  <h3 className="display mt-4 text-[clamp(1.9rem,3vw,2.5rem)]">{s.title}</h3>
                  <p className="lead mt-4 max-w-xl">{s.text}</p>
                  {i === 5 && <Photo src={M("scene", "ruelle-guitare")} d={d} sizes="(min-width: 1024px) 50vw, 90vw" className="mt-10 aspect-[16/10] lg:hidden" />}
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* La musique */}
      <section id="music" className="grain bg-night px-5 py-28 md:px-10 md:py-40" aria-labelledby="music-title">
        <div className="relative mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <Head id="music-title" eyebrow={d.music.eyebrow} title={d.music.title} intro={d.music.intro} />
            <Reveal>
              <ListenButton label={d.hero.listen} />
            </Reveal>
          </div>
          <Discography />
        </div>
      </section>

      {/* Clips */}
      <section id="clips" className="bg-night-2 px-5 py-28 md:px-10 md:py-40" aria-labelledby="clips-title">
        <div className="mx-auto max-w-[1400px]">
          <Head id="clips-title" eyebrow={d.clips.eyebrow} title={d.clips.title} intro={d.clips.intro} />
          <Clips />
        </div>
      </section>

      {/* Concerts */}
      <section id="concerts" className="grain bg-night px-5 py-28 md:px-10 md:py-40" aria-labelledby="concerts-title">
        <div className="relative mx-auto max-w-[1400px]">
          <Head id="concerts-title" eyebrow={d.concerts.eyebrow} title={d.concerts.title} />
          <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <h3 className="eyebrow border-b border-line-dark pb-4">{d.concerts.upcoming}</h3>
              {concerts.upcoming.length === 0 ? (
                <div className="mt-8">
                  <p className="lead">{d.concerts.none}</p>
                  <Link href={`/${lang}#contact`} className="btn-line mt-8">
                    {d.concerts.invite}
                  </Link>
                </div>
              ) : (
                <ul className="mt-4">
                  {(concerts.upcoming as { date: string; city: Record<Locale, string>; venue: string; tickets?: string }[]).map((c) => (
                    <li key={c.date + c.venue} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line-dark py-5">
                      <span className="num text-gold">{formatDay(c.date, lang, { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="flex-1">
                        {c.city[lang]} · {c.venue}
                      </span>
                      {c.tickets && (
                        <a href={c.tickets} target="_blank" rel="noopener noreferrer" className="nav-link link-line">
                          {d.concerts.tickets}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="eyebrow border-b border-line-dark pb-4">{d.concerts.past}</h3>
              <ul>
                {concerts.past.map((p, i) => (
                  <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line-dark py-5">
                    <span className="num pt-1 text-gold">{p.year}</span>
                    <span>
                      <span className="block text-parchment">{p.place[lang]}</span>
                      <span className="mt-1 block text-[0.9375rem] leading-relaxed text-mist">{p.text[lang]}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Up close : la scène */}
          <ul className="mt-24 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {upClose.map((src, i) => (
              <Reveal as="li" key={src} delay={(i % 3) * 0.1} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
                <Photo src={src} d={d} sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className={i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-square"} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Les années françaises */}
      <section id="french" className="light bg-parchment px-5 py-28 md:px-10 md:py-40" aria-labelledby="french-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
            <div>
              <Head id="french-title" eyebrow={d.french.eyebrow} title={d.french.title} intro={d.french.text} />
              <Reveal className="mt-14">
                <h3 className="eyebrow">{d.french.names}</h3>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3" lang="fr" dir="ltr">
                  {d.french.namesList.map((n) => (
                    <li key={n} className="display text-[clamp(1.6rem,3vw,2.2rem)] italic">
                      {n}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="mt-16">
                <h3 className="eyebrow border-b border-line pb-4">{d.french.records}</h3>
                <ul>
                  {archives.singles.map((s) => (
                    <li key={s.ref} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[4rem_1fr_auto]">
                      <span className="num pt-1 text-gold-ink">{s.year}</span>
                      <span dir="ltr" lang="fr" className="text-start rtl:text-end">
                        <span className="block font-[family-name:var(--font-cormorant)] text-[1.35rem] italic">
                          {s.a}
                          {s.b && <span className="text-muted"> / {s.b}</span>}
                        </span>
                        <span className="mt-1 block text-[0.875rem] text-muted">
                          {s.artist}
                          {s.credit && <> · {s.credit}</>}
                        </span>
                      </span>
                      <span className="col-start-2 text-[0.8125rem] text-muted sm:col-start-3 sm:text-end" dir="ltr">
                        {s.label} · {s.ref}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.8125rem] text-muted">{d.french.source}</p>
              </Reveal>
            </div>
            <div className="space-y-12">
              <Reveal>
                <Photo src={M("archives-1977", "portrait-annees-70")} d={d} sizes="(min-width: 1024px) 38vw, 92vw" className="aspect-[4/3]" />
              </Reveal>
              <Reveal className="border-t border-line pt-8">
                <h3 className="display text-[1.9rem]" lang="fr">
                  {d.french.lahayeTitle}
                </h3>
                <p className="lead mt-3">{d.french.lahayeText}</p>
              </Reveal>
              <Reveal className="border-t border-line pt-8">
                <h3 className="display text-[1.9rem]">{d.french.tvTitle}</h3>
                <p className="lead mt-3">{d.french.tvText}</p>
                <WatchButton id="1k-gm2mR9vg" title={d.french.tvTitle} label={d.span.watch} className="btn-line mt-6" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* En famille */}
      <section className="light stone-bg px-5 py-28 md:px-10 md:py-36" aria-labelledby="family-title">
        <div className="mx-auto max-w-[1400px]">
          <Head id="family-title" eyebrow={d.family.eyebrow} title={d.family.title} intro={d.family.text} center />
          <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
            {(
              [
                ["achake-lo-david", "29VD_iylD44", d.family.david],
                ["modeh-ani-petit-fils", "w67jhBVqoz0", d.family.grandson],
                ["ani-maamin-enfants", "oXid2ifaAmI", d.family.children],
              ] as const
            ).map(([name, id, caption], i) => (
              <Reveal as="li" key={name} delay={i * 0.1}>
                <Photo src={M("famille", name)} d={d} sizes="(min-width: 768px) 31vw, 92vw" className="aspect-[4/3]" />
                <p className="mt-5 text-[1.05rem]">{caption}</p>
                <WatchButton id={id} title={caption} label={d.clips.play} className="nav-link link-line mt-3 inline-flex items-center gap-2 text-gold-ink" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Presse */}
      <section id="press" className="light bg-parchment px-5 py-28 md:px-10 md:py-40" aria-labelledby="press-title">
        <div className="mx-auto max-w-[1100px]">
          <Head id="press-title" eyebrow={d.press.eyebrow} title={d.press.title} />
          <ul className="mt-14 border-t border-line">
            {press.map((p) => (
              <Reveal as="li" key={p.url} className="border-b border-line">
                <a href={p.url} target="_blank" rel="noopener noreferrer" hrefLang={p.lang} className="group grid gap-2 py-7 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-8">
                  <span>
                    <span className="block font-[family-name:var(--font-cormorant)] text-[1.35rem] tracking-wide" dir="ltr">
                      {p.media}
                    </span>
                    <span className="num block text-[0.75rem] text-gold-ink">{nf(p.date)}</span>
                  </span>
                  <span>
                    {p.title && (
                      <span className="block text-[1.05rem] text-ink" lang={p.lang} dir="auto">
                        {p.title}
                      </span>
                    )}
                    <span className={`block leading-relaxed ${p.title ? "mt-1 text-[0.9375rem] text-muted" : "text-[1.05rem] text-ink"}`}>{p.summary[lang]}</span>
                  </span>
                  <span className="nav-link inline-flex items-center gap-2 text-gold-ink transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    {d.press.read} <ArrowIcon />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Messages du public — À REMPLIR avec de vrais messages, avec leur accord (data/messages à créer). Aucun avis inventé. */}
      <section className="light bg-parchment px-5 pb-28 md:px-10 md:pb-36" aria-labelledby="voices-title">
        <Reveal className="mx-auto max-w-3xl border border-line px-8 py-14 text-center md:px-16">
          <p className="eyebrow">{d.voices.eyebrow}</p>
          <h2 id="voices-title" className="display mt-5 text-[clamp(2rem,4vw,2.8rem)]">
            {d.voices.title}
          </h2>
          <p className="lead mx-auto mt-5 max-w-lg">{d.voices.text}</p>
        </Reveal>
      </section>

      {/* Réservation */}
      <section id="contact" className="light stone-bg relative overflow-hidden px-5 py-28 md:px-10 md:py-40" aria-labelledby="contact-title">
        <SkylineRule className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-gold-ink/15" />
        <div className="relative mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div>
            <Head id="contact-title" eyebrow={d.booking.eyebrow} title={d.booking.title} intro={d.booking.intro} />
            <Reveal className="mt-12 hidden lg:block">
              <Photo src={M("scene", "kotel-adon-olam")} d={d} sizes="36vw" className="aspect-[4/5]" />
            </Reveal>
          </div>
          <Reveal>
            <BookingForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

export const dynamic = "force-static";
