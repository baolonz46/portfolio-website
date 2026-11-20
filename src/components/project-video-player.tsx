"use client";

import { useEffect, useRef, useState, useCallback } from "react";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ProjectVideoPlayer({
  src,
  isVertical,
}: {
  src: string;
  isVertical: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gestione coordinamento audio: un solo video riproduce alla volta
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoPlay = (e: Event) => {
      const customEvent = e as CustomEvent<HTMLVideoElement>;
      if (customEvent.detail && customEvent.detail !== video) {
        video.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("pauland-video-play", handleVideoPlay);

    return () => {
      window.removeEventListener("pauland-video-play", handleVideoPlay);
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    };
  }, [src]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Mostra e nascondi controlli su inattività
  const triggerControls = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // Quando parte, silenzia e ferma sempre qualsiasi altro video
      window.dispatchEvent(
        new CustomEvent("pauland-video-play", { detail: video })
      );
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
    triggerControls();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      // Se attiviamo l'audio, avvisa gli altri video di fermarsi
      window.dispatchEvent(
        new CustomEvent("pauland-video-play", { detail: video })
      );
    }
    triggerControls();
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    triggerControls();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsMuted(video.muted);
    setIsPlaying(!video.paused);
  };

  // Scrubber click/drag per mandare avanti/indietro
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const track = progressTrackRef.current;
    if (!video || !track || !duration) return;

    const rect = track.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    triggerControls();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerControls}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={triggerControls}
      className={`group relative mb-6 w-full overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl select-none ${
        isVertical
          ? "max-w-[240px] md:max-w-[280px] aspect-[9/16]"
          : "max-w-xl md:max-w-2xl aspect-video"
      }`}
    >
      {/* Video Element (NO autoPlay) */}
      <video
        ref={videoRef}
        key={src}
        src={src}
        playsInline
        muted
        loop
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        className="h-full w-full object-cover cursor-pointer"
      />

      {/* Play/Pause Central Overlay Icon (quando in pausa) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Riproduci"
          className="absolute inset-0 z-20 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white transition-transform hover:scale-110 active:scale-95"
        >
          <svg
            className="w-6 h-6 translate-x-0.5 fill-white"
            viewBox="0 0 24 24"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      )}

      {/* Custom Sleek Bottom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10 pb-3 px-3.5 transition-opacity duration-300 font-itc ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar (Scrubber) */}
        <div
          ref={progressTrackRef}
          onClick={handleSeek}
          className="group/track relative flex h-3 w-full cursor-pointer items-center"
        >
          {/* Sfondo barra */}
          <div className="h-1 w-full rounded-full bg-white/20 transition-all group-hover/track:h-1.5">
            {/* Avanzamento */}
            <div
              style={{ width: `${progressPercent}%` }}
              className="relative h-full rounded-full bg-[#e50914] transition-all"
            >
              {/* Cursore / Knob su hover */}
              <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md opacity-0 group-hover/track:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Pulsanti & Timestamp */}
        <div className="mt-1 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white/80 hover:text-white transition-colors"
              aria-label={isPlaying ? "Pausa" : "Riproduci"}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Timestamp */}
            <span className="text-[11px] tracking-wider text-white/70 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mute / Unmute Button */}
            <button
              onClick={toggleMute}
              className="text-white/80 hover:text-white transition-colors"
              aria-label={isMuted ? "Attiva audio" : "Silenzia"}
            >
              {isMuted ? (
                /* Icona Muto con barra */
                <svg
                  className="w-4 h-4 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                /* Icona Audio Attivo */
                <svg
                  className="w-4 h-4 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white transition-colors"
              aria-label={isFullscreen ? "Esci a schermo intero" : "Schermo intero"}
            >
              {isFullscreen ? (
                <svg
                  className="w-4 h-4 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
