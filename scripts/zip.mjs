// Prépare au moment du build un .zip par album (public/audio/zips/<album>.zip),
// UNIQUEMENT si tous ses titres ont un MP3 (public/audio/...) et downloadable: true dans data/music.json.
// Tant que les producteurs (Eli Klein, Yitzy Berry, צבעים הפקות) n'ont pas donné leur accord écrit, downloadable reste false
// et aucun zip n'est créé : le bouton « Télécharger tout l'album » ne s'affiche pas.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { zipSync } from "fflate";

const ROOT = path.resolve(import.meta.dirname, "..");
const file = path.join(ROOT, "data/music.json");
const music = JSON.parse(await readFile(file, "utf8"));
const byId = Object.fromEntries(music.tracks.map((t) => [t.id, t]));
let changed = false;

for (const album of music.albums) {
  const tracks = album.tracks.map((id) => byId[id]);
  const ok = tracks.every((t) => t?.downloadable && t.audioFile && existsSync(path.join(ROOT, "public", t.audioFile)));
  const target = ok ? `/audio/zips/${album.id}.zip` : null;
  if (ok) {
    const files = {};
    for (const [i, t] of tracks.entries()) {
      const name = `${String(i + 1).padStart(2, "0")} - ${t.latin}${path.extname(t.audioFile)}`;
      files[`Aharon Sitbon - ${album.latin}/${name}`] = [new Uint8Array(await readFile(path.join(ROOT, "public", t.audioFile))), { level: 0 }];
    }
    await mkdir(path.join(ROOT, "public/audio/zips"), { recursive: true });
    await writeFile(path.join(ROOT, "public", target), zipSync(files));
    console.log(`zip prêt : ${target}`);
  }
  if (album.zip !== target) {
    album.zip = target;
    changed = true;
  }
}
if (changed) await writeFile(file, JSON.stringify(music, null, 2) + "\n");
console.log("zip : téléchargements", music.albums.some((a) => a.zip) ? "activés" : "désactivés (aucun album autorisé)");
