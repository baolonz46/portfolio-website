import type { Metadata } from "next";
import { Suspense } from "react";
import { isAutenticato } from "@/lib/auth";
import { getClienti } from "@/lib/clienti";
import LoginForm from "./login-form";
import ClientiManager from "./clienti-manager";

export const metadata: Metadata = {
  title: "Area riservata — Paolo Marcheselli",
  robots: { index: false, follow: false },
};

export default function AreaRiservataPage() {
  return (
    <Suspense fallback={<Caricamento />}>
      <Contenuto />
    </Suspense>
  );
}

async function Contenuto() {
  if (!(await isAutenticato())) return <LoginForm />;
  const clienti = await getClienti();
  return <ClientiManager clienti={clienti} />;
}

function Caricamento() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper text-[11px] uppercase tracking-[0.3em] text-stone">
      Caricamento…
    </div>
  );
}
