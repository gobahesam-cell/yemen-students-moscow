"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/navItems";

export default function NavLinks() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  const base = `/${locale}`;
  const current = pathname.startsWith(base) ? pathname.slice(base.length) || "" : "";

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((it) => {
        const href = `${base}${it.path}`;
        const active = current === it.path || (it.path === "" && current === "");

        return (
          <Link
            key={it.key}
            href={href}
            className={[
              "rounded-xl px-3 py-2 text-sm font-semibold transition whitespace-nowrap",
              active
                ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-white/5"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white",
            ].join(" ")}
          >
            {t(it.key)}
          </Link>
        );
      })}
    </nav>
  );
}