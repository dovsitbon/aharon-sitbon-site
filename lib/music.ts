import music from "@/data/music.json";
import clipsData from "@/data/clips.json";
import type { Locale } from "@/lib/locales";

type Tr = { fr: string; en: string; es: string };
export type Track = {
  id: string;
  he: string;
  latin: string;
  tr: Tr;
  album: string | null;
  year: number;
  duration: string | null;
  composer: string | null;
  lyrics: string | null;
  production: string | null;
  featuring?: string;
  youtubeId: string | null;
  audioFile: string | null;
  downloadable: boolean;
  /** Cadrage horizontal (%) de la miniature utilisée comme pochette carrée d'un single */
  focal?: number;
};
export type Album = {
  id: string;
  he: string;
  latin: string;
  tr: Tr;
  year: number;
  cover: string | null;
  coverClip: string;
  producers: string;
  appleMusic: string | null;
  spotify: string | null;
  zip: string | null;
  tracks: string[];
};
export type Clip = {
  id: string;
  kind: "official" | "live" | "interview" | "archive";
  track: string | null;
  views?: number;
  title?: Record<Locale, string>;
  note?: Record<Locale, string>;
};

export const tracks = music.tracks as Track[];
export const albums = music.albums as Album[];
export const clips = clipsData as Clip[];
export const trackById = Object.fromEntries(tracks.map((t) => [t.id, t])) as Record<string, Track>;
export const albumTracks = (a: Album) => a.tracks.map((id) => trackById[id]).filter(Boolean);
export const singles = tracks.filter((t) => !t.album).sort((a, b) => b.year - a.year);

/** Traduction du titre dans la langue du visiteur (en hébreu : la translittération). */
export const trOf = (t: { tr: Tr; latin: string }, lang: Locale) => (lang === "he" ? t.latin : t.tr[lang]);

/** Un titre est jouable s'il a un MP3, ou à défaut un clip officiel. */
export const playable = (t: Track) => Boolean(t.audioFile || t.youtubeId);

export const thumb = (youtubeId: string) => `/media/clips/${youtubeId}.jpg`;
