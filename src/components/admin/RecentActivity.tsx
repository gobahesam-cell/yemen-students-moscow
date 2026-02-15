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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Latest News Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5"
            >
                {/* Custom Header */}
                <div className="flex items-center justify-between p-10 border-b border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/5">
                            <FileText className="text-blue-500" size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {t("latestPosts")}
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Content Pipeline
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/posts"
                        className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-white/10 transition-all group shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:translate-x-[-4px] transition-transform duration-300" />
                    </Link>
                </div>

                {/* News Feed */}
                <div className="p-8">
                    {latestPosts.length === 0 ? (
                        <EmptyState icon="📰" label={t("emptyPosts")} />
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                            {latestPosts.map((p) => (
                                <motion.div
                                    key={p.id}
                                    variants={item}
                                    className="group flex items-center gap-6 p-6 rounded-[2rem] hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all duration-500 cursor-pointer shadow-none hover:shadow-2xl hover:shadow-black/5 active:scale-[0.98]"
                                >
                                    {/* Visual Indicator */}
                                    <div className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-lg ${p.isDraft ? "bg-amber-400 shadow-amber-400/20" : "bg-emerald-400 shadow-emerald-400/20"}`} />

                                    {/* Info Section */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-blue-500 transition-colors tracking-tight">
                                            {p.title}
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 mt-2 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                                <Clock size={12} />
                                                <span>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(p.createdAt))}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Badges */}
                                    <div className="flex gap-2 shrink-0">
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

            {/* Latest Users Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5"
            >
                {/* Custom Header */}
                <div className="flex items-center justify-between p-10 border-b border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/5">
                            <UserPlus className="text-rose-500" size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {t("latestUsers")}
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Community Growth
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/users"
                        className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-white/10 transition-all group shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:translate-x-[-4px] transition-transform duration-300" />
                    </Link>
                </div>

                {/* Users Feed */}
                <div className="p-8">
                    {latestUsers.length === 0 ? (
                        <EmptyState icon="👥" label={t("emptyUsers")} />
                    ) : (
                        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                            {latestUsers.map((u, i) => (
                                <motion.div
                                    key={u.id}
                                    variants={item}
                                    className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all duration-500 group cursor-pointer active:scale-[0.98]"
                                >
                                    {/* Modern Avatar */}
                                    <div
                                        className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-white text-lg shrink-0 shadow-2xl shadow-black/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
                                        style={{
                                            background: `linear-gradient(135deg, ${getGradient(i)})`
                                        }}
                                    >
                                        {u.name ? u.name[0].toUpperCase() : "?"}
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">
                                            {u.name ?? t("noName")}
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 truncate mt-1">
                                            {u.email}
                                        </div>
                                    </div>

                                    {/* Role Identity */}
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
        <div className="py-20 text-center">
            <div className="text-6xl mb-6 filter grayscale opacity-20">{icon}</div>
            <div className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">{label}</div>
        </div>
    );
}

function Badge({ label, variant }: { label: string; variant: "green" | "orange" | "purple" | "gray" }) {
    const styles = {
        green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        orange: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
        gray: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5",
    };

    return (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${styles[variant]}`}>
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
