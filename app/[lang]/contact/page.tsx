import { notFound } from "next/navigation";
import type { Metadata } from "next";
import site from "@/data/site.json";
import { getDict, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { waLink } from "@/lib/booking";
import { M, Photo } from "@/lib/ui";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, contactLd } from "@/lib/jsonld";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { GuestForm } from "@/components/GuestForm";
import { AppleMusicIcon, FacebookIcon, PhoneIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMetadata(lang, "/contact", d.pages.contact.title, d.pages.contact.desc, "/og/contact.jpg");
}

export default async function Contact({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const p = d.pages.contact;
  const c = d.contact;
  const row = "flex min-h-12 items-center gap-4 rounded-xl px-3 transition-colors hover:bg-sand-soft";

  return (
    <>
      <JsonLd data={[breadcrumbLd(lang, d, [[d.nav.contact, `/${lang}/contact`]]), contactLd(lang, d)]} />
      <PageHero lang={lang} d={d} eyebrow={p.eyebrow} h1={p.h1} intro={p.intro} image={M("scene", "kotel-adon-olam")} />

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-14">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1} className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow plain">{c.direct}</p>
              <ul className="mt-4 space-y-1">
                <li>
                  <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className={row}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-terra text-white">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-blue">{c.whatsapp}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${site.phoneIntl.replace(/[\s-]/g, "")}`} className={row}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-soft text-blue">
                      <PhoneIcon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-medium text-blue">{c.call}</span>
                      <span className="block text-[0.9rem] text-muted" dir="ltr">
                        {lang === "he" ? site.phone : site.phoneIntl}
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-[0.875rem] text-muted">{c.note}</p>
            </div>
            <div className="card p-6">
              <p className="eyebrow plain">{c.follow}</p>
              <ul className="mt-4 space-y-1 text-blue">
                <li>
                  <a href={site.youtube} target="_blank" rel="noopener noreferrer" className={row}>
                    <YouTubeIcon /> YouTube
                  </a>
                </li>
                <li>
                  <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={row}>
                    <FacebookIcon /> Facebook
                  </a>
                </li>
                <li>
                  <a href={site.appleMusic} target="_blank" rel="noopener noreferrer" className={row}>
                    <AppleMusicIcon /> Apple Music
                  </a>
                </li>
              </ul>
            </div>
            <Photo src={M("famille", "modeh-ani-petit-fils")} d={d} sizes="(min-width: 1024px) 28vw, 92vw" className="hidden aspect-[4/3] rounded-[1.25rem] lg:block" />
          </Reveal>
        </div>
      </section>

      {/* Option : un moment avec lui (houppa, soirée, gala), en complément de l'orchestre — pas une soirée d'ambiance */}
      <section id="moment" className="scroll-mt-24 bg-sand-soft px-5 py-20 md:px-10 md:py-24" aria-labelledby="moment-title">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{d.pages.guest.eyebrow}</p>
            <h2 id="moment-title" className="display mt-5 text-[clamp(2.2rem,4.6vw,3.4rem)]" dangerouslySetInnerHTML={{ __html: d.pages.guest.h1 }} />
            <p className="lead mt-6">{d.pages.guest.intro}</p>
            <p className="mt-6 flex items-start gap-3 rounded-[1rem] border border-terra/30 bg-paper p-5 text-blue">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-terra" aria-hidden="true" />
              {d.guest.note}
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
            <Reveal>
              <ul className="grid gap-4">
                {d.guest.formats.map((f, i) => (
                  <li key={f.title} className="card flex gap-4 p-5">
                    <span className="num text-[1.1rem] text-terra">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-[1.1rem] font-medium text-blue">{f.title}</span>
                      <span className="mt-1 block leading-relaxed text-muted">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <GuestForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
