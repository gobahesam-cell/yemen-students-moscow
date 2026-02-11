// src/lib/session.ts
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, SessionPayload, encodeSession, decodeSession } from "./session-core";

// Re-export for convenience
export { COOKIE_NAME, decodeSession };

const SESSION_MAX_AGE_SEC = 60 * 60 * 2; // ساعتين

export async function setSession(input: Omit<SessionPayload, "exp">) {
  const store = await cookies();
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;

  const value = await encodeSession({ ...input, exp });

  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return decodeSession(value);
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const value = req.cookies.get(COOKIE_NAME)?.value;
  return decodeSession(value);
}
