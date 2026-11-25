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
  poster,
  isVertical,
}: {
  src: string;
  poster?: string;
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
      className={`group relative mb-8 w-auto overflow-hidden rounded-xl md:rounded-2xl border border-white/20 hover:border-white/35 bg-[#0a0a0a] shadow-[0_20px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 select-none transition-all duration-300 ${
        isVertical
          ? "max-w-[92vw] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] h-[65vh] sm:h-[72vh] md:h-[76vh] max-h-[820px] aspect-[9/16]"
          : "w-full max-w-3xl md:max-w-4xl lg:max-w-5xl aspect-video"
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
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

      {/* Play/Pause Central Overlay Icon Grande e Chiaro */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Riproduci"
          className="absolute inset-0 z-20 m-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-black/70 backdrop-blur-md border-2 border-white/40 text-white shadow-[0_0_40px_rgba(0,0,0,0.85)] transition-all duration-300 hover:scale-110 hover:bg-black/85 hover:border-white active:scale-95 group/btn"
        >
          <svg
            className="w-8 h-8 md:w-10 md:h-10 translate-x-0.5 fill-white transition-transform group-hover/btn:scale-105"
            viewBox="0 0 24 24"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      )}

      {/* Custom Sleek Bottom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-14 pb-3.5 px-4 md:px-5 transition-opacity duration-300 font-itc ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar (Scrubber) */}
        <div
          ref={progressTrackRef}
          onClick={handleSeek}
          className="group/track relative flex h-4 w-full cursor-pointer items-center"
        >
          {/* Sfondo barra */}
          <div className="h-1.5 md:h-2 w-full rounded-full bg-white/25 transition-all group-hover/track:h-2.5">
            {/* Avanzamento */}
            <div
              style={{ width: `${progressPercent}%` }}
              className="relative h-full rounded-full bg-[#e50914] transition-all"
            >
              {/* Cursore / Knob su hover */}
              <div className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-lg opacity-0 group-hover/track:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Pulsanti & Timestamp */}
        <div className="mt-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white/90 hover:text-white transition-colors p-1"
              aria-label={isPlaying ? "Pausa" : "Riproduci"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Timestamp */}
            <span className="text-xs md:text-sm tracking-wider text-white/90 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Mute / Unmute Button */}
            <button
              onClick={toggleMute}
              className="text-white/90 hover:text-white transition-colors p-1"
              aria-label={isMuted ? "Attiva audio" : "Silenzia"}
            >
              {isMuted ? (
                <svg
                  className="w-5 h-5 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 stroke-current fill-none stroke-2"
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
              className="text-white/90 hover:text-white transition-colors p-1"
              aria-label={isFullscreen ? "Esci a schermo intero" : "Schermo intero"}
            >
              {isFullscreen ? (
                <svg
                  className="w-5 h-5 stroke-current fill-none stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 stroke-current fill-none stroke-2"
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
