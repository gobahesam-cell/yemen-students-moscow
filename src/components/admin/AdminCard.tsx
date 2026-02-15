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
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`
                bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl
                border border-slate-200/50 dark:border-white/5 
                rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] 
                hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] 
                transition-all duration-700
                ${noPadding ? "" : "p-10"}
                ${className}
            `}
        >
            {(title || description) && (
                <div className={`mb-10 ${noPadding ? "px-10 pt-10" : ""}`}>
                    {title && (
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            )}
            <div className="relative">
                {children}
            </div>
        </motion.div>
    );
}
