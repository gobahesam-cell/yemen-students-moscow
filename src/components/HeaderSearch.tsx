"use client";

import { useTranslations } from "next-intl";

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HeaderSearch() {
  const t = useTranslations("Nav");

  return (
    <div className="hidden items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-2 shadow-sm lg:flex transition-colors">
      <SearchIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <input
        disabled
        className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-500 text-slate-900 dark:text-white disabled:cursor-not-allowed"
        placeholder={t("searchPlaceholder")}
      />
    </div>
  );
}