"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AdminCardProps {
    children: ReactNode;
    title?: string;
    description?: string;
    className?: string;
    delay?: number;
    noPadding?: boolean;
}

export function AdminCard({
    children,
    title,
    description,
    className = "",
    delay = 0,
    noPadding = false
}: AdminCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay * 0.1 }}
            className={`
                bg-white dark:bg-slate-900 
                border border-slate-100 dark:border-white/5 
                rounded-2xl shadow-sm
                ${noPadding ? "" : "p-6"}
                ${className}
            `}
        >
            {(title || description) && (
                <div className={`mb-6 ${noPadding ? "px-6 pt-6" : ""}`}>
                    {title && (
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </motion.div>
    );
}
