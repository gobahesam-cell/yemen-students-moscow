"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus, TrendingUp } from "lucide-react";

interface WelcomeBannerProps {
    draftsCount: number;
    userName?: string;
    role?: string;
}

export function WelcomeBanner({ draftsCount, userName, role = "MEMBER" }: WelcomeBannerProps) {
    const t = useTranslations("Admin");

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-3xl p-8 lg:p-10"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Text Content */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-3"
                    >
                        <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold text-white/80">
                            👋 {t("welcome", { name: userName || t("nav.roles.MEMBER") })}
                        </span>
                        {draftsCount > 0 && (
                            <span className="px-3 py-1 bg-orange-500/20 rounded-full text-xs font-bold text-orange-300 animate-pulse">
                                {draftsCount} {t("stats.drafts")}
                            </span>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight"
                    >
                        {t("dashboard")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            {t(`nav.roles.${role}` as any)}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/60 text-base lg:text-lg max-w-lg"
                    >
                        {t("welcomeMsg", { count: draftsCount })}
                    </motion.p>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3"
                >
                    <Link
                        href="/admin/posts/new"
                        className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg shadow-black/20 active:scale-95"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        {t("banner.newPost")}
                    </Link>
                    <Link
                        href="/admin/posts"
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all border border-white/10"
                    >
                        <TrendingUp size={18} />
                        {t("activity.viewAll")}
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
