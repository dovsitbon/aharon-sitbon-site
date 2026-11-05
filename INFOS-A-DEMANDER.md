# Infos à demander à Aharon Sitbon

Tout ce qui manque pour que le site soit définitif. Chaque point indique où le mettre une fois reçu.

## Son histoire
- [ ] **Date et lieu de naissance** : Tunisie (portrait d'Alliance, 2016) ou France (autres articles) ? → `locales/*.json`, `story.steps[0]`
- [ ] **Ville où il vit** aujourd'hui (Jérusalem selon Mostly Music et Torah-Box) et **année d'installation en Israël** (2012 selon Hidabroot ?)
- [ ] **Son histoire racontée par lui** (quelques paragraphes, ou un enregistrement) : on réécrira la frise avec ses mots
- [ ] **Ce qu'il accepte qu'on publie sur sa famille** : son fils David Sitbon (déjà cité), ses petits-enfants (aucun nom n'est affiché sans accord de la famille)
- [ ] **La mélodie d'Adon Olam** : est-elle bien de Michel Fugain (les articles écrivent « Fogan » ou « Fogen ») ?
- [ ] **Premier 45 tours** : chez Barclay (Alliance) ou chez Versailles (Encyclopédisque, 1971) ?
- [ ] Le nom de scène « Gilbert Mathis » cité par Alliance : vrai ou erreur ?
- [ ] La chanson que Michel Sardou lui aurait écrite : à confirmer avant de la mentionner (non publiée pour l'instant)

## Musique
- [ ] **Fichiers MP3 (ou WAV) de tous ses titres**, venant de lui ou de ses producteurs → à déposer dans `public/music/<album>/` puis `npm run music` (voir README). Dès qu'un MP3 est là, le bouton « Écouter » lit l'audio au lieu du clip YouTube.
- [ ] **Accord écrit des producteurs** (Eli Klein, Yitzy Berry, צבעים הפקות) pour le téléchargement gratuit → passer `downloadable` à `true` puis `npm run music` ; le `.zip` de l'album se prépare tout seul
- [ ] **Liste exacte des titres** des deux albums, dans l'ordre, avec **durées et crédits** (composition, paroles, arrangement) → `data/music.json`. Les listes actuelles sont reconstituées d'après la presse.
- [ ] **Pochettes HD** : « Shehecheyanu » (aucune pochette pour l'instant, une pochette typographique la remplace) et « Higia Zman Geulatchem » (actuellement tirée d'une maquette 3D de la vidéo) → `public/media/albums/`
- [ ] **Le troisième album** annoncé en 2023 : est-il sorti ? titre, date, titres
- [ ] **Ses 45 tours des années 1970** : pochettes scannées (pas de photos de sites de vente), titres complets, autres disques éventuels → `data/archives.json`
- [ ] Liens **Spotify** (artiste et albums), **Instagram**, et les **4 autres liens** affichés sur sa chaîne YouTube → `data/site.json`

## Photos et vidéos
- [ ] **Photos HD** : sur scène, portraits, en famille, archives des années 1970. Les visuels actuels sont des miniatures de ses clips (1280 × 720 au mieux), recadrées pour enlever les titres.
- [ ] **Vidéos sources des clips** (fichiers .mp4) pour une boucle silencieuse dans le hero → `public/media/hero/`
- [ ] **Logo** s'il en a un (sinon on garde le logo typographique créé pour le site, `components/Logo.tsx`)

## David Sitbon
- [ ] **Accord de David Sitbon** pour le bloc qui lui est consacré (page « Son histoire ») et une photo de lui en HD

## Concerts et contact
_Pour le moment, il ne cherche pas de nouvelles prestations : le site met en avant son histoire, sa musique et ses concerts passés._
- [ ] **Prochains concerts** : date, ville, salle, lien billetterie → `data/concerts.json` (génère aussi les données Google « Event »)
- [ ] **Dates déjà prises** (facultatif) → `data/dates.json`
- [x] Numéro de contact : +972 52-512-5282 (donné le 2026-11-05) → `data/site.json`
- [ ] S'il reprend un jour les concerts : prévenir, on rouvrira une page « Prestations » (les prochains concerts s'affichent déjà automatiquement depuis `data/concerts.json`)

## Public
- [ ] **Vrais messages du public**, avec l'accord de leurs auteurs (nom ou initiales, ville) → section « Messages du public ». Aucun avis n'a été inventé.

## Référencement Google
- [ ] **Google Search Console** : ajouter le site (idéalement avec son futur nom de domaine), puis soumettre https://aharon-sitbon.vercel.app/sitemap.xml
- [ ] Fiche **Google Knowledge Panel** : une fois le site indexé, revendiquer le panneau « Aharon Sitbon » depuis son compte Google
- [ ] Ajouter le lien du site dans la description de sa **chaîne YouTube** et sur sa page **Facebook** (les liens depuis ses comptes officiels aident Google à relier le site à lui)

## Nom de domaine
- [ ] Un domaine à son nom (par ex. aharonsitbon.com / .co.il) : à acheter puis brancher sur Vercel, et mettre à jour `url` dans `data/site.json`
