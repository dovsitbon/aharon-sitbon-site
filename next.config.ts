import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSS (≈ 10 Ko) inliné dans le HTML : supprime la requête bloquante avant le premier rendu
  experimental: { inlineCss: true },
  // L'ancienne page « Prestations » est remplacée par « Aujourd'hui » (il ne cherche pas de prestations pour le moment)
  async redirects() {
    return [{ source: "/:lang(he|fr|en|es)/services", destination: "/:lang/today", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80, 85],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920],
    minimumCacheTTL: 2678400,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
