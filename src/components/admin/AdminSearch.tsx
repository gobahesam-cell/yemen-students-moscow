"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function AdminSearch() {
    const t = useTranslations("Admin");

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
                hidden md:flex items-center w-full max-w-md 
                bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                rounded-2xl px-5 py-2.5 
                border-2 border-transparent focus-within:border-yellow-500/50 
                focus-within:bg-white dark:focus-within:bg-white/10
                transition-all duration-300 group shadow-sm
            `}
        >
            <Search
                size={18}
                className="text-slate-400 group-focus-within:text-yellow-600 transition-colors"
            />
            <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="bg-transparent border-none outline-none text-sm w-full mx-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-bold"
            />
            <div className="hidden lg:flex gap-1.5">
                <kbd className="text-[10px] font-black bg-slate-900 dark:bg-yellow-500 text-white dark:text-black px-2 py-0.5 rounded-lg border-b-2 border-slate-700 dark:border-yellow-600 shadow-sm opacity-60 group-focus-within:opacity-100 transition-opacity">Ctrl</kbd>
                <kbd className="text-[10px] font-black bg-slate-900 dark:bg-yellow-500 text-white dark:text-black px-2 py-0.5 rounded-lg border-b-2 border-slate-700 dark:border-yellow-600 shadow-sm opacity-60 group-focus-within:opacity-100 transition-opacity">K</kbd>
            </div>
        </motion.div>
    );
}
