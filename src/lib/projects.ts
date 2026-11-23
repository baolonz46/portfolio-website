export type Media =
  | { tipo: "foto"; src: string; w: number; h: number }
  | { tipo: "video"; src: string; w: number; h: number; audio?: boolean };

export type WorkItem = {
  id: string;
  titolo: string;
  categoria: string;
  emoji: string;
  badge?: string;
  isAwarded?: boolean;
  orientamento?: "orizzontale" | "verticale";
  copertina: { src: string; w: number; h: number };
  videoLoop?: string;
  album: Media[];
};

export const works: WorkItem[] = [
  {
    id: "postcardfromnapoli",
    titolo: "Postcard from Napoli",
    categoria: "Commercial & TVC",
    emoji: "🍕",
    isAwarded: true,
    copertina: { src: "/media/pizzeria/Foto1.jpg", w: 6000, h: 4000 },
    videoLoop: "/media/VideoPizzeriaOrizzontale.mp4",
    album: [
      { tipo: "video", src: "/media/VideoPizzeriaOrizzontale.mp4", w: 1920, h: 1080 },
      { tipo: "foto", src: "/media/pizzeria/Foto1.jpg", w: 6000, h: 4000 },
      { tipo: "foto", src: "/media/pizzeria/Foto2.jpg", w: 5916, h: 3944 },
      { tipo: "foto", src: "/media/pizzeria/Foto3.jpg", w: 6000, h: 4000 },
      { tipo: "foto", src: "/media/pizzeria/Foto4.jpg", w: 6000, h: 4000 },
    ],
  },
  {
    id: "pitittos",
    titolo: "Pitittos",
    categoria: "Food & Craft",
    emoji: "🥐",
    orientamento: "verticale",
    copertina: { src: "/media/cannoli/Foto3.jpg", w: 3693, h: 5539 },
    videoLoop: "/media/cannoli/VideoVerticale1.mp4",
    album: [
      { tipo: "video", src: "/media/cannoli/VideoVerticale1.mp4", w: 1080, h: 1920 },
      { tipo: "video", src: "/media/cannoli/VideoVerticale2.mp4", w: 1080, h: 1920 },
      { tipo: "foto", src: "/media/cannoli/Foto3.jpg", w: 3693, h: 5539 },
      { tipo: "foto", src: "/media/cannoli/Foto1.jpg", w: 6000, h: 4000 },
      { tipo: "foto", src: "/media/cannoli/Foto2.jpg", w: 4000, h: 6000 },
    ],
  },
  {
    id: "pizzeria-urbana",
    titolo: "Pizzeria Urbana",
    categoria: "Food & Craft",
    emoji: "🍕",
    orientamento: "verticale",
    copertina: { src: "/media/pizzeria-urbana/copertina.jpg", w: 1080, h: 1920 },
    videoLoop: "/media/pizzeria-urbana/urbana.mp4",
    album: [
      { tipo: "video", src: "/media/pizzeria-urbana/urbana.mp4", w: 1080, h: 1920 },
    ],
  },
];
