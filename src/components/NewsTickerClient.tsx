"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";

interface NewsTickerClientProps {
    news: { id: string; title: string; titleRu?: string | null }[];
    locale: string;
    label: string;
}

export default function NewsTickerClient({ news, locale, label }: NewsTickerClientProps) {
    const isRTL = locale === "ar";

    return (
        <div className="relative z-40 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 text-black overflow-hidden shadow-lg">
            <div className="container mx-auto max-w-7xl flex items-center h-11">

                {/* Label Badge */}
                <div className={`flex items-center gap-2 h-full bg-yellow-600/90 backdrop-blur-sm px-4 md:px-5 font-bold text-xs md:text-sm uppercase tracking-wider relative z-10 shrink-0`}>
                    <Megaphone size={16} className="animate-pulse" />
                    <span className="hidden sm:inline">{label}</span>

                    {/* Slanted edge */}
                    <div className={`absolute top-0 w-4 h-full bg-yellow-600/90 transform ${isRTL ? "skew-x-[20deg] -left-2" : "skew-x-[-20deg] -right-2"}`} />
                </div>

                {/* Marquee Content */}
                <div className="flex-1 overflow-hidden relative flex items-center px-4">
                    <motion.div
                        className="whitespace-nowrap flex items-center gap-8"
                        animate={{ x: isRTL ? ["0%", "33.333%"] : ["0%", "-33.333%"] }}
                        transition={{
                            duration: news.length * 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {/* Duplicate content for seamless loop */}
                        {[...news, ...news, ...news].map((item, i) => {
                            const displayTitle = locale === "ru" && item.titleRu ? item.titleRu : item.title;
                            return (
                                <Link
                                    key={`${item.id}-${i}`}
                                    href={`/${locale}/news/${item.id}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-2 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-black/50 shrink-0" />
                                    <span className="max-w-[400px] truncate">{displayTitle}</span>
                                </Link>
                            );
                        })}
                    </motion.div>
                </div>

                {/* View All Link */}
                <Link
                    href={`/${locale}/news`}
                    className={`hidden md:flex items-center gap-1 h-full px-4 bg-black/10 hover:bg-black/20 transition-colors text-xs font-bold shrink-0`}
                >
                    {locale === "ar" ? "جميع الأخبار" : "Все новости"}
                    <span className={isRTL ? "rotate-180" : ""}>→</span>
                </Link>

            </div>
        </div>
    );
}
