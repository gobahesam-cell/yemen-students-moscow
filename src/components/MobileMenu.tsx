"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Home, Newspaper, Calendar, Image as ImageIcon,
  BookOpen, Heart, Info, Mail, Globe, Sun, Moon, ChevronLeft, ChevronRight
} from "lucide-react";
import { useTheme } from "next-themes";

type NavItem = { href: string; label: string };

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "/": Home,
  "/news": Newspaper,
  "/events": Calendar,
  "/gallery": ImageIcon,
  "/courses": BookOpen,
  "/donate": Heart,
  "/about": Info,
  "/contact": Mail,
};

type SessionInfo = {
  name?: string | null;
  nameRu?: string | null;
  role?: string;
} | null;

export default function MobileMenu({
  locale,
  items,
  session,
}: {
  locale: "ar" | "ru";
  items: NavItem[];
  session?: SessionInfo;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isRTL = locale === "ar";
  const title = locale === "ar" ? "الجالية اليمنية" : "Йеменская община";
  const subtitle = locale === "ar" ? "موسكو" : "Москва";

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + ESC
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activePath = useMemo(() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    const withoutLocale =
      parts[0] === "ar" || parts[0] === "ru" ? parts.slice(1) : parts;
    return "/" + withoutLocale.join("/");
  }, [pathname]);

  return (
    <>
      {/* Burger button */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden relative z-[100] inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="sr-only">Menu</span>
        <Menu size={20} />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              dir={isRTL ? "rtl" : "ltr"}
              className={`absolute top-0 h-full w-[85%] max-w-[340px] ${isRTL ? "right-0" : "left-0"} bg-white dark:bg-slate-900 shadow-2xl flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-yellow-500 to-amber-500">
                <div className="leading-tight">
                  <div className="text-base font-bold text-black">
                    {title}
                  </div>
                  <div className="text-xs font-medium text-black/70">
                    {subtitle}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 rounded-xl bg-black/10 hover:bg-black/20 transition flex items-center justify-center text-black"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {items.map((it, i) => {
                    const active =
                      it.href === "/"
                        ? activePath === "/"
                        : activePath.startsWith(it.href);

                    const Icon = iconMap[it.href] || Newspaper;
                    const Chevron = isRTL ? ChevronLeft : ChevronRight;

                    return (
                      <motion.li
                        key={it.href}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={`/${locale}${it.href}`}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all ${active
                            ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 text-yellow-600 dark:text-yellow-400 font-semibold shadow-sm"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                          <div className={`p-2 rounded-lg ${active ? "bg-yellow-500 text-black" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                            <Icon size={18} />
                          </div>
                          <span className="flex-1">{it.label}</span>
                          <Chevron size={16} className="opacity-40" />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer Actions */}
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                {/* Theme & Language Row */}
                <div className="flex items-center gap-2">
                  {/* Theme Toggle */}
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    <span className="text-sm">{theme === "dark" ? (locale === "ar" ? "فاتح" : "Светлый") : (locale === "ar" ? "داكن" : "Тёмный")}</span>
                  </button>

                  {/* Language Switch */}
                  <Link
                    href={`/${locale === "ar" ? "ru" : "ar"}${activePath === "/" ? "" : activePath}`}
                    onClick={() => setOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Globe size={18} />
                    <span className="text-sm">{locale === "ar" ? "Русский" : "العربية"}</span>
                  </Link>
                </div>

                {/* User Info or Login Button */}
                {session ? (
                  <Link
                    href={session.role === "MEMBER" ? "/account" : "/admin"}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold transition-colors hover:from-yellow-400 hover:to-amber-400 shadow-md"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black text-sm font-bold">
                      {(locale === "ru" && session.nameRu ? session.nameRu?.[0] : session.name?.[0]) || "U"}
                    </div>
                    <span>{locale === "ru" ? (session.nameRu || session.name) : session.name}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold transition-colors hover:from-yellow-400 hover:to-amber-400 shadow-md"
                  >
                    {locale === "ar" ? "تسجيل الدخول" : "Войти"}
                  </Link>
                )}

                {/* Copyright */}
                <div className="text-xs text-center text-slate-500 dark:text-slate-500 pt-2">
                  © {new Date().getFullYear()} {title}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
