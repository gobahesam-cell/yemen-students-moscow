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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5"
        >
            <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm lg:text-base">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/10 active:scale-95"
                    >
                        {action.icon || <Plus size={18} />}
                        {action.label}
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
