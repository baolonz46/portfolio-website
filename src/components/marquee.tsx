"use client";

interface MarqueeProps {
  items?: string[];
}

const defaultItems = [
  "FOOD & BEVERAGE",
  "COMMERCIAL",
  "EDITORIAL",
  "PORTRAITS",
  "BRAND STORIES",
  "RESTAURANTS & WINE",
  "SHORT FILMS",
  "CINEMATOGRAPHY",
];

export default function Marquee({ items = defaultItems }: MarqueeProps) {
  // Duplichiamo la lista per creare il loop continuo seamless
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-black/60 py-5 backdrop-blur-sm select-none">
      {/* Sfumature ai bordi laterali */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-12 text-xs md:text-sm uppercase tracking-[0.35em] text-white/50 font-medium">
        {duplicated.map((item, index) => (
          <div key={index} className="flex items-center gap-12 whitespace-nowrap">
            <span className="hover:text-white transition-colors cursor-default">{item}</span>
            <span className="text-white/20 text-xs">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
