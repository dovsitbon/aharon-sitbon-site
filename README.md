# Site officiel d'Aharon Sitbon · אהרון סיטבון

Next.js 16 + Tailwind 4, 4 langues (hébreu par défaut, français, anglais, espagnol), hébergé sur Vercel.
Production : https://aharon-sitbon.vercel.app · chaque `git push` sur `main` redéploie automatiquement.

## Les pages

| Adresse | Contenu |
|---|---|
| `/he` `/fr` `/en` `/es` | Accueil : diaporama de photos, repères, histoire en bref, dernière sortie, albums, aujourd'hui, clips, concerts, presse |
| `/<langue>/story` | Son histoire : frise, 1977 · 2026, les années françaises, en famille, David Sitbon |
| `/<langue>/music` | Albums, singles, archives françaises (45 tours) |
| `/<langue>/music/shehecheyanu` · `/higia-zman-geulatchem` | Fiche album : titres, écoute, crédits, téléchargement (si autorisé) |
| `/<langue>/videos` | Les 38 vidéos de la chaîne, filtrables (clips, live, interviews, archives) |
| `/<langue>/today` | Aujourd'hui : ses dernières sorties, sa façon de travailler, sa mission, le suivre |
| `/<langue>/events` | Concerts passés (Olympia, Heichal Menorah, Tzama…), galerie ; les prochains concerts n'apparaissent que si `data/concerts.json` en contient |
| `/<langue>/press` | Articles de presse, messages du public |
| `/<langue>/contact` | Formulaire de contact (envoi sur WhatsApp, +972 52-512-5282) et contacts directs |

## Ajouter la musique (MP3) : la marche à suivre

Tant qu'il n'y a pas de MP3, le bouton « Écouter » ouvre le clip officiel YouTube dans le lecteur du site.
Quand l'artiste (ou ses producteurs) envoie les fichiers :

1. **Déposer les fichiers** (glisser-déposer dans l'explorateur) :
   - `public/music/shehecheyanu/` : les titres de l'album « Shehecheyanu »
   - `public/music/higia-zman-geulatchem/` : les titres de l'album « Higia Zman Geulatchem »
   - `public/music/singles/` : les singles

   Le nom importe peu : `03 - Horeni Hashem.mp3`, `horeni-hashem.mp3` ou un fichier dont le tag ID3 « titre » est « Horeni Hashem » sont reconnus (translittération, id, hébreu ou traduction).

2. **Lancer** :
   ```bash
   npm run music
   ```
   Le script lit les tags ID3 (titre, durée, pochette), relie chaque fichier au bon titre de `data/music.json`
   (`audioFile`, `duration`), extrait la pochette de l'album si elle manquait, et prépare les `.zip`.
   Les fichiers non reconnus sont listés : il suffit de les renommer et de relancer.

3. **Mettre en ligne** :
   ```bash
   git add -A && git commit -m "Ajout des MP3" && git push
   ```
   Vercel redéploie tout seul ; l'écoute passe en audio (lecture en continu, file d'attente, aléatoire, commandes sur l'écran verrouillé du téléphone).

### Téléchargement gratuit

Fermé par défaut : `downloadable: false` pour chaque titre de `data/music.json`.
**Ne l'ouvrir qu'avec l'accord écrit d'Eli Klein, Yitzy Berry et צבעים הפקות.** Ensuite : passer `downloadable` à `true`
pour les titres concernés, relancer `npm run music` : le bouton « Télécharger » apparaît sur chaque titre et
« Télécharger tout l'album (.zip) » sur la fiche album (le zip est aussi recréé à chaque build).

Ne jamais récupérer d'audio depuis YouTube ni depuis des sites de téléchargement.

## Autres mises à jour courantes

| À faire | Où |
|---|---|
| Textes (4 langues) | `locales/he.json`, `fr.json`, `en.json`, `es.json`, puis `npm run contenu` pour régénérer `CONTENU.md` |
| Prochains concerts | `data/concerts.json` → `upcoming` (génère aussi les données Google « Event ») |
| Dates déjà prises | `data/dates.json` |
| Presse | `data/press.json` |
| Liens, téléphone, WhatsApp | `data/site.json` |
| Diaporama de l'accueil | photos dans `public/media/slides/` (liste SLIDES de `scripts/media.mjs` et de `app/[lang]/page.tsx`) |
| Vraies photos HD | déposer dans `assets/<catégorie>/`, référencer dans `scripts/media.mjs`, puis `npm run media` |

## Développement

```bash
npm install
npm run dev
```

Polices servies en local (`app/fonts`) : Playfair Display + Inter (latin), Frank Ruhl Libre + Assistant (hébreu).
Charte « Lumière de Jérusalem » : blanc chaud `#FBF8F2`, sable `#EADCC2`, terre cuite `#B5552B`, bleu tekhelet `#1F4E79`, texte `#2A2420` (`app/globals.css`).
