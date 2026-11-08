import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import audience from "@/data/audience.json";
import concerts from "@/data/concerts.json";
import press from "@/data/press.json";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";
import { href } from "@/lib/routes";
import { M } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { MessageCard, messages, videoOf, ytUrl } from "@/components/Audience";
import { ArrowIcon } from "@/components/icons";
import { WatchButton } from "@/components/Clips";

export async function generateMetadata({ params }: PageProps<"/[lang]/audience">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/audience", d.pages.audience.title, d.pages.audience.desc, "/og/events.jpg");
}

// Quatre scènes déjà racontées sur le site (data/concerts.json)
const STAGES = ["Paris", "Heichal Menorah", "Devant les remparts", "Tzama"];

export default async function Audience({ params }: PageProps<"/[lang]/audience">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.audience;
  const a = d.audience;
  const req = audience.request;
  const reqVideo = videoOf(req.video as keyof typeof audience.videos);
  const media = [...new Set(press.map((x) => x.media))];
  const stages = STAGES.map((k) => concerts.past.find((c) => c.place.fr.includes(k))).filter(Boolean) as { year: string; place: Record<Locale, string> }[];

  return (
    <>
      <JsonLd data={breadcrumbLd(lang, d, [[d.nav.audience, `/${lang}/audience`]])} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "higia-zman-live")} position="45% 35%" />

      {/* Chiffres */}
      <section className="border-b border-line px-5 md:px-10" aria-label={a.wallEyebrow}>
        <ul className="mx-auto grid max-w-[1320px] grid-cols-2 md:grid-cols-4">
          {a.stats.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.08} className={`py-10 md:py-12 ${i % 2 ? "ps-6" : "pe-6"} ${i > 0 ? "md:border-s md:border-line md:ps-8" : ""}`}>
              <p className="num text-[clamp(2rem,3.6vw,3rem)] leading-none text-blue">
                <bdi>{s.n}</bdi>
              </p>
              <p className="mt-3 text-[0.9375rem] leading-snug text-muted">{s.t}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mx-auto flex max-w-[1320px] flex-wrap gap-2 pb-10">
          {a.countries.map((c) => (
            <span key={c} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.875rem] text-blue">
              {c}
            </span>
          ))}
        </Reveal>
      </section>

      {/* Le mur des messages */}
      <section className="px-5 py-20 md:px-10 md:py-28" aria-labelledby="wall">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="wall" eyebrow={a.wallEyebrow} title={a.wallTitle} />
          </Reveal>
          <div className="mt-12 gap-6 md:columns-2 lg:columns-3">
            {messages.map((m) => (
              <MessageCard key={m.n} m={m} lang={lang} d={d} className="mb-6 break-inside-avoid" />
            ))}
          </div>
        </div>
      </section>

      {/* Traduit à la demande du public */}
      <section className="px-5 md:px-10" aria-labelledby="request">
        <Reveal className="dark grain mx-auto max-w-[1100px] overflow-hidden rounded-[2rem] p-7 md:p-12">
          <h2 id="request" className="display text-[clamp(2rem,4vw,2.9rem)]">
            {a.requestTitle}
          </h2>
          <p className="lead mt-5 max-w-2xl">{a.requestIntro}</p>
          <blockquote cite={ytUrl(reqVideo.id)} className="mt-6 border-s-2 border-sand ps-5">
            <p lang="es" dir="ltr" className="font-[family-name:var(--font-playfair)] text-[1.35rem] leading-relaxed text-paper italic">
              {req.text}
            </p>
            {lang !== "es" && (
              <p className="mt-3 text-[0.9375rem] text-haze">
                <span className="me-1 text-[0.75rem] font-medium tracking-wide text-sand uppercase rtl:tracking-normal">{a.translation}{lang === "fr" ? " :" : ":"}</span>
                {req.tr[lang as "he" | "fr" | "en"]}
              </p>
            )}
            <footer className="mt-3 text-[0.875rem] text-haze">
              {req.author} ·{" "}
              <a href={ytUrl(reqVideo.id)} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-paper hover:underline">
                {reqVideo.title[lang]} · {a.source}
              </a>
            </footer>
          </blockquote>
          <p className="lead mt-6 max-w-2xl">{a.requestOutro}</p>
          <WatchButton id="Pi8NCkgmL8I" title="Rey Mesías · Melech HaMashiach" label={a.requestButton} className="btn mt-8" />
        </Reveal>
      </section>

      {/* Ils ont parlé de lui · Sur scène */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="display text-[clamp(1.9rem,3.4vw,2.6rem)]">{a.pressTitle}</h2>
            <ul className="mt-6 flex flex-wrap gap-2" dir="ltr">
              {media.map((m) => (
                <li key={m} className="rounded-full border border-line bg-white px-4 py-2 font-[family-name:var(--font-playfair)] text-[1rem] text-blue italic">
                  {m}
                </li>
              ))}
            </ul>
            <Link href={href(lang, "press")} className="link-arrow mt-6">
              {a.pressLink} <ArrowIcon />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[clamp(1.9rem,3.4vw,2.6rem)]">{a.stageTitle}</h2>
            <ul className="card mt-6 divide-y divide-line">
              {stages.map((s) => (
                <li key={s.place.fr} className="flex items-baseline gap-4 px-5 py-4">
                  <span className="num w-14 shrink-0 text-[1.15rem] text-terra">{s.year}</span>
                  <span className="text-blue">{s.place[lang]}</span>
                </li>
              ))}
            </ul>
            <Link href={href(lang, "events")} className="link-arrow mt-6">
              {a.stageLink} <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Note */}
      <section className="px-5 pb-16 md:px-10">
        <p className="mx-auto max-w-[1320px] border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-muted">
          {a.footnote}{" "}
          <Link href={href(lang, "contact")} className="text-terra underline-offset-4 hover:underline">
            {a.footnoteLink}
          </Link>
        </p>
      </section>
    </>
  );
}
