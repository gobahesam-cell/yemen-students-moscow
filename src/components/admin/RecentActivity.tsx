"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Clock, ArrowLeft, UserPlus, FileText } from "lucide-react";

interface Post {
    id: string;
    title: string;
    isDraft: boolean;
    isPinned: boolean;
    createdAt: Date;
}

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: Date;
}

interface RecentActivityProps {
    latestPosts: Post[];
    latestUsers: User[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
};

export function RecentActivity({ latestPosts, latestUsers }: RecentActivityProps) {
    const t = useTranslations("Admin.activity");
    const locale = useLocale();

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Latest News */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                            <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {t("latestPosts")}
                        </h2>
                    </div>
                    <Link
                        href="/admin/posts"
                        className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                    >
                        {t("viewAll")}
                        <ArrowLeft size={16} />
                    </Link>
                </div>

                {/* Content */}
                <div className="p-4">
                    {latestPosts.length === 0 ? (
                        <EmptyState icon="📰" label={t("emptyPosts")} />
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
                            {latestPosts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    variants={item}
                                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    {/* Status Indicator */}
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${p.isDraft ? "bg-orange-400" : "bg-green-400"}`} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {p.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                            <Clock size={12} />
                                            <span>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(p.createdAt))}</span>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex gap-2 shrink-0">
                                        {p.isPinned && <Badge label="📌" variant="purple" />}
                                        <Badge
                                            label={p.isDraft ? t("draft") : t("published")}
                                            variant={p.isDraft ? "orange" : "green"}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Latest Users */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-xl">
                            <UserPlus className="text-pink-600 dark:text-pink-400" size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {t("latestUsers")}
                        </h2>
                    </div>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-1 text-sm font-bold text-pink-600 dark:text-pink-400 hover:gap-2 transition-all"
                    >
                        {t("viewAll")}
                        <ArrowLeft size={16} />
                    </Link>
                </div>

                {/* Content */}
                <div className="p-4">
                    {latestUsers.length === 0 ? (
                        <EmptyState icon="👥" label={t("emptyUsers")} />
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
                            {latestUsers.map((u, i) => (
                                <motion.div
                                    key={u.id}
                                    variants={item}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    {/* Avatar */}
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${getGradient(i)})`
                                        }}
                                    >
                                        {u.name ? u.name[0].toUpperCase() : "?"}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 dark:text-white truncate">
                                            {u.name ?? t("noName")}
                                        </div>
                                        <div className="text-sm text-slate-400 truncate">
                                            {u.email}
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <Badge
                                        label={u.role === "ADMIN" ? t("roleAdmin") : t("roleMember")}
                                        variant={u.role === "ADMIN" ? "purple" : "gray"}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
    return (
        <div className="py-12 text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <div className="text-slate-400 font-medium">{label}</div>
        </div>
    );
}

function Badge({ label, variant }: { label: string; variant: "green" | "orange" | "purple" | "gray" }) {
    const styles = {
        green: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
        orange: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
        gray: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${styles[variant]}`}>
            {label}
        </span>
    );
}

function getGradient(index: number) {
    const gradients = [
        "#3b82f6, #06b6d4",
        "#8b5cf6, #ec4899",
        "#10b981, #14b8a6",
        "#f59e0b, #f97316",
        "#6366f1, #8b5cf6",
    ];
    return gradients[index % gradients.length];
}
