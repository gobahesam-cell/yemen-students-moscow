"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
    Users, Newspaper, GraduationCap, FileEdit, CalendarDays,
    Plus, ArrowRight, Clock, Sparkles, TrendingUp
} from "lucide-react";

interface Props {
    userName?: string;
    userRole: string;
    stats: {
        usersCount: number;
        publishedCount: number;
        draftsCount: number;
        studentsCount: number;
        coursesCount: number;
        eventsCount: number;
    };
    latestPosts: { id: string; title: string; isDraft: boolean; createdAt: string }[];
    latestUsers: { id: string; name: string | null; email: string | null; role: string; createdAt: string }[];
}

export default function AdminDashboardClient({ userName, userRole, stats, latestPosts, latestUsers }: Props) {
    const t = useTranslations("Admin");
    const locale = useLocale();
    const isRTL = locale === "ar";

    // بطاقات الإحصائيات حسب الدور
    const statCards = [
        userRole !== "INSTRUCTOR" && {
            icon: Newspaper, label: t("stats.news"), value: stats.publishedCount,
            color: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        },
        userRole === "ADMIN" && {
            icon: Users, label: t("stats.users"), value: stats.usersCount,
            color: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
        userRole !== "EDITOR" && {
            icon: GraduationCap, label: t("stats.courses"), value: stats.coursesCount,
            color: "bg-violet-500", light: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
        },
        userRole !== "EDITOR" && {
            icon: Users, label: t("stats.students"), value: stats.studentsCount,
            color: "bg-cyan-500", light: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        },
        userRole !== "INSTRUCTOR" && {
            icon: FileEdit, label: t("stats.drafts"), value: stats.draftsCount,
            color: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        },
        {
            icon: CalendarDays, label: isRTL ? "الفعاليات" : "Мероприятия", value: stats.eventsCount,
            color: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
        },
    ].filter(Boolean) as any[];

    return (
        <div className="space-y-6">
            {/* ═══════════ WELCOME BANNER ═══════════ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white"
            >
                <div className="absolute inset-0">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-500/15 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/15 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-400/80 uppercase tracking-wider">
                                {t("welcome", { name: userName || "" })}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            {t("dashboard")}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
                                {t(`nav.roles.${userRole}` as any)}
                            </span>
                        </h1>
                        {stats.draftsCount > 0 && userRole !== "INSTRUCTOR" && (
                            <p className="text-sm text-blue-200/60 mt-1">
                                {stats.draftsCount} {t("stats.drafts")} {isRTL ? "بانتظار النشر" : "ожидают публикации"}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/admin/posts/new"
                            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl transition-colors"
                        >
                            <Plus size={16} />
                            {t("banner.newPost")}
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* ═══════════ STATS GRID ═══════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {statCards.map((card: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
                    >
                        <div className={`w-9 h-9 rounded-lg ${card.light} flex items-center justify-center mb-3`}>
                            <card.icon size={18} />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* ═══════════ QUICK ACTIONS ═══════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: isRTL ? "إضافة خبر" : "Добавить новость", href: "/admin/posts/new", icon: Newspaper, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
                    { label: isRTL ? "إضافة فعالية" : "Добавить мероприятие", href: "/admin/events", icon: CalendarDays, color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" },
                    { label: isRTL ? "إضافة دورة" : "Добавить курс", href: "/admin/courses", icon: GraduationCap, color: "text-violet-500 bg-violet-50 dark:bg-violet-500/10" },
                    { label: isRTL ? "الإعدادات" : "Настройки", href: "/admin/settings", icon: TrendingUp, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all group"
                    >
                        <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                            <action.icon size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* ═══════════ RECENT ACTIVITY ═══════════ */}
            {(userRole === "ADMIN" || userRole === "EDITOR") && (
                <div className="grid lg:grid-cols-2 gap-4">
                    {/* آخر الأخبار */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Newspaper size={16} />
                                </div>
                                <h2 className="font-black text-slate-900 dark:text-white text-sm">{t("activity.latestPosts")}</h2>
                            </div>
                            <Link href="/admin/posts" className="text-xs font-bold text-blue-500 hover:text-blue-600">
                                {t("activity.viewAll")} →
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {latestPosts.length === 0 ? (
                                <div className="py-10 text-center text-slate-400 text-sm">{t("activity.emptyPosts")}</div>
                            ) : (
                                latestPosts.map(p => (
                                    <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${p.isDraft ? "bg-amber-400" : "bg-emerald-400"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{p.title}</div>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                                <Clock size={10} />
                                                {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(p.createdAt))}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.isDraft
                                                ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            }`}>
                                            {p.isDraft ? t("activity.draft") : t("activity.published")}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* آخر المستخدمين */}
                    {userRole === "ADMIN" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                                        <Users size={16} />
                                    </div>
                                    <h2 className="font-black text-slate-900 dark:text-white text-sm">{t("activity.latestUsers")}</h2>
                                </div>
                                <Link href="/admin/users" className="text-xs font-bold text-rose-500 hover:text-rose-600">
                                    {t("activity.viewAll")} →
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {latestUsers.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400 text-sm">{t("activity.emptyUsers")}</div>
                                ) : (
                                    latestUsers.map((u, i) => (
                                        <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
                                                style={{ background: `linear-gradient(135deg, ${["#3b82f6,#06b6d4", "#8b5cf6,#ec4899", "#10b981,#14b8a6", "#f59e0b,#f97316", "#6366f1,#8b5cf6"][i % 5]})` }}
                                            >
                                                {u.name ? u.name[0].toUpperCase() : "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{u.name || t("activity.noName")}</div>
                                                <div className="text-xs text-slate-400 truncate">{u.email}</div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${u.role === "ADMIN"
                                                    ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                }`}>
                                                {u.role === "ADMIN" ? t("activity.roleAdmin") : t("activity.roleMember")}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* رسالة المدرب */}
            {userRole === "INSTRUCTOR" && (
                <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-xl p-5 border border-emerald-200 dark:border-emerald-500/20">
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                        {t("instructor.welcomeTitle")}
                    </h3>
                    <p className="text-emerald-600 dark:text-emerald-300 text-sm">
                        {t("instructor.welcomeDesc")}
                    </p>
                </div>
            )}
        </div>
    );
}
