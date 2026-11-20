import { InstagramIcon } from "@/components/social";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-black py-12 px-6 md:px-16 border-t border-white/10 font-itc">
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm md:text-[15px] text-white">
        {/* Email a sinistra con sottolineatura (stile Macula) */}
        <div>
          <a
            href="mailto:marchesellipaolo9@gmail.com"
            className="underline underline-offset-4 hover:opacity-75 transition-opacity"
          >
            marchesellipaolo9@gmail.com
          </a>
        </div>

        {/* Nome · Icona Instagram sulla destra */}
        <div className="flex items-center gap-2.5 text-sm md:text-[15px]">
          <a
            href="https://www.instagram.com/maarcpaolo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4 transition-all"
          >
            Paolo Marcheselli
          </a>
          <span className="text-white/40">·</span>
          <a
            href="https://www.instagram.com/maarcpaolo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white hover:opacity-75 transition-opacity inline-flex items-center"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
