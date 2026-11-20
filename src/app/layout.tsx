import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paolo Marcheselli | Video per Attività Locali - Pesaro e Urbino",
  description:
    "Videomaker professionista a Pesaro e Urbino. Realizzazione video per attività locali, spot pubblicitari, food & beverage e produzioni visive cinematografiche.",
  keywords: [
    "Paolo Marcheselli",
    "videomaker Pesaro",
    "videomaker Urbino",
    "video per attività locali",
    "produzioni video Pesaro",
    "spot pubblicitari Pesaro",
    "videomaker Marche",
    "paulandvideo",
  ],
  authors: [{ name: "Paolo Marcheselli" }],
  creator: "Paolo Marcheselli",
  openGraph: {
    title: "Paolo Marcheselli | Video per Attività Locali - Pesaro e Urbino",
    description:
      "Videomaker professionista a Pesaro e Urbino. Realizzazione video per attività locali, spot pubblicitari, food & beverage e produzioni visive cinematografiche.",
    type: "website",
    locale: "it_IT",
    siteName: "Paolo Marcheselli | paulandvideo",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
