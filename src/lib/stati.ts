/*
 * Configurazione condivisa tra server e browser (nessun import di "fs" qui,
 * così può essere usata anche dai componenti client).
 */
export const STATI = ["lead", "in-corso", "completato"] as const;
export type Stato = (typeof STATI)[number];

/** Etichetta e colori del riquadro per ogni tag. */
export const STATO_INFO: Record<Stato, { etichetta: string; classi: string; punto: string }> = {
  lead: {
    etichetta: "Lead",
    classi: "border-sky-300 bg-sky-50 text-sky-800",
    punto: "bg-sky-500",
  },
  "in-corso": {
    etichetta: "In corso",
    classi: "border-amber-300 bg-amber-50 text-amber-800",
    punto: "bg-amber-500",
  },
  completato: {
    etichetta: "Completato",
    classi: "border-emerald-300 bg-emerald-50 text-emerald-800",
    punto: "bg-emerald-500",
  },
};
