import Link from "next/link";
import Typewriter from "@/components/typewriter";
import Marquee from "@/components/marquee";
import MaculaGallery from "@/components/macula-gallery";
import { works } from "@/lib/projects";
import Footer from "@/components/footer";

const typewriterWords = [
  "Directed",
  "Cinematography",
  "Produced",
  "Written",
  "Casting",
  "Set Design",
  "Edited",
  "VFX",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] font-itc selection:bg-white selection:text-black">
      {/* ───────── Header Minimal stile Macula ───────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-6 md:px-14 bg-gradient-to-b from-black/85 via-black/40 to-transparent transition-all duration-300">
        <a href="#top" className="group flex items-center gap-2">
          <span className="font-itc text-lg md:text-xl font-bold tracking-tight text-white group-hover:opacity-80 transition-opacity">
            pauland<span className="text-[#e50914]">video</span>
          </span>
        </a>

        <nav className="flex items-center gap-8 md:gap-12 text-[11px] md:text-xs uppercase tracking-[0.25em] text-white/70 font-itc">
          <a href="#works" className="hover:text-white transition-colors">
            Lavori
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contatti
          </a>
        </nav>
      </header>

      {/* ───────── Hero Fullscreen con Video Background ───────── */}
      <section id="top" className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
        {/* Fullscreen Video Loop (tagliato dal secondo 7 al 25) */}
        <video
          src="/media/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none brightness-75 scale-105"
        />

        {/* Dark Overlay filmico */}
        <div className="absolute inset-0 bg-black/45 backdrop-brightness-90 z-10" />

        {/* Hero Content (stile Macula) */}
        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          {/* Titolo Typewriter in TIMES */}
          <h1 className="rise text-3xl sm:text-5xl md:text-6xl text-white font-times tracking-wide font-normal drop-shadow-md">
            <Typewriter words={typewriterWords} />{" "}
            <span className="text-white/80 font-times">by Paolo Marcheselli</span>
          </h1>
        </div>

        {/* Scroll indicator discreto in basso */}
        <a
          href="#works"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors animate-pulse font-itc"
        >
          Scorri giù ↓
        </a>
      </section>

      {/* ───────── Ticker / Marquee Brands ───────── */}
      <Marquee />

      {/* ───────── Works Section (Griglia a 3 Colonne Edge-to-Edge come da Screenshot) ───────── */}
      <section id="works" className="w-full pt-20 pb-28 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 md:px-14 mb-10 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-itc">
              Progetti Selezionati
            </span>
            <h2 className="font-itc text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight mt-1">
              Lavori &amp; Video
            </h2>
          </div>
          <span className="hidden sm:block text-xs uppercase tracking-[0.25em] text-white/40 font-itc">
            01 — {String(works.length).padStart(2, "0")}
          </span>
        </div>

        {/* Griglia a 3 colonne stile screenshot Macula */}
        <MaculaGallery works={works} />
      </section>



      {/* ───────── Footer Minimal stile Macula ───────── */}
      <Footer />
    </main>
  );
}
