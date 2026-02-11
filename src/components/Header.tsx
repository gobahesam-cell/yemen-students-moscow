import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import NavLinks from "@/components/NavLinks";
import LocaleSwitcherIcon from "@/components/LocaleSwitcherIcon";
import MobileMenu from "@/components/MobileMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { navItems } from "@/components/navItems";
import { User, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { logoutAction } from "@/app/actions/auth";

export default async function Header() {
  const t = await getTranslations("Nav");
  const locale = (await getLocale()) as "ar" | "ru";

  // فحص الجلسة من السيرفر
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decodeSession(sessionToken);

  const menuItems = navItems.map((it) => ({
    href: it.path === "" ? "/" : it.path,
    label: t(it.key),
  }));

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 md:h-18 items-center justify-between gap-4">

          {/* Logo Area */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative h-10 w-10 md:h-11 md:w-11 transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-500/20 blur-xl rounded-full opacity-60 group-hover:opacity-80 transition-opacity" />
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-md relative z-10"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                {locale === "ar" ? "الجالية اليمنية" : "Йеменская община"}
              </span>
              <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">
                {locale === "ar" ? "موسكو • الموقع الرسمي" : "Москва • Официальный сайт"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLinks />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3 ml-2">
              <LocaleSwitcherIcon />
              <ThemeToggle />
            </div>

            {session ? (
              /* Logged In State */
              <div className="flex items-center gap-3">
                <Link
                  href={session.role === "MEMBER" ? "/account" : "/admin"}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900">
                    {(locale === "ru" && session.nameRu ? session.nameRu?.[0] : session.name?.[0]) || "U"}
                  </div>
                  <span className="hidden sm:inline text-sm font-bold text-slate-700 dark:text-slate-300">
                    {locale === "ru" ? (session.nameRu || session.name) : session.name}
                  </span>
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title={t("logout" as any)}
                  >
                    <LogOut size={18} />
                  </button>
                </form>
              </div>
            ) : (
              /* Logged Out State */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold text-sm transition-all"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black rounded-xl font-bold text-sm transition-all shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30"
                >
                  {t("register" as any)}
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileMenu locale={locale} items={menuItems} session={session} />
          </div>
        </div>
      </div >
    </header >
  );
}
