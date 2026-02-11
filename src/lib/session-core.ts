// src/lib/session-core.ts
export type SessionRole = "ADMIN" | "EDITOR" | "MEMBER" | "INSTRUCTOR";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  email: string;
  name?: string | null;
  nameRu?: string | null;
  exp: number; // ✅ وقت الانتهاء (unix seconds)
};

export const COOKIE_NAME = "ysm_session";
const SECRET = process.env.SESSION_SECRET || "dev_secret_change_me";

/** base64url helpers */
function base64UrlEncode(input: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(input, "utf8").toString("base64url");
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToString(b64url: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(b64url, "base64url").toString("utf8");
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function toHex(buf: ArrayBuffer): string {
  const u8 = new Uint8Array(buf);
  let out = "";
  for (const b of u8) out += b.toString(16).padStart(2, "0");
  return out;
}

async function hmacSha256Hex(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toHex(sig);
}

export async function encodeSession(payload: SessionPayload): Promise<string> {
  const json = JSON.stringify(payload);
  const base = base64UrlEncode(json);
  const sig = await hmacSha256Hex(base);
  return `${base}.${sig}`;
}

export async function decodeSession(cookieValue?: string): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  const [base, sig] = cookieValue.split(".");
  if (!base || !sig) return null;

  const expected = await hmacSha256Hex(base);
  if (expected !== sig) return null;

  try {
    const json = base64UrlDecodeToString(base);
    const payload = JSON.parse(json) as SessionPayload;

    // ✅ تحقق الانتهاء
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= now) return null;

    return payload;
  } catch {
    return null;
  }
}
