"use client";

import Link from "next/link";
import { useActionState, useMemo, useState, useTransition } from "react";
import type { Cliente } from "@/lib/clienti";
import { STATI, STATO_INFO, type Stato } from "@/lib/stati";
import { DocsLogo, MapsLogo, NotionLogo, SheetsLogo } from "@/components/loghi";
import { eliminaCliente, logout, salvaCliente, type Esito } from "./actions";

const COLLEGAMENTI = [
  { chiave: "linkFogli", nome: "Fogli", titolo: "Google Fogli", Logo: SheetsLogo },
  { chiave: "linkDocs", nome: "Docs", titolo: "Google Docs", Logo: DocsLogo },
  { chiave: "linkMaps", nome: "Maps", titolo: "Google Maps", Logo: MapsLogo },
  { chiave: "linkNotion", nome: "Notion", titolo: "Notion", Logo: NotionLogo },
] as const;

type Modifica = { tipo: "nuovo" } | { tipo: "modifica"; cliente: Cliente } | null;

export default function ClientiManager({ clienti }: { clienti: Cliente[] }) {
  const [ricerca, setRicerca] = useState("");
  const [filtroStato, setFiltroStato] = useState<Stato | "tutti">("tutti");
  const [modifica, setModifica] = useState<Modifica>(null);
  const [, startTransition] = useTransition();

  const conteggio = useMemo(() => {
    return {
      tutti: clienti.length,
      lead: clienti.filter((c) => c.stato === "lead").length,
      "in-corso": clienti.filter((c) => c.stato === "in-corso").length,
      completato: clienti.filter((c) => c.stato === "completato").length,
    };
  }, [clienti]);

  const filtrati = useMemo(() => {
    let list = clienti;
    if (filtroStato !== "tutti") {
      list = list.filter((c) => c.stato === filtroStato);
    }
    const q = ricerca.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) =>
      [
        c.nomeCognome,
        c.nomeAttivita,
        c.emailPersona,
        c.emailAttivita,
        c.telefonoPersona,
        c.telefonoAttivita,
        c.descrizione,
        c.stato,
        STATO_INFO[c.stato]?.etichetta,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [clienti, ricerca, filtroStato]);

  function elimina(c: Cliente) {
    if (!confirm(`Eliminare "${c.nomeCognome || c.nomeAttivita}"?`)) return;
    startTransition(async () => {
      await eliminaCliente(c.id);
    });
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Barra superiore */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="font-serif text-lg">
            Paolo <span className="italic">Marcheselli</span>
          </Link>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.25em] text-stone">
            <span className="hidden sm:inline">Area riservata</span>
            <button onClick={() => startTransition(() => logout())} className="transition-colors hover:text-ink">
              Esci
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        {/* Titolo + azioni */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone">
              {clienti.length} {clienti.length === 1 ? "contatto" : "contatti"}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl">
              I miei <span className="italic">clienti</span>
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              placeholder="Cerca nome, attività, email…"
              className="w-full border border-line bg-white/60 px-4 py-3 text-sm outline-none transition-colors focus:border-ink sm:w-72"
            />
            <button
              onClick={() => setModifica({ tipo: "nuovo" })}
              className="whitespace-nowrap bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-paper transition-opacity hover:opacity-85"
            >
              + Nuovo cliente
            </button>
          </div>
        </div>

        {/* Filtri rapidi per tag/stato */}
        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-line pb-4 text-[11px] uppercase tracking-[0.2em]">
          <span className="mr-2 text-stone">Filtra:</span>
          <button
            onClick={() => setFiltroStato("tutti")}
            className={`rounded-md border px-3 py-1.5 transition-all ${
              filtroStato === "tutti"
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white/40 text-stone hover:text-ink"
            }`}
          >
            Tutti ({conteggio.tutti})
          </button>
          {STATI.map((s) => {
            const info = STATO_INFO[s];
            const attivo = filtroStato === s;
            return (
              <button
                key={s}
                onClick={() => setFiltroStato(s)}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 transition-all ${
                  attivo ? `${info.classi} ring-1 ring-current font-semibold` : "border-line bg-white/40 text-stone hover:text-ink"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${info.punto}`} />
                {info.etichetta} ({conteggio[s]})
              </button>
            );
          })}
        </div>

        {/* Elenco */}
        {clienti.length === 0 ? (
          <div className="border border-dashed border-line px-6 py-24 text-center">
            <p className="font-serif text-2xl">Nessun cliente ancora.</p>
            <p className="mt-2 text-sm text-stone">Aggiungi il primo con il pulsante “Nuovo cliente”.</p>
          </div>
        ) : filtrati.length === 0 ? (
          <p className="py-20 text-center text-sm text-stone">Nessun risultato per “{ricerca}”.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filtrati.map((c) => (
              <article key={c.id} className="flex flex-col border border-line bg-white/50 p-6 transition-shadow hover:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)]">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <TagStato stato={c.stato} />
                    <h2 className="mt-3 truncate font-serif text-2xl">{c.nomeCognome || c.nomeAttivita}</h2>
                    {c.nomeCognome && c.nomeAttivita && (
                      <p className="mt-1 truncate text-[11px] uppercase tracking-[0.25em] text-accent">{c.nomeAttivita}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-4 text-[10px] uppercase tracking-[0.2em] text-stone">
                    <button onClick={() => setModifica({ tipo: "modifica", cliente: c })} className="hover:text-ink">
                      Modifica
                    </button>
                    <button onClick={() => elimina(c)} className="hover:text-accent">
                      Elimina
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 border-t border-line pt-5 text-sm sm:grid-cols-2">
                  <Blocco titolo="Persona" telefono={c.telefonoPersona} email={c.emailPersona} />
                  <Blocco titolo="Attività" telefono={c.telefonoAttivita} email={c.emailAttivita} />
                </div>

                {c.descrizione && (
                  <p className="mt-5 whitespace-pre-line border-t border-line pt-5 text-sm leading-relaxed text-ink/75">
                    {c.descrizione}
                  </p>
                )}

                {/* Tasti collegamenti: Fogli, Docs, Maps, Notion */}
                <div className="flex-1" />
                <div className="mt-5 grid grid-cols-4 gap-2 border-t border-line pt-5">
                  {COLLEGAMENTI.map(({ chiave, nome, titolo, Logo }) => {
                    const url = c[chiave];
                    const base = "flex flex-col items-center justify-center gap-1.5 border py-3 text-[10px] uppercase tracking-[0.15em] transition-all";
                    return url ? (
                      <a
                        key={chiave}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Apri ${titolo}`}
                        className={`${base} border-line bg-white text-ink hover:-translate-y-0.5 hover:border-ink hover:shadow-md`}
                      >
                        <Logo className="h-6 w-6" />
                        {nome}
                      </a>
                    ) : (
                      <span
                        key={chiave}
                        title={`Nessun link ${titolo}: aggiungilo da "Modifica"`}
                        className={`${base} cursor-not-allowed border-dashed border-line text-stone/60 opacity-50 grayscale`}
                      >
                        <Logo className="h-6 w-6" />
                        {nome}
                      </span>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {modifica && (
        <FormCliente
          key={modifica.tipo === "modifica" ? modifica.cliente.id : "nuovo"}
          cliente={modifica.tipo === "modifica" ? modifica.cliente : undefined}
          onChiudi={() => setModifica(null)}
        />
      )}
    </main>
  );
}

function TagStato({ stato }: { stato: Stato }) {
  const info = STATO_INFO[stato] ?? STATO_INFO.lead;
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${info.classi}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${info.punto}`} />
      {info.etichetta}
    </span>
  );
}

function Blocco({ titolo, telefono, email }: { titolo: string; telefono: string; email: string }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-stone">{titolo}</p>
      {telefono ? (
        <a href={`tel:${telefono.replace(/\s+/g, "")}`} className="block truncate hover:text-accent">
          {telefono}
        </a>
      ) : (
        <span className="block text-stone/60">—</span>
      )}
      {email ? (
        <a href={`mailto:${email}`} className="block truncate hover:text-accent">
          {email}
        </a>
      ) : (
        <span className="block text-stone/60">—</span>
      )}
    </div>
  );
}

function FormCliente({ cliente, onChiudi }: { cliente?: Cliente; onChiudi: () => void }) {
  const [stato, azione, inCorso] = useActionState<Esito, FormData>(async (prev, formData) => {
    const esito = await salvaCliente(prev, formData);
    if (esito.ok) onChiudi();
    return esito;
  }, { ok: false });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onChiudi}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5 md:px-8">
          <h2 className="font-serif text-3xl">
            {cliente ? "Modifica" : "Nuovo"} <span className="italic">cliente</span>
          </h2>
          <button onClick={onChiudi} aria-label="Chiudi" className="text-2xl leading-none text-stone hover:text-ink">
            ×
          </button>
        </div>

        <form action={azione} className="space-y-8 px-6 py-8 md:px-8">
          {cliente && <input type="hidden" name="id" value={cliente.id} />}

          <fieldset>
            <legend className="mb-3 text-[10px] uppercase tracking-[0.25em] text-stone">Tag</legend>
            <div className="grid grid-cols-3 gap-2">
              {STATI.map((s) => {
                const info = STATO_INFO[s];
                return (
                  <label key={s} className="cursor-pointer">
                    <input
                      type="radio"
                      name="stato"
                      value={s}
                      defaultChecked={(cliente?.stato ?? "lead") === s}
                      className="peer sr-only"
                    />
                    <span
                      className={`flex items-center justify-center gap-2 rounded-md border px-2 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] opacity-45 transition-all peer-checked:opacity-100 peer-checked:ring-2 peer-checked:ring-current peer-checked:ring-offset-1 peer-focus-visible:ring-2 ${info.classi}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${info.punto}`} />
                      {info.etichetta}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo nome="nomeCognome" etichetta="Nome e Cognome" valore={cliente?.nomeCognome} autoFocus />
            <Campo nome="nomeAttivita" etichetta="Nome attività" valore={cliente?.nomeAttivita} />
          </div>

          <fieldset>
            <legend className="mb-4 font-serif text-lg italic">Persona</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <Campo nome="telefonoPersona" etichetta="Telefono persona" tipo="tel" valore={cliente?.telefonoPersona} />
              <Campo nome="emailPersona" etichetta="Email persona" tipo="email" valore={cliente?.emailPersona} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-serif text-lg italic">Attività</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <Campo nome="telefonoAttivita" etichetta="Telefono attività" tipo="tel" valore={cliente?.telefonoAttivita} />
              <Campo nome="emailAttivita" etichetta="Email attività" tipo="email" valore={cliente?.emailAttivita} />
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-stone">Descrizione</span>
            <textarea
              name="descrizione"
              rows={5}
              defaultValue={cliente?.descrizione}
              placeholder="Note, tipo di lavoro, preferenze, date…"
              className="w-full resize-y border border-line bg-white/60 p-3 text-sm outline-none transition-colors focus:border-ink"
            />
          </label>

          <fieldset>
            <legend className="mb-4 font-serif text-lg italic">Collegamenti</legend>
            <div className="space-y-4">
              {COLLEGAMENTI.map(({ chiave, titolo, Logo }) => (
                <label key={chiave} className="flex items-center gap-3">
                  <Logo className="h-6 w-6 shrink-0" />
                  <input
                    type="url"
                    name={chiave}
                    defaultValue={cliente?.[chiave]}
                    placeholder={`Link ${titolo} (https://…)`}
                    className="w-full border-b border-ink/25 bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-stone/60 focus:border-ink"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {stato.errore && <p className="text-sm text-accent">{stato.errore}</p>}

          <div className="flex gap-3 border-t border-line pt-6">
            <button
              type="submit"
              disabled={inCorso}
              className="flex-1 bg-ink py-4 text-[11px] uppercase tracking-[0.3em] text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {inCorso ? "Salvataggio…" : "Salva"}
            </button>
            <button
              type="button"
              onClick={onChiudi}
              className="border border-line px-6 py-4 text-[11px] uppercase tracking-[0.3em] text-stone transition-colors hover:border-ink hover:text-ink"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({
  nome,
  etichetta,
  tipo = "text",
  valore,
  autoFocus,
}: {
  nome: string;
  etichetta: string;
  tipo?: string;
  valore?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-stone">{etichetta}</span>
      <input
        type={tipo}
        name={nome}
        defaultValue={valore}
        autoFocus={autoFocus}
        className="w-full border-b border-ink/25 bg-transparent py-2.5 outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}
