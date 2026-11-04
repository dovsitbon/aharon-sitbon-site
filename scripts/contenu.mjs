// Génère CONTENU.md : tous les textes du site dans les 4 langues + la discographie, pour validation par l'artiste.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const L = ["he", "fr", "en", "es"];
const NAMES = { he: "עברית", fr: "Français", en: "English", es: "Español" };
const dicts = Object.fromEntries(await Promise.all(L.map(async (l) => [l, await read(`locales/${l}.json`)])));
const music = await read("data/music.json");
const clips = await read("data/clips.json");
const press = await read("data/press.json");
const concerts = await read("data/concerts.json");
const archives = await read("data/archives.json");

function flat(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flat(v, key, out);
    else out[key] = String(v);
  }
  return out;
}
const flats = Object.fromEntries(L.map((l) => [l, flat(dicts[l])]));
const cell = (s) => (s ?? "").replace(/\|/g, "\|").replace(/\n/g, " ");

let md = `# CONTENU – site officiel d'Aharon Sitbon\n\nDocument de validation pour l'artiste : tous les textes du site dans les 4 langues, puis la discographie, les clips, les concerts et la presse.\nLes textes viennent de locales/*.json et les données de data/*.json : corriger là-bas, puis relancer \`npm run contenu\`.\n\n> Points à vérifier en priorité : lieu de naissance (Tunisie ou France), année d'installation en Israël (2012 ?), compositeur de la mélodie d'Adon Olam (Michel Fugain ?), label du premier disque (Barclay ou Versailles), listes exactes des titres des deux albums.\n\n`;

const sections = [...new Set(Object.keys(flats.fr).map((k) => k.split(".")[0]))];
for (const s of sections) {
  md += `## Textes · ${s}\n\n| clé | ${L.map((l) => NAMES[l]).join(" | ")} |\n|---|${L.map(() => "---").join("|")}|\n`;
  for (const k of Object.keys(flats.fr).filter((k) => k.split(".")[0] === s)) md += `| \`${k.slice(s.length + 1)}\` | ${L.map((l) => cell(flats[l][k])).join(" | ")} |\n`;
  md += "\n";
}

const byId = Object.fromEntries(music.tracks.map((t) => [t.id, t]));
const row = (t, n) => `| ${n} | ${t.he} | ${t.latin} | ${t.tr.fr} | ${t.tr.en} | ${t.tr.es} | ${t.year} | ${t.duration ?? "?"} | ${t.composer ?? "?"} | ${t.production ?? "?"} | ${t.youtubeId ? `[clip](https://youtu.be/${t.youtubeId})` : "—"} | ${t.audioFile ? "oui" : "à fournir"} | ${t.downloadable ? "oui" : "non"} |\n`;
const head = `| # | עברית | Translittération | FR | EN | ES | Année | Durée | Composition | Production | YouTube | MP3 | Téléchargeable |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
md += `## Discographie\n\n`;
for (const a of music.albums) {
  md += `### ${a.he} – ${a.latin} (${a.year})\n\n${a.tr.fr} · ${a.tr.en} · ${a.tr.es}\nProduction : ${a.producers} · Apple Music : ${a.appleMusic ?? "—"} · Spotify : ${a.spotify ?? "à trouver"}\n\n${head}`;
  a.tracks.forEach((id, i) => (md += row(byId[id], i + 1)));
  md += "\n";
}
md += `### Singles\n\n${head}`;
music.tracks.filter((t) => !t.album).sort((a, b) => b.year - a.year).forEach((t, i) => (md += row(t, i + 1)));
md += `\n### Archives françaises (45 tours)\n\n| Année | Artiste | Face A | Face B | Label | Réf. | Crédit |\n|---|---|---|---|---|---|---|\n`;
for (const s of archives.singles) md += `| ${s.year} | ${s.artist} | ${s.a} | ${s.b ?? "—"} | ${s.label} | ${s.ref} | ${s.credit ?? ""} |\n`;

md += `\n## Clips (${clips.length} vidéos de la chaîne)\n\n| # | ID | Catégorie | Titre | Note (FR) |\n|---|---|---|---|---|\n`;
clips.forEach((c, i) => (md += `| ${i + 1} | [${c.id}](https://youtu.be/${c.id}) | ${c.kind} | ${c.title?.fr ?? (c.track ? `${byId[c.track].he} – ${byId[c.track].latin}` : "")} | ${c.note?.fr ?? ""} |\n`));

md += `\n## Concerts passés\n\n| Année | Lieu | ${L.map((l) => NAMES[l]).join(" | ")} |\n|---|---|${L.map(() => "---").join("|")}|\n`;
for (const p of concerts.past) md += `| ${p.year} | ${p.place.fr} | ${L.map((l) => cell(p.text[l])).join(" | ")} |\n`;
md += `\nProchains concerts : ${concerts.upcoming.length ? concerts.upcoming.length : "aucun pour l'instant (data/concerts.json)"}\n`;

md += `\n## Presse\n\n| Média | Date | Titre | Résumé FR | Lien |\n|---|---|---|---|---|\n`;
for (const p of press) md += `| ${p.media} | ${p.date} | ${cell(p.title ?? "—")} | ${cell(p.summary.fr)} | ${p.url} |\n`;

await writeFile(path.join(ROOT, "CONTENU.md"), md);
console.log("CONTENU.md généré");
