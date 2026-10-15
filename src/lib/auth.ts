import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "pm_session";

function segreto() {
  return process.env.AUTH_SECRET || "cambia-questo-segreto";
}

export function passwordAdmin() {
  return process.env.ADMIN_PASSWORD || "";
}

/** Token di sessione derivato dalla password: cambiando password, le sessioni vecchie scadono. */
export function tokenSessione() {
  return createHmac("sha256", segreto()).update(`pm:${passwordAdmin()}`).digest("hex");
}

export function confronta(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function isAutenticato() {
  if (!passwordAdmin()) return false;
  const valore = (await cookies()).get(SESSION_COOKIE)?.value;
  return !!valore && confronta(valore, tokenSessione());
}
