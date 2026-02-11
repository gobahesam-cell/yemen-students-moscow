"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  const nextLocale = locale === "ar" ? "ru" : "ar";
  const parts = pathname.split("/");
  parts[1] = nextLocale;
  const href = parts.join("/");

  return (
    <Link
      href={href}
      className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50"
    >
      {t("switchTo")}
    </Link>
  );
}