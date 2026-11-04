"use client";

import { usePlayer } from "@/components/Player";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { albums, albumTracks, singles, trackById } from "@/lib/music";

// File d'écoute « tout Aharon Sitbon » : sa vidéo la plus vue d'abord, puis les singles récents et les deux albums
const ALL = [trackById["odeh-hashem"], ...singles.filter((t) => t.id !== "odeh-hashem"), ...albums.flatMap(albumTracks)];

/** Lance la lecture : un titre précis (trackId), sinon toute la musique */
export function ListenButton({ label, className = "btn", trackId }: { label: string; className?: string; trackId?: string }) {
  const { current, playing, playTracks, toggle } = usePlayer();
  const isMine = trackId ? current?.id === trackId : Boolean(current);
  const start = () => {
    if (!trackId) return playTracks(ALL);
    const i = ALL.findIndex((t) => t.id === trackId);
    playTracks(ALL, Math.max(0, i));
  };
  return (
    <button type="button" className={className} onClick={() => (isMine ? toggle() : start())}>
      {isMine && playing ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
      {label}
    </button>
  );
}
