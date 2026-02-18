"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Users, Calendar, BookOpen, Heart } from "lucide-react";

export default function Hero() {
    const t = useTranslations("Home");
    const locale = useLocale() as "ar" | "ru";
    const isRTL = locale === "ar";

    const Arrow = isRTL ? ArrowLeft : ArrowRight;

    const quickStats = [
        { icon: Users, value: "500+", label: locale === "ar" ? "عضو" : "Участников" },
        { icon: Calendar, value: "50+", label: locale === "ar" ? "فعالية" : "Событий" },
        { icon: BookOpen, value: "20+", label: locale === "ar" ? "دورة" : "Курсов" },
    ];

    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* ===== BACKGROUND ===== */}
            <div className="absolute inset-0">
                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/20 dark:bg-yellow-500/15 rounded-full blur-[150px] -translate-y-1/2"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-[120px] translate-y-1/3"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
                />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* ===== CONTENT ===== */}
            <div className="relative z-10 container mx-auto px-4 max-w-7xl py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Text Side */}
                    <div className={`space-y-8 ${isRTL ? "text-right" : "text-left"}`}>
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                <Sparkles size={14} className="animate-pulse" />
                                {locale === "ar" ? "الموقع الرسمي للجالية" : "Официальный сайт"}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight">
                                <span className="text-slate-900 dark:text-white">
                                    {t("heroTitle")}
                                </span>
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="inline-block px-4 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-lg shadow-lg shadow-yellow-500/20">
                                    {locale === "ar" ? "موسكو" : "Москва"}
                                </span>
                                <span className="text-2xl text-slate-400 dark:text-slate-500">—</span>
                                <span className="text-2xl text-slate-500 dark:text-slate-400 font-medium">
                                    {locale === "ar" ? "روسيا" : "Россия"}
                                </span>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
                        >
                            {t("heroDesc")}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link
                                href={`/${locale}/news`}
                                className="group inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl text-black font-bold shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
                            >
                                {t("ctaNews")}
                                <Arrow size={18} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                            </Link>
                            <Link
                                href={`/${locale}/donate`}
                                className="group inline-flex items-center gap-2 px-7 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold hover:border-rose-300 dark:hover:border-rose-500/30 hover:shadow-lg transition-all duration-300"
                            >
                                <Heart size={18} className="text-rose-500" />
                                {locale === "ar" ? "ادعم الجالية" : "Поддержать"}
                            </Link>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-6 pt-6 border-t border-slate-200 dark:border-slate-800"
                        >
                            {quickStats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                                        <stat.icon size={18} className="text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="hidden lg:flex justify-center items-center relative"
                    >
                        {/* Decorative Rings */}
                        <div className="absolute w-[450px] h-[450px]">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-dashed border-slate-300 dark:border-slate-700"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-8 rounded-full border border-slate-200 dark:border-slate-800"
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-16 rounded-full border border-dashed border-yellow-300 dark:border-yellow-500/30"
                            />
                        </div>

                        {/* Logo */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-72 h-72"
                        >
                            {/* Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-400/20 dark:from-yellow-500/20 dark:to-transparent blur-3xl rounded-full" />
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute top-10 right-20 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
                        >
                            <Calendar className="text-yellow-500" size={24} />
                        </motion.div>
                        <motion.div
                            animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
                            transition={{ duration: 12, repeat: Infinity }}
                            className="absolute bottom-20 left-10 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
                        >
                            <Users className="text-blue-500" size={24} />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
