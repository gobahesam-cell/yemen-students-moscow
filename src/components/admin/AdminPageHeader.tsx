"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        href: string;
        icon?: ReactNode;
    };
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 pb-12 border-b border-slate-200/50 dark:border-white/5"
        >
            <div className="max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                >
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-4">
                        {title}
                    </h1>
                </motion.div>
                {description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-slate-500 dark:text-slate-400 font-bold text-lg lg:text-xl leading-relaxed max-w-2xl"
                    >
                        {description}
                    </motion.p>
                )}
            </div>

            {action && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                >
                    <Link
                        href={action.href}
                        className="
                            group relative overflow-hidden flex items-center gap-4 px-10 py-5 
                            bg-slate-900 dark:bg-yellow-500 text-white dark:text-black 
                            rounded-3xl font-black text-xs uppercase tracking-[0.2em]
                            shadow-2xl shadow-black/10 dark:shadow-yellow-500/20 
                            transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] active:scale-95
                        "
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                        <span className="relative z-10">{action.label}</span>
                        <div className="relative z-10 w-8 h-8 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                            {action.icon || <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />}
                        </div>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
