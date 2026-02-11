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
        bg: "bg-blue-500",
        light: "bg-blue-50 dark:bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        glow: "shadow-blue-500/20",
    },
    green: {
        bg: "bg-green-500",
        light: "bg-green-50 dark:bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        glow: "shadow-green-500/20",
    },
    orange: {
        bg: "bg-orange-500",
        light: "bg-orange-50 dark:bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
        glow: "shadow-orange-500/20",
    },
    purple: {
        bg: "bg-purple-500",
        light: "bg-purple-50 dark:bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
        glow: "shadow-purple-500/20",
    },
    yellow: {
        bg: "bg-yellow-500",
        light: "bg-yellow-50 dark:bg-yellow-500/10",
        text: "text-yellow-600 dark:text-yellow-400",
        glow: "shadow-yellow-500/20",
    },
    cyan: {
        bg: "bg-cyan-500",
        light: "bg-cyan-50 dark:bg-cyan-500/10",
        text: "text-cyan-600 dark:text-cyan-400",
        glow: "shadow-cyan-500/20",
    },
};

export function StatCard({ title, value, icon: Icon, color, trend, index = 0 }: StatCardProps) {
    const [count, setCount] = useState(0);
    const config = colorConfig[color];

    useEffect(() => {
        const duration = 1000;
        const steps = 40;
        const stepTime = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`
                relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 
                rounded-2xl p-6 shadow-sm hover:shadow-xl ${config.glow}
                transition-shadow duration-300 cursor-pointer overflow-hidden group
            `}
        >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${config.light} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={config.text} size={24} />
                </div>
                {trend && (
                    <span className={`
                        text-xs font-bold px-2.5 py-1 rounded-full
                        ${trend.includes('+')
                            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }
                    `}>
                        {trend}
                    </span>
                )}
            </div>

            {/* Value */}
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                {count.toLocaleString("ar-EG")}
            </div>

            {/* Title */}
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {title}
            </div>

            {/* Decorative Bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
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
