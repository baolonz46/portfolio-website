import Link from "next/link";
import { EMAIL, SocialLinks } from "@/components/social";
import LavoriGallery, { type Progetto } from "@/components/lavori-gallery";

/* Lavori selezionati: [verticale, verticale, orizzontale] */
const progetti: [Progetto, Progetto, Progetto] = [
  {
    id: "cannoli",
    titolo: "Cannoli",
    categoria: "Food",
    copertina: { src: "/media/cannoli/Foto3.jpg", w: 3693, h: 5539 },
    album: [
      { tipo: "foto", src: "/media/cannoli/Foto3.jpg", w: 3693, h: 5539 },
      { tipo: "foto", src: "/media/cannoli/Foto1.jpg", w: 6000, h: 4000 },
      { tipo: "foto", src: "/media/cannoli/Foto2.jpg", w: 4000, h: 6000 },
      { tipo: "video", src: "/media/cannoli/VideoVerticale1.mp4", w: 1080, h: 1920 },
    ],
  },
  {
    id: "drink-limone",
    titolo: "Drink al Limone",
    categoria: "Beverage",
    copertina: { src: "/media/drink-limone/Foto1.jpg", w: 2624, h: 3936 },
    album: [
      // Il video parte con l'audio all'apertura dell'album
      { tipo: "video", src: "/media/drink-limone/VideoVerticale1.mp4", w: 1080, h: 1920, audio: true },
      { tipo: "foto", src: "/media/drink-limone/Foto1.jpg", w: 2624, h: 3936 },
    ],
  },
  {
    id: "pizzeria",
    titolo: "Pizzeria",
    categoria: "Ristorazione",
    copertina: { src: "/media/pizzeria/Foto1.jpg", w: 6000, h: 4000 },
    album: [
      { tipo: "foto", src: "/media/pizzeria/Foto1.jpg", w: 6000, h: 4000 },
      { tipo: "foto", src: "/media/pizzeria/Foto2.jpg", w: 5916, h: 3944 },
      { tipo: "foto", src: "/media/pizzeria/Foto3.jpg", w: 6000, h: 4000 },
      { tipo: "foto", src: "/media/pizzeria/Foto4.jpg", w: 6000, h: 4000 },
    ],
  },
];

const servizi = [
  {
    n: "01",
    titolo: "Ritratti",
    testo:
      "Ritratti personali e professionali, in studio o in esterna. Luce naturale, pose spontanee, nessuna fretta.",
  },
  {
    n: "02",
    titolo: "Food & Ristorazione",
    testo:
      "Piatti, locali e persone che li rendono vivi. Foto e video per menu, social e campagne.",
  },
  {
    n: "03",
    titolo: "Brand & Video",
    testo:
      "Racconti visivi per aziende e attività: dal concept allo shooting, fino al montaggio finale.",
  },
];

export default function Home() {
  return (
    <main className="w-full bg-paper text-ink">
      {/* ───────── Navigazione ───────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
          <a href="#top" className="font-serif text-lg tracking-tight md:text-xl">
            Paolo <span className="italic">Marcheselli</span>
          </a>

          <ul className="hidden items-center gap-10 text-[11px] uppercase tracking-[0.25em] text-ink/70 md:flex">
            <li><a href="#lavori" className="transition-colors hover:text-ink">Lavori</a></li>
            <li><a href="#showreel" className="transition-colors hover:text-ink">Showreel</a></li>
            <li><a href="#servizi" className="transition-colors hover:text-ink">Servizi</a></li>
            <li><a href="#contatti" className="transition-colors hover:text-ink">Contatti</a></li>
          </ul>

          {/* Icone social nere, in alto a destra */}
          <SocialLinks className="text-black" iconClassName="h-5 w-5 md:h-6 md:w-6" />
        </nav>
      </header>

      {/* ───────── Hero: video incorniciato ───────── */}
      <section id="top" className="h-[100svh] px-3 pb-3 pt-[4.75rem] md:px-5 md:pb-5 md:pt-[6.25rem]">
        <div className="grain relative h-full w-full overflow-hidden bg-ink">
          <video
            src="/media/VideoPizzeriaOrizzontale.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 text-white md:flex-row md:items-end md:justify-between md:p-12">
            <div>
              <p className="rise mb-4 text-[10px] uppercase tracking-[0.35em] text-white/80 md:text-xs">
                Fotografia &amp; Video
              </p>
              {/* Su mobile il nome va su due righe: niente più sovrapposizioni */}
              <h1 className="rise font-serif text-[17vw] leading-[0.9] tracking-tight [animation-delay:150ms] md:text-[9vw] xl:text-[150px]">
                Paolo
                <br />
                <span className="italic">Marcheselli</span>
              </h1>
            </div>

            <div className="rise flex items-center gap-4 [animation-delay:300ms] md:flex-col md:items-end">
              <p className="max-w-xs text-sm leading-relaxed text-white/85 md:text-right">
                Immagini che raccontano persone, luoghi e sapori.
              </p>
              <a href="#lavori" className="scroll-hint hidden text-[10px] uppercase tracking-[0.35em] md:block">
                Scorri ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Manifesto ───────── */}
      <section className="mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
        <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-stone">Approccio</p>
        <p className="font-serif text-3xl leading-snug md:text-5xl md:leading-tight">
          Cerco la luce giusta, poi aspetto il momento in cui le persone
          <span className="italic text-accent"> smettono di posare</span>.
        </p>
      </section>

      {/* ───────── Lavori selezionati (griglia 2x2, tutte uguali) ───────── */}
      <section id="lavori" className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-28 md:px-6 md:pb-40">
        <div className="mb-10 flex items-end justify-between border-b border-line pb-5">
          <h2 className="font-serif text-4xl md:text-6xl">
            Lavori <span className="italic">selezionati</span>
          </h2>
          <span className="text-[11px] uppercase tracking-[0.3em] text-stone">01 — 03</span>
        </div>

        <LavoriGallery progetti={progetti} />
      </section>

      {/* ───────── Showreel ───────── */}
      <section id="showreel" className="scroll-mt-16 bg-ink py-24 text-paper md:py-36">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-serif text-4xl md:text-6xl">
              Show<span className="italic">reel</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-paper/60">
              Una selezione di riprese e montaggi: movimento, ritmo e luce.
            </p>
          </div>
          <div className="grain relative aspect-video w-full overflow-hidden bg-black">
            <video
              src="/media/showreel.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ───────── Servizi ───────── */}
      <section id="servizi" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:py-40">
        <p className="mb-14 text-[11px] uppercase tracking-[0.35em] text-stone">Servizi</p>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {servizi.map((s) => (
            <div key={s.n} className="border-t border-ink pt-6">
              <span className="font-serif text-sm italic text-accent">{s.n}</span>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl">{s.titolo}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">{s.testo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Contatti ───────── */}
      <section id="contatti" className="border-t border-line px-6 py-28 text-center md:py-40">
        <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-stone">Contatti</p>
        <h2 className="font-serif text-5xl leading-none md:text-8xl">
          Lavoriamo <span className="italic">insieme.</span>
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-10 inline-block border-b border-ink pb-1 text-base transition-colors hover:border-accent hover:text-accent md:text-xl"
        >
          {EMAIL}
        </a>
        <div className="mt-10 flex justify-center">
          <SocialLinks className="gap-8 text-black" iconClassName="h-7 w-7" />
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-[11px] uppercase tracking-[0.25em] text-stone md:flex-row">
          <span>© 2026 Paolo Marcheselli</span>
          <Link href="/area-riservata" className="transition-colors hover:text-ink">
            Area riservata
          </Link>
        </div>
      </footer>
    </main>
  );
}
