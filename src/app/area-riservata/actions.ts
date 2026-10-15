"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { confronta, isAutenticato, passwordAdmin, SESSION_COOKIE, tokenSessione } from "@/lib/auth";
import { aggiornaCliente, creaCliente, rimuoviCliente, STATI, type DatiCliente, type Stato } from "@/lib/clienti";

export type Esito = { ok: boolean; errore?: string };

export async function login(_prev: Esito, formData: FormData): Promise<Esito> {
  const password = String(formData.get("password") ?? "");
  if (!passwordAdmin()) {
    return { ok: false, errore: "Password non configurata (ADMIN_PASSWORD in .env.local)." };
  }
  if (!confronta(password, passwordAdmin())) {
    return { ok: false, errore: "Password errata." };
  }
  (await cookies()).set(SESSION_COOKIE, tokenSessione(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { ok: true };
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizzaLink(valore: string) {
  const v = valore.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function linkValido(valore: string) {
  if (!valore) return true;
  try {
    const url = new URL(valore);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function campo(formData: FormData, nome: string) {
  return String(formData.get(nome) ?? "").trim().slice(0, 2000);
}

export async function salvaCliente(_prev: Esito, formData: FormData): Promise<Esito> {
  if (!(await isAutenticato())) return { ok: false, errore: "Sessione scaduta, accedi di nuovo." };

  const dati: DatiCliente = {
    nomeCognome: campo(formData, "nomeCognome"),
    nomeAttivita: campo(formData, "nomeAttivita"),
    telefonoPersona: campo(formData, "telefonoPersona"),
    telefonoAttivita: campo(formData, "telefonoAttivita"),
    emailPersona: campo(formData, "emailPersona"),
    emailAttivita: campo(formData, "emailAttivita"),
    descrizione: campo(formData, "descrizione"),
    stato: (STATI as readonly string[]).includes(campo(formData, "stato"))
      ? (campo(formData, "stato") as Stato)
      : "lead",
    linkFogli: normalizzaLink(campo(formData, "linkFogli")),
    linkDocs: normalizzaLink(campo(formData, "linkDocs")),
    linkMaps: normalizzaLink(campo(formData, "linkMaps")),
    linkNotion: normalizzaLink(campo(formData, "linkNotion")),
  };

  if (!dati.nomeCognome && !dati.nomeAttivita) {
    return { ok: false, errore: "Inserisci almeno Nome e Cognome oppure il Nome dell'attività." };
  }
  for (const [chiave, etichetta] of [["emailPersona", "Email persona"], ["emailAttivita", "Email attività"]] as const) {
    if (dati[chiave] && !EMAIL_RE.test(dati[chiave])) {
      return { ok: false, errore: `${etichetta} non valida.` };
    }
  }
  for (const [chiave, etichetta] of [
    ["linkFogli", "Google Fogli"],
    ["linkDocs", "Google Docs"],
    ["linkMaps", "Google Maps"],
    ["linkNotion", "Notion"],
  ] as const) {
    if (dati[chiave] && !linkValido(dati[chiave])) {
      return { ok: false, errore: `Link ${etichetta} non valido (inserisci un URL valido).` };
    }
  }

  const id = campo(formData, "id");
  if (id) {
    const trovato = await aggiornaCliente(id, dati);
    if (!trovato) return { ok: false, errore: "Cliente non trovato." };
  } else {
    await creaCliente(dati);
  }

  refresh();
  return { ok: true };
}

export async function eliminaCliente(id: string): Promise<Esito> {
  if (!(await isAutenticato())) return { ok: false, errore: "Sessione scaduta, accedi di nuovo." };
  await rimuoviCliente(id);
  refresh();
  return { ok: true };
}
