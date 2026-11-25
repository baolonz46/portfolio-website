import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { works } from "@/lib/projects";
import MaculaGallery from "@/components/macula-gallery";
import ProjectVideoPlayer from "@/components/project-video-player";
import Footer from "@/components/footer";

export function generateStaticParams() {
  return works.map((w) => ({ id: w.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = works.find((w) => w.id === id);

  if (!project) {
    notFound();
  }

  // Estraiamo video e foto dell'album
  const videos = project.album.filter((m) => m.tipo === "video");
  const photos = project.album.filter((m) => m.tipo === "foto");

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] font-itc selection:bg-white selection:text-black">
      {/* ───────── Header Minimal ───────── */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-6 md:px-14 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-all duration-300">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-itc text-lg md:text-xl font-bold tracking-tight text-white group-hover:opacity-80 transition-opacity">
            pauland<span className="text-[#e50914]">video</span>
          </span>
        </Link>

        <nav className="flex items-center gap-8 md:gap-12 text-[11px] md:text-xs uppercase tracking-[0.25em] text-white/70 font-itc">
          <Link href="/#works" className="hover:text-white transition-colors">
            Lavori
          </Link>
          <a href="#contact" className="hover:text-white transition-colors">
            Contatti
          </a>
        </nav>
      </header>

      {/* ───────── Sezione Contenuto Progetto (VIDEO GRANDE & CHIARO + FOTO) ───────── */}
      <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center">
        {/* Mostra Video / Reel con gestione intelligente dell'audio (nessuna sovrapposizione) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-8">
          {videos.map((vid, idx) => (
            <ProjectVideoPlayer
              key={vid.src + idx}
              src={vid.src}
              poster={idx === 0 ? project.copertina?.src : undefined}
              isVertical={vid.h > vid.w}
            />
          ))}
        </div>

        {/* Mostra Tutte le Foto in formato grande e ordinato (2 Colonne, aspect 4/3) */}
        {photos.length > 0 && (
          <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:gap-6">
            {photos.map((foto, idx) => (
              <div
                key={foto.src + idx}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#111111] border border-white/10 shadow-md group"
              >
                <Image
                  src={foto.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 450px, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  priority={idx < 2}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ───────── A seguire: il resto dei progetti (come nello screenshot Macula) ───────── */}
      <section id="works" className="w-full pt-16 pb-28 border-t border-white/10 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 md:px-14 mb-10 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-itc">
              Progetti Selezionati
            </span>
            <h2 className="font-itc text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight mt-1">
              Altri Lavori
            </h2>
          </div>
          <span className="hidden sm:block text-xs uppercase tracking-[0.25em] text-white/40 font-itc">
            01 — {String(works.length).padStart(2, "0")}
          </span>
        </div>

        {/* Griglia Lavori continua */}
        <MaculaGallery works={works} />
      </section>

      {/* ───────── Footer Minimal ───────── */}
      <Footer />
    </main>
  );
}
