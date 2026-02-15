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
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-slate-950 rounded-[3rem] lg:rounded-[4rem] p-12 lg:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
        >
            {/* Ultra-Premium Gradient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-30%] right-[-10%] w-[80%] h-[80%] bg-yellow-500/20 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-center [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20" />
            </div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-12">
                {/* Text Content */}
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-wrap items-center gap-4 mb-8"
                    >
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-yellow-500 shadow-2xl">
                            ✨ {t("welcome", { name: userName || t("nav.roles.MEMBER") })}
                        </span>
                        {draftsCount > 0 && (
                            <span className="px-5 py-2 bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">
                                {draftsCount} {t("stats.drafts")}
                            </span>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-5xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.85]"
                    >
                        {t("dashboard")}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600">
                            {t(`nav.roles.${role}` as any)}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="text-slate-400 text-xl lg:text-2xl font-bold font-medium leading-tight max-w-2xl opacity-80"
                    >
                        {t("welcomeMsg", { count: draftsCount })}
                    </motion.p>
                </div>

                {/* Refined Glassy Actions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
                    className="flex flex-wrap items-center gap-6"
                >
                    <Link
                        href="/admin/posts/new"
                        className="
                            group relative overflow-hidden flex items-center gap-4 px-12 py-6 
                            bg-yellow-500 text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.2em]
                            shadow-[0_20px_50px_-10px_rgba(234,179,8,0.4)] transition-all duration-500 
                            hover:-translate-y-2 hover:scale-[1.05] active:scale-95
                        "
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <Plus size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                        <span className="relative z-10">{t("banner.newPost")}</span>
                    </Link>

                    <Link
                        href="/admin/posts"
                        className="
                            flex items-center gap-4 px-12 py-6 bg-white/5 backdrop-blur-2xl text-white 
                            rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] 
                            hover:bg-white/10 transition-all border border-white/10 group
                            hover:-translate-y-1 active:scale-95
                        "
                    >
                        <TrendingUp size={20} className="group-hover:translate-y-[-4px] group-hover:translate-x-[4px] transition-transform duration-500" />
                        <span>{t("activity.viewAll")}</span>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
