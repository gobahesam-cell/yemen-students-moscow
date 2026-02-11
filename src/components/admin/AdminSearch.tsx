"use client";

import { useTranslations } from "next-intl";

export function AdminSearch() {
    const t = useTranslations("Admin");

    return (
        <div className="hidden md:flex items-center w-full max-w-md bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-2.5 border border-transparent focus-within:border-slate-200 dark:focus-within:border-white/10 transition-all group">
            <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="bg-transparent border-none outline-none text-sm w-full mx-3 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
            <div className="hidden lg:flex gap-1">
                <span className="text-[10px] font-bold bg-white dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-white/5 shadow-sm">Ctrl</span>
                <span className="text-[10px] font-bold bg-white dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-white/5 shadow-sm">K</span>
            </div>
        </div>
    );
}
