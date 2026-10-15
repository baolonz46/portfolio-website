"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type Esito } from "./actions";

export default function LoginForm() {
  const [stato, azione, inCorso] = useActionState<Esito, FormData>(login, { ok: false });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-ink">
      <div className="w-full max-w-sm">
        <p className="mb-3 text-center text-[11px] uppercase tracking-[0.35em] text-stone">Area riservata</p>
        <h1 className="mb-10 text-center font-serif text-4xl">
          Paolo <span className="italic">Marcheselli</span>
        </h1>

        <form action={azione} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-stone">Password</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full border-b border-ink/30 bg-transparent py-3 text-lg outline-none transition-colors focus:border-ink"
            />
          </label>

          {stato.errore && <p className="text-sm text-accent">{stato.errore}</p>}

          <button
            type="submit"
            disabled={inCorso}
            className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.3em] text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {inCorso ? "Accesso…" : "Entra"}
          </button>
        </form>

        <Link href="/" className="mt-10 block text-center text-[11px] uppercase tracking-[0.25em] text-stone hover:text-ink">
          ← Torna al sito
        </Link>
      </div>
    </main>
  );
}
