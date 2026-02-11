import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/session-core";

function clear(res: NextResponse, path: string) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path,
    maxAge: 0,
  });
}

function applyClearAll(res: NextResponse) {
  // امسح من كل الأماكن المحتملة
  clear(res, "/");
  clear(res, "/admin");
  clear(res, "/ar/admin");
  clear(res, "/ru/admin");
  clear(res, "/api");
  clear(res, "/api/auth");
}

export async function GET(req: NextRequest) {
  const url = new URL("/login", req.url);
  const res = NextResponse.redirect(url);
  applyClearAll(res);
  return res;
}

export async function POST(req: NextRequest) {
  const url = new URL("/login", req.url);
  const res = NextResponse.redirect(url);
  applyClearAll(res);
  return res;
}
