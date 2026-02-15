"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon, Users, Newspaper, FileEdit, Pin } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: "blue" | "green" | "orange" | "purple" | "yellow" | "cyan";
    trend?: string;
    index?: number;
}

const colorConfig = {
    blue: {
        bg: "bg-blue-600",
        light: "bg-blue-500/10",
        text: "text-blue-500",
        glow: "hover:shadow-blue-500/20",
        gradient: "from-blue-600/20 to-transparent",
    },
    green: {
        bg: "bg-emerald-600",
        light: "bg-emerald-500/10",
        text: "text-emerald-500",
        glow: "hover:shadow-emerald-500/20",
        gradient: "from-emerald-600/20 to-transparent",
    },
    orange: {
        bg: "bg-orange-600",
        light: "bg-orange-500/10",
        text: "text-orange-500",
        glow: "hover:shadow-orange-500/20",
        gradient: "from-orange-600/20 to-transparent",
    },
    purple: {
        bg: "bg-purple-600",
        light: "bg-purple-500/10",
        text: "text-purple-500",
        glow: "hover:shadow-purple-500/20",
        gradient: "from-purple-600/20 to-transparent",
    },
    yellow: {
        bg: "bg-yellow-500",
        light: "bg-yellow-500/10",
        text: "text-yellow-500",
        glow: "hover:shadow-yellow-500/20",
        gradient: "from-yellow-500/20 to-transparent",
    },
    cyan: {
        bg: "bg-cyan-600",
        light: "bg-cyan-500/10",
        text: "text-cyan-500",
        glow: "hover:shadow-cyan-500/20",
        gradient: "from-cyan-600/20 to-transparent",
    },
};

export function StatCard({ title, value, icon: Icon, color, trend, index = 0 }: StatCardProps) {
    const [count, setCount] = useState(0);
    const config = colorConfig[color];

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const duration = 1500;
        const totalFrames = Math.round(duration / 16);
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.round(start + (end - start) * easeOutExpo);

            setCount(currentCount);

            if (frame === totalFrames) clearInterval(timer);
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className={`
                relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 
                rounded-[2.5rem] p-8 shadow-sm ${config.glow} hover:shadow-2xl
                transition-all duration-500 cursor-pointer overflow-hidden group
            `}
        >
            {/* Ambient Background Gradient */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            {/* Top Row: Icon and Trend */}
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${config.light} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-black/5`}>
                    <Icon className={config.text} size={28} />
                </div>
                {trend && (
                    <div className={`
                        px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase
                        ${trend.includes('+')
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }
                    `}>
                        {trend}
                    </div>
                )}
            </div>

            {/* Value Section */}
            <div className="relative z-10">
                <div className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter leading-none">
                    {count.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {title}
                </div>
            </div>

            {/* Subtle Progress Interaction */}
            <motion.div
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                className={`absolute bottom-0 left-0 h-1.5 ${config.bg} opacity-20`}
                transition={{ duration: 1 }}
            />
        </motion.div>
    );
}

// Export icon mapping for use in StatsGrid
export const statIcons = {
    users: Users,
    news: Newspaper,
    drafts: FileEdit,
    pinned: Pin,
};
