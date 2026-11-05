// Trie les visuels provisoires (miniatures YouTube officielles de la chaîne, assets/raw/) dans assets/<catégorie>/
// avec des noms lisibles, recadrés pour ne garder que l'image (sans titres incrustés ni badges « LIVE »),
// puis les prépare pour le web dans public/media/<catégorie>/. next/image sert ensuite des variantes AVIF/WebP.
//   npm run media
//
// REMPLACER PAR LES VRAIES PHOTOS : déposer la photo HD dans assets/<catégorie>/ sous le même nom,
// la référencer ici (ou garder le nom), relancer npm run media. Les composants ne connaissent que /media/<catégorie>/<nom>.jpg.
//
// Écartées comme photos : 01 (clip réalisé en IA), 03, 04, 05, 06 (décors générés ou trop de texte), 02, 07, 08, 09, 14, 17, 21, 24,
// 31 (titre incrusté sur le visage ou le décor), 22 (texte sur toute la hauteur). Elles restent visibles dans la grille des clips.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const raw = (n) => `raw/aharon-sitbon_${n}.jpg`;
// Miniatures 480 × 360 avec bandes noires : on garde la bande utile
const LB = { top: 0.125, bottom: 0.875 };

// [fichier source (dans assets/), catégorie, nom, recadrage facultatif en fractions {top, bottom, left, right}]
const PICKS = [
  [raw("12_TIetzheEf_U"), "hero", "guitare-nuit"],
  [raw("19_3ryPJH8kgdA"), "hero", "micro-nuit"],

  [raw("logo"), "portrait", "portrait-chaine"],
  [raw("36_ORAejqu-GIE"), "portrait", "regard-jerusalem", { left: 0.4 }],
  [raw("10_TYlFt7rxUtI"), "portrait", "guitare-lumiere", { right: 0.6 }],

  [raw("20_l_sfgBg4tT4"), "scene", "tour-de-david-live", { left: 0.2 }],
  [raw("16_8V6H6uSS3HY"), "scene", "melech-hamashiach-live", { left: 0.2 }],
  [raw("18_m3LhuFUDZqk"), "scene", "tzama-5781", { left: 0.06, right: 0.93, top: 0.06 }],
  [raw("25_bH4Fv2dTheE"), "scene", "sur-scene-chapeau", { left: 0.18 }],
  [raw("27_2v5zUsiY1Vs"), "scene", "higia-zman-live", { left: 0.24 }],
  [raw("26_Lrmd4Iylbrk"), "scene", "studio-micro"],
  [raw("35_ajWbyr3iZTk"), "scene", "studio-gam-ki-elech", { left: 0.42 }],
  [raw("11_MKTaVf_SHEw"), "scene", "interview-hamevaker"],
  [raw("29_p4rW6d7ezv0"), "scene", "desert-guitare"],
  [raw("30_6qX2yE2EYkY"), "scene", "kotel-guitare"],
  [raw("37_omm07ocRjxI"), "scene", "ruelle-guitare", { top: 0.02, bottom: 0.98 }],
  [raw("34_S1BnZXBVEMY"), "scene", "kotel-adon-olam", { left: 0.4 }],
  [raw("33_GV_SYRu0ylY"), "scene", "terrasse-jerusalem", { left: 0.03, right: 0.975, top: 0.03, bottom: 0.76 }],

  // Pochette « Higia Zman Geulatchem » photographiée en maquette 3D : provisoire, à remplacer par le fichier HD
  [raw("13_kmLBUAEwrLI"), "albums", "higia-zman-geulatchem", { left: 0.19, right: 0.64, top: 0.08, bottom: 0.88 }],

  [raw("15_UepVKsxy04o"), "archives-1977", "portrait-annees-70", LB],
  [raw("38_1k-gm2mR9vg"), "archives-1977", "tele-1977", { left: 0.18, right: 0.6, top: 0.18, bottom: 0.82 }],

  [raw("28_w67jhBVqoz0"), "famille", "modeh-ani-petit-fils"],
  [raw("23_29VD_iylD44"), "famille", "achake-lo-david", { bottom: 0.82 }],
  [raw("32_oXid2ifaAmI"), "famille", "ani-maamin-enfants"],
];

const sizes = {};
async function prepare(src, cat, name, crop, max) {
  const file = path.join(ROOT, "assets", src);
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  let pipe = sharp(file).rotate();
  if (crop) {
    const { width, height } = await sharp(file).metadata();
    const top = Math.round(height * (crop.top ?? 0));
    const left = Math.round(width * (crop.left ?? 0));
    pipe = pipe.extract({ left, top, width: Math.round(width * (crop.right ?? 1)) - left, height: Math.round(height * (crop.bottom ?? 1)) - top });
  }
  const buf = await pipe.resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  await writeFile(path.join(ROOT, "assets", cat, `${name}.jpg`), buf.data);
  await writeFile(path.join(ROOT, "public/media", cat, `${name}.jpg`), buf.data);
  sizes[`/media/${cat}/${name}.jpg`] = [buf.info.width, buf.info.height];
}

for (const [src, cat, name, crop] of PICKS) await prepare(src, cat, name, crop, 2000);

// Miniatures de toutes les vidéos de la chaîne (grille des clips, pochettes des singles), bandes noires retirées
const clips = JSON.parse(await readFile(path.join(ROOT, "data/clips.json"), "utf8"));
const { readdir } = await import("node:fs/promises");
const files = await readdir(path.join(ROOT, "assets/raw"));
for (const c of clips) {
  const f = files.find((x) => x.endsWith(`_${c.id}.jpg`));
  if (!f) continue;
  const { width } = await sharp(path.join(ROOT, "assets/raw", f)).metadata();
  await prepare(`raw/${f}`, "clips", c.id, width < 600 ? LB : undefined, 960);
}

// Diaporama de l'accueil : les plus belles photos de scène, agrandies en 1920 px (Lanczos) avec une légère accentuation.
// Les clips d'origine ne dépassent pas 720p : à remplacer par les vraies photos HD de l'artiste dès que possible.
const SLIDES = [
  ["scene/kotel-guitare", "kotel-guitare"],
  ["hero/guitare-nuit", "guitare-nuit"],
  ["scene/desert-guitare", "desert-guitare"],
  ["scene/tour-de-david-live", "tour-de-david-live"],
  ["scene/terrasse-jerusalem", "terrasse-jerusalem"],
  ["scene/higia-zman-live", "higia-zman-live"],
  ["hero/micro-nuit", "micro-nuit"],
  ["scene/studio-micro", "studio-micro"],
];
await mkdir(path.join(ROOT, "public/media/slides"), { recursive: true });
for (const [src, name] of SLIDES) {
  const info = await sharp(path.join(ROOT, "assets", `${src}.jpg`))
    .resize({ width: 1920, kernel: "lanczos3" })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.2 })
    .modulate({ saturation: 1.04 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media/slides", `${name}.jpg`));
  sizes[`/media/slides/${name}.jpg`] = [info.width, info.height];
}

// Images de partage (Open Graph) 1200 × 630, une par page
const OG = {
  story: ["scene/ruelle-guitare.jpg", "centre"],
  music: ["scene/studio-micro.jpg", "right"],
  videos: ["scene/tzama-5781.jpg", "centre"],
  today: ["scene/desert-guitare.jpg", "centre"],
  events: ["scene/higia-zman-live.jpg", "top"],
  press: ["scene/interview-hamevaker.jpg", "centre"],
  contact: ["scene/kotel-adon-olam.jpg", "top"],
  "album-shehecheyanu": ["scene/kotel-guitare.jpg", "left"],
};
await mkdir(path.join(ROOT, "public/og"), { recursive: true });
for (const [name, [src, position]] of Object.entries(OG)) {
  await sharp(path.join(ROOT, "assets", src))
    .resize(1200, 630, { fit: "cover", position, kernel: "lanczos3" })
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ROOT, "public/og", `${name}.jpg`));
}
// Album « Higia Zman Geulatchem » : la pochette centrée sur fond bleu tekhelet
const cover = await sharp(path.join(ROOT, "assets/albums/higia-zman-geulatchem.jpg")).resize(560, 560).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#143553" } })
  .composite([{ input: cover, top: 35, left: 320 }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og/album-higia-zman-geulatchem.jpg"));
// Icône Apple (écran d'accueil) à partir du favicon
await sharp(path.join(ROOT, "app/icon.svg"), { density: 400 }).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"));

// Image de partage (Open Graph) 1200 × 630 : guitare, la nuit
await sharp(path.join(ROOT, "assets", raw("12_TIetzheEf_U")))
  .resize(1200, 630, { fit: "cover", position: "right" })
  .modulate({ brightness: 0.92 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${Object.keys(sizes).length} images prêtes`);
