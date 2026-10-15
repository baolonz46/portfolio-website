"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type Media =
  | { tipo: "foto"; src: string; w: number; h: number }
  /** `audio: true` = il video parte con il suono quando si apre l'album */
  | { tipo: "video"; src: string; w: number; h: number; audio?: boolean };

export type Progetto = {
  id: string;
  titolo: string;
  categoria: string;
  copertina: { src: string; w: number; h: number };
  album: Media[];
};

/**
 * Lavori selezionati: 2 copertine verticali affiancate + 1 orizzontale sotto.
 * Cliccando una copertina si apre l'album del progetto.
 */
export default function LavoriGallery({ progetti }: { progetti: [Progetto, Progetto, Progetto] }) {
  const [aperto, setAperto] = useState<Progetto | null>(null);
  const [vert1, vert2, orizz] = progetti;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <Copertina progetto={vert1} formato="aspect-[2/3]" onApri={setAperto} />
        <Copertina progetto={vert2} formato="aspect-[2/3]" onApri={setAperto} />
        <div className="col-span-2">
          <Copertina progetto={orizz} formato="aspect-[3/2]" onApri={setAperto} sizes="(min-width: 1024px) 990px, 100vw" />
        </div>
      </div>

      {aperto && <Album progetto={aperto} onChiudi={() => setAperto(null)} />}
    </>
  );
}

function Copertina({
  progetto,
  formato,
  onApri,
  sizes = "(min-width: 1024px) 490px, 50vw",
}: {
  progetto: Progetto;
  formato: string;
  onApri: (p: Progetto) => void;
  sizes?: string;
}) {
  return (
    <figure className="group">
      <button
        type="button"
        onClick={() => onApri(progetto)}
        aria-label={`Apri l'album ${progetto.titolo}`}
        className={`relative block w-full cursor-pointer overflow-hidden bg-line ${formato}`}
      >
        <Image
          src={progetto.copertina.src}
          alt={progetto.titolo}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        />
        <span className="absolute inset-0 bg-black/0 transition-colors duration-150 group-hover:bg-black/10" />
      </button>
    </figure>
  );
}

/**
 * Album "a cartella": all'apertura mostra tutte le foto/video insieme in griglia,
 * come quando si apre una cartella di app sul telefono. Toccando un elemento si vede a schermo intero.
 */
function Album({ progetto, onChiudi }: { progetto: Progetto; onChiudi: () => void }) {
  const [dettaglio, setDettaglio] = useState<number | null>(null);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    if (dettaglio !== null) return; // la tastiera la gestisce il visualizzatore
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onChiudi();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dettaglio, onChiudi]);

  if (dettaglio !== null) {
    return <Visualizzatore progetto={progetto} iniziale={dettaglio} onChiudi={() => setDettaglio(null)} />;
  }


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-xl md:p-8"
      onClick={onChiudi}
      role="dialog"
      aria-modal="true"
      aria-label={progetto.titolo}
    >
      <div
        className="folder-open relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden bg-paper shadow-[0_30px_120px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-3 pt-3 md:px-6 md:pt-5">
          <button
            onClick={onChiudi}
            aria-label="Chiudi album"
            className="flex h-9 w-9 items-center justify-center text-2xl leading-none text-ink/60 transition-colors duration-100 hover:bg-ink hover:text-paper"
          >
            ×
          </button>
        </div>

        {/* Tutte le foto/video insieme */}
        <div className="overflow-y-auto px-3 pb-3 pt-2 md:px-6 md:pb-6 md:pt-3">
          <div className="columns-2 gap-2 md:gap-3 [&>*]:mb-2 md:[&>*]:mb-3">
            {progetto.album.map((m, i) => (
              <button
                key={m.src}
                type="button"
                onClick={() => setDettaglio(i)}
                aria-label={`Apri elemento ${i + 1}`}
                style={{ aspectRatio: `${m.w} / ${m.h}` }}
                className="folder-item group relative block w-full break-inside-avoid overflow-hidden bg-line"
              >
                {m.tipo === "foto" ? (
                  <Image
                    src={m.src}
                    alt={`${progetto.titolo} — ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 440px, 50vw"
                    className="object-cover transition-transform duration-150 group-hover:scale-[1.01]"
                  />
                ) : (
                  <VideoAnteprima src={m.src} audio={m.audio} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Video dentro la griglia: parte da solo; con `audio` prova a partire con il suono. */
function VideoAnteprima({ src, audio }: { src: string; audio?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muto, setMuto] = useState(!audio);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = !audio;
    v.play().catch(() => {
      v.muted = true;
      setMuto(true);
      v.play().catch(() => {});
    });
  }, [audio]);

  return (
    <>
      <video ref={ref} src={src} loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <span
        role="button"
        tabIndex={0}
        aria-label={muto ? "Attiva audio" : "Disattiva audio"}
        onClick={(e) => {
          e.stopPropagation();
          if (!ref.current) return;
          ref.current.muted = !muto;
          setMuto(!muto);
        }}
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-black/60 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/90"
      >
        {muto ? "🔇" : "🔊"}
      </span>
    </>
  );
}

function Visualizzatore({ progetto, iniziale, onChiudi }: { progetto: Progetto; iniziale: number; onChiudi: () => void }) {
  const [indice, setIndice] = useState(iniziale);
  const totale = progetto.album.length;
  const corrente = progetto.album[indice];

  const prossimo = useCallback(() => setIndice((i) => (i + 1) % totale), [totale]);
  const precedente = useCallback(() => setIndice((i) => (i - 1 + totale) % totale), [totale]);

  // Tastiera + blocco dello scroll della pagina sotto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChiudi();
      if (e.key === "ArrowRight") prossimo();
      if (e.key === "ArrowLeft") precedente();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onChiudi, prossimo, precedente]);

  // Swipe su smartphone
  const touchX = useRef<number | null>(null);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0d0c0b] text-paper" role="dialog" aria-modal="true" aria-label={progetto.titolo}>
      <div className="flex items-center justify-end px-5 py-4 md:px-10 md:py-6">
        <div className="flex items-center gap-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-paper/60">
            {String(indice + 1).padStart(2, "0")} / {String(totale).padStart(2, "0")}
          </span>
          <button onClick={onChiudi} aria-label="Chiudi album" className="text-3xl leading-none text-paper/70 transition-colors hover:text-paper">
            ×
          </button>
        </div>
      </div>

      {/* Visualizzatore */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) (dx < 0 ? prossimo : precedente)();
          touchX.current = null;
        }}
      >
        {corrente.tipo === "foto" ? (
          <div key={corrente.src} className="relative h-full w-full animate-[folder-item_0.12s_ease-out]">
            <Image src={corrente.src} alt={`${progetto.titolo} — ${indice + 1}`} fill sizes="100vw" className="object-contain" preload />
          </div>
        ) : (
          <VideoConAudio key={corrente.src} src={corrente.src} />
        )}

        {totale > 1 && (
          <>
            <button
              onClick={precedente}
              aria-label="Precedente"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/20 text-xl text-paper/80 transition-colors hover:bg-paper hover:text-ink md:left-6 md:flex"
            >
              ←
            </button>
            <button
              onClick={prossimo}
              aria-label="Successivo"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/20 text-xl text-paper/80 transition-colors hover:bg-paper hover:text-ink md:right-6 md:flex"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Miniature */}
      <div className="flex justify-center gap-2 overflow-x-auto px-5 py-4 md:gap-3 md:py-6">
        {progetto.album.map((m, i) => (
          <button
            key={m.src}
            onClick={() => setIndice(i)}
            aria-label={`Elemento ${i + 1}`}
            className={`relative h-14 w-14 shrink-0 overflow-hidden transition-all md:h-16 md:w-16 ${
              i === indice ? "opacity-100 ring-1 ring-paper ring-offset-2 ring-offset-[#0d0c0b]" : "opacity-40 hover:opacity-80"
            }`}
          >
            {m.tipo === "foto" ? (
              <Image src={m.src} alt="" fill sizes="64px" className="object-cover" />
            ) : (
              <>
                <video src={`${m.src}#t=0.5`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm">▶</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Video che parte con l'audio. Se il browser blocca l'audio, parte muto e mostra il tasto per attivarlo. */
function VideoConAudio({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muto, setMuto] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setMuto(true);
      v.play().catch(() => {});
    });
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <video ref={ref} src={src} loop playsInline controls className="h-full max-h-full w-auto max-w-full" />
      {muto && (
        <button
          onClick={() => {
            if (!ref.current) return;
            ref.current.muted = false;
            setMuto(false);
          }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-paper px-5 py-2.5 text-[11px] uppercase tracking-[0.25em] text-ink shadow-lg"
        >
          🔊 Attiva audio
        </button>
      )}
    </div>
  );
}
