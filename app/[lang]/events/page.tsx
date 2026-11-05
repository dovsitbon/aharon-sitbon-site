import { notFound } from "next/navigation";
import type { Metadata } from "next";
import concerts from "@/data/concerts.json";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { formatDay } from "@/lib/booking";
import { M, Photo } from "@/lib/ui";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { WatchButton } from "@/components/Clips";

export async function generateMetadata({ params }: PageProps<"/[lang]/events">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/events", d.pages.events.title, d.pages.events.intro);
}

type Upcoming = { date: string; time?: string; city: Record<Locale, string>; venue: string; country: string; tickets?: string };
type Past = { year: string; video?: string; place: Record<Locale, string>; text: Record<Locale, string> };

export default async function Events({ params }: PageProps<"/[lang]/events">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.events;
  const upcoming = concerts.upcoming as Upcoming[];
  const past = concerts.past as Past[];
  const gallery = [M("scene", "higia-zman-live"), M("scene", "sur-scene-chapeau"), M("scene", "tzama-5781"), M("scene", "melech-hamashiach-live"), M("scene", "tour-de-david-live")];

  return (
    <>
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "tzama-5781")} />

      {/* Prochains concerts : affichés seulement si data/concerts.json en contient */}
      {upcoming.length > 0 && (
        <section className="px-5 py-24 md:px-10 md:py-28" aria-labelledby="upcoming">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <SectionHead id="upcoming" eyebrow={d.concerts.eyebrow} title={d.concerts.upcoming} />
          </Reveal>
          {(
            <ul className="card mt-10 divide-y divide-line">
              {upcoming.map((c) => (
                <li key={c.date + c.venue} className="flex flex-wrap items-center gap-6 px-6 py-6 md:px-8">
                  <span className="w-28 text-center">
                    <span className="num block text-[2.4rem] leading-none text-terra">{formatDay(c.date, lang, { day: "numeric" })}</span>
                    <span className="mt-1 block text-[0.875rem] text-muted uppercase">{formatDay(c.date, lang, { month: "short", year: "numeric" })}</span>
                  </span>
                  <span className="flex-1">
                    <span className="block text-[1.2rem] font-medium text-blue">{c.venue}</span>
                    <span className="block text-muted">
                      {c.city[lang]}
                      {c.time && <> · {c.time}</>}
                    </span>
                  </span>
                  {c.tickets && (
                    <a href={c.tickets} target="_blank" rel="noopener noreferrer" className="btn">
                      {d.concerts.tickets}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      )}

      {/* Ils l'ont reçu */}
      <section className="bg-sand-soft px-5 py-24 md:px-10 md:py-28" aria-labelledby="past">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <SectionHead id="past" eyebrow={d.concerts.eyebrow} title={d.concerts.past} intro={d.home.eventsText} />
          </Reveal>
          <ul className="mt-12 space-y-4">
            {past.map((e, i) => (
              <Reveal as="li" key={i} delay={0.04} className="card grid gap-4 p-6 sm:grid-cols-[6rem_1fr_auto] sm:items-center md:p-8">
                <span className="num text-[2rem] leading-none text-terra">{e.year}</span>
                <span>
                  <span className="block text-[1.15rem] font-medium text-blue">{e.place[lang]}</span>
                  <span className="mt-1 block leading-relaxed text-muted">{e.text[lang]}</span>
                </span>
                {e.video && <WatchButton id={e.video} title={e.place[lang]} label={d.events.watch} className="btn-ghost !min-h-11 !px-5 text-blue" />}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Galerie */}
      <section className="px-5 py-24 md:px-10 md:py-28" aria-labelledby="gallery">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="gallery" eyebrow={d.concerts.eyebrow} title={d.events.gallery} />
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((src, i) => (
              <Reveal as="li" key={src} delay={(i % 3) * 0.08} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
                <Photo src={src} d={d} sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className={`rounded-[1.25rem] ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-square"}`} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
