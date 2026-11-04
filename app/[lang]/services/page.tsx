import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { href } from "@/lib/routes";
import { M, Photo } from "@/lib/ui";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/services", d.pages.services.title, d.pages.services.intro);
}

const FORMULA_PHOTO: Record<string, string> = {
  band: M("scene", "higia-zman-live"),
  guitar: M("scene", "ruelle-guitare"),
  david: M("famille", "achake-lo-david"),
  zoom: M("scene", "studio-gam-ki-elech"),
};

export default async function Services({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.services;
  const s = d.services;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "tour-de-david-live")}>
        <Link href={href(lang, "contact")} className="btn">
          {s.cta}
        </Link>
      </PageHero>

      {/* Les formules */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="formulas">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="formulas" eyebrow={s.formulasEyebrow} title={s.formulasTitle} />
          </Reveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {s.formulas.map((f, i) => (
              <Reveal as="li" key={f.id} delay={(i % 2) * 0.1} className="card group flex flex-col overflow-hidden sm:flex-row">
                <Photo src={FORMULA_PHOTO[f.id]} d={d} sizes="(min-width: 768px) 20vw, 92vw" className="aspect-[4/3] shrink-0 sm:aspect-auto sm:w-[42%]" />
                <div className="flex flex-1 flex-col p-7">
                  <span className="num text-[0.95rem] text-terra">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-2 text-[1.9rem]">{f.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{f.text}</p>
                  <p className="mt-auto pt-5 text-[0.875rem] text-blue">
                    <span className="me-2 inline-block h-1.5 w-1.5 rounded-full bg-terra align-middle" aria-hidden="true" />
                    {f.ideal}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Les occasions */}
      <section className="dark grain px-5 py-24 md:px-10 md:py-32" aria-labelledby="occasions">
        <div className="relative mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="occasions" eyebrow={s.occasionsEyebrow} title={s.occasionsTitle} />
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] bg-line-blue sm:grid-cols-2 lg:grid-cols-3">
            {s.occasions.map((o, i) => (
              <Reveal as="li" key={o.title} delay={(i % 3) * 0.08} className="bg-blue-deep p-8">
                <span className="num text-sand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-3 text-[1.7rem]">{o.title}</h3>
                <p className="mt-3 leading-relaxed text-haze">{o.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Étapes */}
      <section className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="steps">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <SectionHead id="steps" eyebrow={s.stepsEyebrow} title={s.stepsTitle} center />
          </Reveal>
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {s.steps.map((st, i) => (
              <Reveal as="li" key={st.title} delay={i * 0.08} className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terra font-[family-name:var(--font-playfair)] text-[1.4rem] text-white">{i + 1}</span>
                {i < s.steps.length - 1 && <span className="absolute start-16 top-7 hidden h-px w-[calc(100%-4.5rem)] bg-line md:block" aria-hidden="true" />}
                <h3 className="display mt-6 text-[1.6rem]">{st.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{st.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand-soft px-5 py-24 md:px-10 md:py-32" aria-labelledby="faq">
        <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <Reveal>
            <SectionHead id="faq" eyebrow={s.faqEyebrow} title={s.faqTitle} />
            <Photo src={M("scene", "sur-scene-chapeau")} d={d} sizes="(min-width: 768px) 30vw, 90vw" className="arch mt-10 hidden aspect-[4/5] md:block" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card divide-y divide-line">
              {s.faq.map((f, i) => (
                <details key={f.q} className="group px-6 py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.1rem] font-medium text-blue [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-soft text-terra transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
            <Link href={href(lang, "contact")} className="btn mt-8">
              {s.cta}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
