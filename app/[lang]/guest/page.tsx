import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";
import { M, Photo } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { GuestForm } from "@/components/GuestForm";

// Page volontairement discrète : absente du menu principal, reliée depuis le pied de page, Contact et Concerts.
export async function generateMetadata({ params }: PageProps<"/[lang]/guest">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/guest", d.pages.guest.title, d.pages.guest.desc, "/og/events.jpg");
}

const PHOTOS = [M("scene", "kotel-adon-olam"), M("scene", "studio-gam-ki-elech"), M("scene", "sur-scene-chapeau"), M("famille", "achake-lo-david")];

export default async function Guest({ params }: PageProps<"/[lang]/guest">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.guest;
  const g = d.guest;

  return (
    <>
      <JsonLd data={breadcrumbLd(lang, d, [[d.nav.guest, `/${lang}/guest`]])} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "tour-de-david-live")} />

      <section className="px-5 pt-16 md:px-10">
        <Reveal className="mx-auto flex max-w-[1100px] items-start gap-4 rounded-[1.25rem] border border-terra/30 bg-sand-soft p-6 md:items-center md:p-7">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-terra md:mt-0" aria-hidden="true" />
          <p className="text-[1.05rem] leading-relaxed text-blue">{g.note}</p>
        </Reveal>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-24" aria-labelledby="moments">
        <div className="mx-auto max-w-[1100px]">
          <Reveal>
            <SectionHead id="moments" eyebrow={g.formatsEyebrow} title={g.formatsTitle} />
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {g.formats.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 2) * 0.08} className="card overflow-hidden">
                <Photo src={PHOTOS[i]} d={d} sizes="(min-width: 640px) 45vw, 92vw" className="aspect-[16/9]" />
                <div className="p-7">
                  <h3 className="display text-[1.7rem]">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sand-soft px-5 py-20 md:px-10 md:py-24" aria-labelledby="request">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <Reveal>
            <h2 id="request" className="display text-[clamp(2rem,4vw,2.8rem)]">
              {g.stepsTitle}
            </h2>
            <ol className="mt-8 space-y-6">
              {g.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terra font-[family-name:var(--font-playfair)] text-white">{i + 1}</span>
                  <p className="pt-1.5 leading-relaxed text-ink">{s}</p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.1}>
            <GuestForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
