"use client";

import { usePlayer } from "@/components/Player";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { albums, albumTracks, singles, trackById } from "@/lib/music";

// File d'écoute « tout Aharon Sitbon » : sa vidéo la plus vue d'abord, puis les singles récents et les deux albums
const ALL = [trackById["odeh-hashem"], ...singles.filter((t) => t.id !== "odeh-hashem"), ...albums.flatMap(albumTracks)];

export function ListenButton({ label, className = "btn-solid" }: { label: string; className?: string }) {
  const { current, playing, playTracks, toggle } = usePlayer();
  return (
    <button type="button" className={className} onClick={() => (current ? toggle() : playTracks(ALL))}>
      {current && playing ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
      {label}
    </button>
  );
}
