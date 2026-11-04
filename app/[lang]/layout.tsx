import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import site from "@/data/site.json";
import { dirOf, getDict, isLocale, locales, ogLocale } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { PlayerProvider } from "@/components/Player";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Polices servies en local (app/fonts) : aucun appel à Google Fonts, ni au build ni à l'affichage.
const playfair = localFont({
  src: [
    { path: "../fonts/playfair-display-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/playfair-display-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/playfair-display-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/playfair-display-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: false,
});
const inter = localFont({
  src: [
    { path: "../fonts/inter-latin-300-normal.woff2", weight: "300" },
    { path: "../fonts/inter-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/inter-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
});
const assistant = localFont({
  src: [
    { path: "../fonts/assistant-hebrew-300-normal.woff2", weight: "300" },
    { path: "../fonts/assistant-hebrew-400-normal.woff2", weight: "400" },
    { path: "../fonts/assistant-hebrew-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-assistant",
  display: "swap",
  adjustFontFallback: false,
});
const frank = localFont({
  src: [
    { path: "../fonts/frank-ruhl-libre-hebrew-300-normal.woff2", weight: "300" },
    { path: "../fonts/frank-ruhl-libre-hebrew-400-normal.woff2", weight: "400" },
  ],
  variable: "--font-frank",
  display: "swap",
  adjustFontFallback: false,
});

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return {
    metadataBase: new URL(site.url),
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), "x-default": "/he" },
    },
    openGraph: {
      type: "profile",
      url: `/${lang}`,
      siteName: "Aharon Sitbon · אהרון סיטבון",
      title: d.meta.title,
      description: d.meta.description,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: ["/og.jpg"] },
    formatDetection: { telephone: false },
    authors: [{ name: "Aharon Sitbon" }],
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export const viewport: Viewport = { themeColor: "#fbf8f2", width: "device-width", initialScale: 1, colorScheme: "light" };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

const introScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("sitbon-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${playfair.variable} ${inter.variable} ${assistant.variable} ${frank.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Providers lang={lang} d={d}>
          <PlayerProvider>
            <Intro skipLabel={d.intro.skip} tagline={d.intro.tagline} />
            <SmoothScroll />
            <Header />
            <main id="main">{children}</main>
            <Footer lang={lang} d={d} />
            <WhatsAppFloat label={d.whatsapp.float} message={d.whatsapp.hello} />
          </PlayerProvider>
        </Providers>
      </body>
    </html>
  );
}
