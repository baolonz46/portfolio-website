"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WorkItem } from "@/lib/projects";

export default function MaculaGallery({
  works,
  excludeId,
}: {
  works: WorkItem[];
  excludeId?: string;
}) {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Cursore Emoji volante che segue il mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const displayWorks = excludeId ? works.filter((w) => w.id !== excludeId) : works;

  return (
    <>
      {/* Floating Emoji Cursor Element */}
      <div
        ref={cursorRef}
        id="emoji-cursor"
        className="pointer-events-none fixed top-0 left-0 z-[99999] text-3xl select-none"
        style={{
          display: hoveredEmoji ? "block" : "none",
          marginLeft: "12px",
          marginTop: "12px",
        }}
      >
        {hoveredEmoji}
      </div>

      {/* Griglia Lavori stile Macula */}
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div
          className={`w-full grid grid-cols-1 ${
            displayWorks.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          } gap-6 md:gap-8`}
        >
          {displayWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onHover={(emoji) => setHoveredEmoji(emoji)}
              onLeave={() => setHoveredEmoji(null)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function WorkCard({
  work,
  onHover,
  onLeave,
}: {
  work: WorkItem;
  onHover: (emoji: string) => void;
  onLeave: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    onHover(work.emoji);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    onLeave();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const isVertical = work.orientamento === "verticale";

  return (
    <Link
      href={`/projects/${work.id}`}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("silence-all-media"));
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`has-emoji-cursor group relative block w-full overflow-hidden rounded-md bg-[#0d0d0d] aspect-[16/10] transition-all duration-500 border border-white/10 ${
        work.isAwarded
          ? "border-2 border-[#c9a84c] shadow-[0_0_30px_rgba(201,168,76,0.18)] z-10"
          : "hover:border-white/30"
      }`}
    >
      {/* Immagine copertina di sfondo */}
      <Image
        src={work.copertina.src}
        alt={work.titolo}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video Loop su hover (stile Macula) */}
      {work.videoLoop && (
        <video
          ref={videoRef}
          src={work.videoLoop}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      )}

      {/* Dark Overlay filmico (gradiente morbido dal basso per contrasto testo) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/30" />

      {/* Badge AWARDED in alto a destra */}
      {work.isAwarded && (
        <span className="absolute top-5 right-5 z-20 text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold drop-shadow font-itc">
          AWARDED
        </span>
      )}

      {/* Altri badge opzionali in alto a sinistra */}
      {work.badge && !work.isAwarded && (
        <span className="absolute top-5 left-5 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md font-itc">
          {work.badge}
        </span>
      )}

      {/* Titolo in basso a sinistra (senza sotto-testo) */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 flex flex-col justify-end transition-transform duration-300">
        <h3 className="font-itc text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-md group-hover:translate-x-1 transition-transform duration-300 leading-tight">
          {work.titolo}
        </h3>
      </div>
    </Link>
  );
}
