import { promises as fs } from "fs";
import path from "path";

import { STATI, type Stato } from "./stati";

export { STATI, type Stato };

export type Cliente = {
  id: string;
  nomeCognome: string;
  nomeAttivita: string;
  telefonoPersona: string;
  telefonoAttivita: string;
  emailPersona: string;
  emailAttivita: string;
  descrizione: string;
  stato: Stato;
  linkFogli: string;
  linkDocs: string;
  linkMaps: string;
  linkNotion: string;
  creatoIl: string;
  aggiornatoIl: string;
};

/** Valori di default per i clienti salvati prima dell'aggiunta dei nuovi campi. */
const DEFAULT_NUOVI_CAMPI = {
  stato: "lead" as Stato,
  linkFogli: "",
  linkDocs: "",
  linkMaps: "",
  linkNotion: "",
};

export type DatiCliente = Omit<Cliente, "id" | "creatoIl" | "aggiornatoIl">;

/*
 * Archivio locale su file JSON (data/clienti.json).
 * Funziona in locale; per la messa online (Vercel) andrà sostituito
 * con un database (es. Supabase/Neon) mantenendo le stesse funzioni.
 */
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "clienti.json");

async function leggi(): Promise<Cliente[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const dati = JSON.parse(raw) as Partial<Cliente>[];
    return dati.map((c) => ({ ...DEFAULT_NUOVI_CAMPI, ...c }) as Cliente);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function scrivi(clienti: Cliente[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(clienti, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

export async function getClienti(): Promise<Cliente[]> {
  const clienti = await leggi();
  return clienti.sort((a, b) =>
    (a.nomeCognome || a.nomeAttivita).localeCompare(b.nomeCognome || b.nomeAttivita, "it")
  );
}

export async function creaCliente(dati: DatiCliente): Promise<Cliente> {
  const clienti = await leggi();
  const ora = new Date().toISOString();
  const nuovo: Cliente = { id: crypto.randomUUID(), ...dati, creatoIl: ora, aggiornatoIl: ora };
  clienti.push(nuovo);
  await scrivi(clienti);
  return nuovo;
}

export async function aggiornaCliente(id: string, dati: DatiCliente): Promise<boolean> {
  const clienti = await leggi();
  const i = clienti.findIndex((c) => c.id === id);
  if (i === -1) return false;
  clienti[i] = { ...clienti[i], ...dati, aggiornatoIl: new Date().toISOString() };
  await scrivi(clienti);
  return true;
}

export async function rimuoviCliente(id: string): Promise<void> {
  const clienti = await leggi();
  await scrivi(clienti.filter((c) => c.id !== id));
}
