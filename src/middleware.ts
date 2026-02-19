import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/routing";
import { decodeSession, COOKIE_NAME } from "./lib/session-core";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

function isAdminPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/ar/admin" ||
    pathname.startsWith("/ar/admin/") ||
    pathname === "/ru/admin" ||
    pathname.startsWith("/ru/admin/")
  );
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ 1) حماية لوحة التحكم
  if (isAdminPath(pathname)) {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
    const session = await decodeSession(cookieValue);

    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    const ALLOWED_ROLES = ["ADMIN", "EDITOR", "INSTRUCTOR"];

    if (!ALLOWED_ROLES.includes(session.role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // ✅ قيود إضافية بناءً على المسار
    const ADMIN_ONLY_PATHS = ["/admin/users", "/admin/settings", "/admin/members", "/admin/support"];
    const isAdminOnlyPath = ADMIN_ONLY_PATHS.some(p => pathname.includes(p));
    if (isAdminOnlyPath && session.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    // ✅ تمرير اللغة من الـ cookie للـ server components
    const adminLocale = req.cookies.get("NEXT_LOCALE")?.value || "ar";
    const response = NextResponse.next();
    response.headers.set("x-next-intl-locale", adminLocale);
    return response;
  }

  // ✅ 2) حماية صفحات تسجيل الدخول والتسجيل (أياً كانت اللغة)
  const isAuthPage = /^\/(ar|ru)?\/(login|register)$/.test(pathname) || pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
    const session = await decodeSession(cookieValue);

    // إذا مسجل دخول، لا تسمح بفتح login/register
    if (session) {
      const url = req.nextUrl.clone();
      const DASHBOARD_ROLES = ["ADMIN", "EDITOR", "INSTRUCTOR"];
      url.pathname = DASHBOARD_ROLES.includes(session.role) ? "/admin" : "/account";
      // ملاحظة: قد يحتاج /account إلى سبيكة لغة، لكن intlMiddleware سيتولى ذلك إذا مررناه
      return NextResponse.redirect(url);
    }

    // غير مسجل دخول: استمر لـ intlMiddleware ليقوم بالترجمة
  }

  // ✅ 3) باقي الموقع: i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // استثناءات مهمة: نستثني api بالكامل من الـ middleware لتجنب التداخل
    "/((?!api|_next|.*\\..*).*)",
  ],
};
