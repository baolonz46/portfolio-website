type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function VimeoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.396 7.164c-.093 2.026-1.507 4.8-4.245 8.32C15.323 19.16 12.93 21 10.97 21c-1.214 0-2.24-1.12-3.08-3.36-.56-2.052-1.119-4.1-1.68-6.152-.653-2.333-1.306-3.5-1.96-3.5-.186 0-.746.374-1.68 1.12l-1.12-1.4c1.12-1.026 2.334-2.146 3.64-3.36 1.493-1.4 2.52-2.147 3.08-2.24 1.773-.28 2.893.654 3.36 2.8.373 1.96.653 3.64.84 5.04.373 2.52.84 3.733 1.4 3.733.467 0 1.213-.653 2.24-1.96 1.12-1.4 1.68-2.613 1.68-3.64 0-1.026-.373-1.586-1.12-1.586-.56 0-1.12.186-1.587.56C16.892 4.148 18.572 3.028 20.252 3.12c1.4.094 2.147 1.442 2.144 4.044z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export const EMAIL = "paolomarcheselli@gmail.com";

/** Icone social: nere di default (ereditano il colore del testo). */
export function SocialLinks({ className = "", iconClassName = "h-6 w-6" }: { className?: string; iconClassName?: string }) {
  const link = "transition-opacity duration-300 hover:opacity-50";
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={link}>
        <InstagramIcon className={iconClassName} />
      </a>
      <a href="https://vimeo.com/" target="_blank" rel="noopener noreferrer" aria-label="Vimeo" className={link}>
        <VimeoIcon className={iconClassName} />
      </a>
      <a href={`mailto:${EMAIL}`} aria-label="Email" className={link}>
        <MailIcon className={iconClassName} />
      </a>
    </div>
  );
}
