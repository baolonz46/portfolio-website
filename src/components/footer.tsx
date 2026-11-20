import Link from "next/link";

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

        {/* Nome · Telefono WhatsApp e Area riservata sulla destra (stile Macula) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2">
          <div className="text-sm md:text-[15px]">
            <a
              href="https://www.instagram.com/maarcpaolo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline underline-offset-4 transition-all"
            >
              Paolo Marcheselli
            </a>
            <span className="mx-2 text-white/40">·</span>
            <a
              href="https://wa.me/393703037565"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-75 transition-opacity text-white"
            >
              +39 370 303 7565
            </a>
          </div>

          <Link
            href="/area-riservata.html"
            className="text-xs uppercase tracking-widest text-white/35 hover:text-white/80 hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            Area riservata
          </Link>
        </div>
      </div>
    </footer>
  );
}
