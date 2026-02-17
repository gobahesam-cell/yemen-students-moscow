import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, encodeSession } from "@/lib/session-core";

function clearCookie(res: NextResponse, path: string) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path,
    maxAge: 0,
  });
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      name: true,
      nameRu: true,
    }
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // ✅ مدة الجلسة 7 أيام
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 24 * 60 * 60;

  const token = await encodeSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    nameRu: user.nameRu,
    exp,
  });

  const res = NextResponse.json({ ok: true, role: user.role });

  // ✅ تنظيف أي كوكي قديمة بنفس الاسم على Paths مختلفة
  clearCookie(res, "/admin");
  clearCookie(res, "/ar/admin");
  clearCookie(res, "/ru/admin");
  clearCookie(res, "/api");
  clearCookie(res, "/api/auth");

  // ✅ تثبيت الكوكي الجديدة على Path=/ (مهم)
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",                 // ✅ هذا المطلوب
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}
