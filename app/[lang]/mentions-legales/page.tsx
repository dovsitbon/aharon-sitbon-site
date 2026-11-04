import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, locales } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return {
    title: d.meta.legalTitle,
    alternates: { canonical: `/${lang}/mentions-legales`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/mentions-legales`])) },
    robots: { index: false, follow: true },
  };
}

export default async function Legal({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  return (
    <section className="light bg-parchment px-5 pt-40 pb-28 md:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[clamp(2.4rem,5vw,3.6rem)]">{d.legal.title}</h1>
        <div className="mt-10 space-y-5">
          {d.legal.body.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
        </div>
        <Link href={`/${lang}`} className="btn-line mt-12">
          {d.legal.back}
        </Link>
      </div>
    </section>
  );
}
