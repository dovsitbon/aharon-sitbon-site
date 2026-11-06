"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale } from "@/components/providers";
import { CloseIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, ShuffleIcon, VolumeIcon } from "@/components/icons";
import { playable, trackImage, trOf, type Track } from "@/lib/music";

/**
 * Lecteur persistant (monté dans le layout : il continue quand on change de section ou de page).
 * - Titre avec MP3 (audioFile) : lecture HTML5 en streaming progressif (preload="none"), file d'attente,
 *   aléatoire, contrôles de l'écran verrouillé (Media Session API).
 * - Titre sans MP3 (cas actuel) : le clip officiel YouTube s'ouvre dans le lecteur, visible, piloté par postMessage
 *   (lecture/pause, progression, volume, enchaînement sur le titre suivant à la fin).
 */

type Api = {
  current: Track | null;
  playing: boolean;
  playTracks: (list: Track[], start?: number, opts?: { shuffle?: boolean }) => void;
  toggle: () => void;
};
const PlayerContext = createContext<Api | null>(null);
export function usePlayer() {
  const v = useContext(PlayerContext);
  if (!v) throw new Error("usePlayer hors de PlayerProvider");
  return v;
}

const YT_ORIGIN = "https://www.youtube-nocookie.com";
const fmt = (s: number) => (Number.isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
function shuffled<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { lang, d } = useLocale();
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isShuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const current = queue[index] ?? null;
  const mode: "audio" | "video" | null = current ? (current.audioFile ? "audio" : "video") : null;

  const yt = useCallback((func: string, args: unknown[] = []) => {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), YT_ORIGIN);
  }, []);

  const next = useCallback(() => {
    setTime(0);
    setDuration(0);
    setIndex((i) => (i + 1 < queue.length ? i + 1 : i));
  }, [queue.length]);
  const prev = useCallback(() => {
    if (time > 4) {
      if (mode === "audio" && audioRef.current) audioRef.current.currentTime = 0;
      else yt("seekTo", [0, true]);
      return;
    }
    setTime(0);
    setDuration(0);
    setIndex((i) => Math.max(0, i - 1));
  }, [time, mode, yt]);

  const playTracks = useCallback((list: Track[], start = 0, opts: { shuffle?: boolean } = {}) => {
    const ok = list.filter(playable);
    if (!ok.length) return;
    const first = list[start] && playable(list[start]) ? list[start] : ok[0];
    let q = ok;
    if (opts.shuffle) q = [first, ...shuffled(ok.filter((t) => t !== first))];
    setShuffle(Boolean(opts.shuffle));
    setQueue(q);
    setIndex(Math.max(0, q.indexOf(first)));
    setTime(0);
    setDuration(0);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (!current) return;
    if (mode === "audio") {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) void a.play();
      else a.pause();
    } else {
      yt(playing ? "pauseVideo" : "playVideo");
      setPlaying(!playing);
    }
  }, [current, mode, playing, yt]);

  const toggleShuffle = () => {
    if (!current) return;
    const rest = queue.filter((t) => t !== current);
    if (!isShuffle) {
      setQueue([current, ...shuffled(rest)]);
      setIndex(0);
    }
    setShuffle(!isShuffle);
  };

  const close = () => {
    audioRef.current?.pause();
    setQueue([]);
    setPlaying(false);
  };

  // Audio : (re)charge la source et lance la lecture à chaque changement de titre
  useEffect(() => {
    const a = audioRef.current;
    if (mode !== "audio" || !a || !current?.audioFile) return;
    a.src = current.audioFile;
    a.volume = volume / 100;
    void a.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, mode]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
    if (mode === "video") yt("setVolume", [volume]);
  }, [volume, mode, yt]);

  // YouTube : écoute des événements du lecteur (progression, fin du clip)
  useEffect(() => {
    if (mode !== "video") return;
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data.event === "infoDelivery" && data.info && typeof data.info === "object") {
        const info = data.info as { currentTime?: number; duration?: number; playerState?: number };
        if (typeof info.currentTime === "number") setTime(info.currentTime);
        if (typeof info.duration === "number" && info.duration > 0) setDuration(info.duration);
        if (info.playerState === 1) setPlaying(true);
        if (info.playerState === 2) setPlaying(false);
        if (info.playerState === 0) next();
      }
      if (data.event === "onStateChange") {
        if (data.info === 1) setPlaying(true);
        if (data.info === 2) setPlaying(false);
        if (data.info === 0) next();
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [mode, next]);

  const onFrameLoad = () => {
    const w = frameRef.current?.contentWindow;
    if (!w) return;
    w.postMessage(JSON.stringify({ event: "listening", id: "sitbon-player", channel: "widget" }), YT_ORIGIN);
    yt("addEventListener", ["onStateChange"]);
    yt("setVolume", [volume]);
  };

  // Écran verrouillé du téléphone (Media Session API)
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${current.he} · ${current.latin}`,
      artist: "Aharon Sitbon · אהרון סיטבון",
      album: current.album ?? "Single",
      artwork: trackImage(current) ? [{ src: trackImage(current)!.src, sizes: trackImage(current)!.square ? "1500x1500" : "1280x720", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", toggle);
    navigator.mediaSession.setActionHandler("pause", toggle);
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("previoustrack", prev);
  }, [current, toggle, next, prev]);

  // Le bouton WhatsApp remonte au-dessus du lecteur
  useEffect(() => {
    document.documentElement.classList.toggle("player-on", Boolean(current));
  }, [current]);

  const seek = (t: number) => {
    setTime(t);
    if (mode === "audio" && audioRef.current) audioRef.current.currentTime = t;
    else yt("seekTo", [t, true]);
  };

  const api = useMemo(() => ({ current, playing, playTracks, toggle }), [current, playing, playTracks, toggle]);
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
        hidden
      />
      {current && (
        <section aria-label={d.player.label} className="fade-up fixed inset-x-0 bottom-0 z-40 bg-blue-deep/97 text-paper shadow-[0_-10px_40px_-20px_rgba(20,53,83,0.5)] backdrop-blur-md">
          {mode === "video" && current.youtubeId && (
            <div className="absolute start-3 bottom-full mb-3 w-[min(22rem,calc(100vw-6rem))] overflow-hidden bg-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] rounded-xl ring-1 ring-sand/40 md:start-6">
              <div className="flex items-center justify-between gap-2 bg-blue-deep px-3 py-1.5">
                <span className="truncate text-[0.75rem] text-haze">{d.player.video}</span>
              </div>
              <iframe
                key={current.id}
                ref={frameRef}
                onLoad={onFrameLoad}
                src={`${YT_ORIGIN}/embed/${current.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&hl=${lang}`}
                title={`${current.he} – ${current.latin}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          )}
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 md:gap-6 md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:basis-72">
              {trackImage(current) && (
                <Image src={trackImage(current)!.src} alt="" width={96} height={96} className="hidden h-11 w-11 shrink-0 rounded-md object-cover sm:block" style={{ objectPosition: `${current.focal ?? 60}% 30%` }} />
              )}
              <div className="min-w-0">
                <p className="truncate font-[family-name:var(--font-frank)] text-[1.05rem] leading-tight" lang="he" dir="rtl">
                  {current.he}
                </p>
                <p className="truncate text-[0.8125rem] text-haze">{trOf(current, lang)}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 md:gap-2" dir="ltr">
              <button type="button" onClick={toggleShuffle} aria-label={d.player.shuffle} aria-pressed={isShuffle} className={`hidden h-10 w-10 items-center justify-center transition-colors md:flex ${isShuffle ? "text-sand" : "text-haze hover:text-paper"}`}>
                <ShuffleIcon />
              </button>
              <button type="button" onClick={prev} aria-label={d.player.prev} className="flex h-10 w-10 items-center justify-center text-haze transition-colors hover:text-paper">
                <PrevIcon />
              </button>
              <button type="button" onClick={toggle} aria-label={playing ? d.player.pause : d.player.play} className="flex h-11 w-11 items-center justify-center rounded-full bg-terra text-white transition-colors hover:bg-terra-deep">
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button type="button" onClick={next} disabled={index >= queue.length - 1} aria-label={d.player.next} className="flex h-10 w-10 items-center justify-center text-haze transition-colors hover:text-paper disabled:opacity-30">
                <NextIcon />
              </button>
            </div>

            <div className="hidden flex-1 items-center gap-3 text-[0.75rem] text-haze tabular-nums lg:flex" dir="ltr">
              <span className="w-10 text-end">{fmt(time)}</span>
              <input
                type="range"
                className="range flex-1"
                min={0}
                max={duration || 1}
                step={1}
                value={Math.min(time, duration || 1)}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label={d.player.progress}
                aria-valuetext={`${fmt(time)} / ${fmt(duration)}`}
                style={{ "--p": `${pct}%` } as React.CSSProperties}
              />
              <span className="w-10">{fmt(duration)}</span>
            </div>

            <div className="hidden items-center gap-2 text-haze md:flex" dir="ltr">
              <VolumeIcon />
              <input type="range" className="range w-20" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label={d.player.volume} style={{ "--p": `${volume}%` } as React.CSSProperties} />
            </div>

            <button type="button" onClick={close} aria-label={d.player.close} className="flex h-10 w-10 shrink-0 items-center justify-center text-haze transition-colors hover:text-paper">
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="h-px bg-line-blue lg:hidden" aria-hidden="true">
            <div className="h-px bg-sand transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </section>
      )}
    </PlayerContext.Provider>
  );
}
