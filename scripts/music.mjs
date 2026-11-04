// Relie les MP3 déposés dans public/music/ aux titres de data/music.json, puis prépare les .zip.
//   npm run music
//
// 1. Déposer les fichiers (glisser-déposer) :
//      public/music/shehecheyanu/            → titres de l'album « Shehecheyanu »
//      public/music/higia-zman-geulatchem/   → titres de l'album « Higia Zman Geulatchem »
//      public/music/singles/                 → singles
// 2. npm run music : pour chaque MP3, on lit les tags ID3 (titre, durée, pochette) et on le relie au bon titre
//    par son nom de fichier ou son titre (« 03 - Horeni Hashem.mp3 », « horeni-hashem.mp3 », « הורני ה'.mp3 »… tout marche).
//    → audioFile et duration sont remplis ; le bouton « Écouter » passe en audio (plus en clip YouTube).
//    → si l'album n'a pas encore de pochette et que le MP3 en contient une, elle est extraite dans public/media/albums/.
// 3. Le téléchargement reste fermé tant que downloadable vaut false dans data/music.json (accord écrit des producteurs).
//    Passer downloadable à true, relancer npm run music : les .zip par album sont créés.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parseFile } from "music-metadata";

const ROOT = path.resolve(import.meta.dirname, "..");
const file = path.join(ROOT, "data/music.json");
const music = JSON.parse(await readFile(file, "utf8"));
const AUDIO = /\.(mp3|m4a|aac|ogg|wav|flac)$/i;

// Normalise pour comparer : minuscules, sans accents, sans ponctuation, sans numéro de piste
const norm = (s) =>
  String(s ?? "")
    .normalize("NFKD")
    .replace(/[֑-ׇ]/g, "") // signes de cantillation / voyelles hébraïques
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/^\s*\d{1,2}\s*[-._)]\s*/, "")
    .replace(/[׳'’"״`]/g, "")
    .replace(/[^a-z0-9א-ת]+/g, "");

const keys = (t) => [t.id, t.latin, t.he, t.tr?.fr, t.tr?.en, t.tr?.es].map(norm).filter(Boolean);
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;

let linked = 0;
const unknown = [];
for (const folder of ["shehecheyanu", "higia-zman-geulatchem", "singles"]) {
  const dir = path.join(ROOT, "public/music", folder);
  if (!existsSync(dir)) continue;
  const candidates = music.tracks.filter((t) => (folder === "singles" ? !t.album : t.album === folder));
  for (const f of (await readdir(dir)).filter((x) => AUDIO.test(x))) {
    const meta = await parseFile(path.join(dir, f)).catch(() => null);
    const names = [norm(f), norm(meta?.common?.title)].filter(Boolean);
    const t =
      candidates.find((c) => keys(c).some((k) => names.includes(k))) ??
      candidates.find((c) => keys(c).some((k) => names.some((n) => n.includes(k) || k.includes(n))));
    if (!t) {
      unknown.push(`${folder}/${f}${meta?.common?.title ? ` (tag : ${meta.common.title})` : ""}`);
      continue;
    }
    t.audioFile = `/music/${folder}/${encodeURIComponent(f).replace(/%2F/g, "/")}`;
    if (meta?.format?.duration) t.duration = fmt(meta.format.duration);
    const album = music.albums.find((a) => a.id === folder);
    const pic = meta?.common?.picture?.[0];
    if (album && !album.cover && pic) {
      await mkdir(path.join(ROOT, "public/media/albums"), { recursive: true });
      const out = `/media/albums/${album.id}${pic.format.includes("png") ? ".png" : ".jpg"}`;
      await writeFile(path.join(ROOT, "public", out), pic.data);
      album.cover = out;
      console.log(`pochette extraite : ${out}`);
    }
    linked++;
    console.log(`✓ ${folder}/${f} → ${t.he} · ${t.latin}${t.duration ? ` (${t.duration})` : ""}`);
  }
}

await writeFile(file, JSON.stringify(music, null, 2) + "\n");
console.log(`\n${linked} fichier(s) relié(s).`);
if (unknown.length) console.log(`À renommer (aucun titre reconnu) :\n  ${unknown.join("\n  ")}`);
execFileSync(process.execPath, [path.join(ROOT, "scripts/zip.mjs")], { stdio: "inherit" });
console.log("\nEnsuite : npm run media (si la pochette a changé), puis git add -A && git commit && git push → Vercel redéploie.");
