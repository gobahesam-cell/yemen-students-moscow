"use client";

import { useState } from "react";
import { Users, BookCheck, TrendingUp, Clock, Search, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Enrollment {
    id: string;
    progress: number;
    enrolledAt: string;
    lastAccessedAt: string;
    completedAt: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

interface CourseInfo {
    id: string;
    title: string;
    titleRu: string | null;
    totalLessons: number;
}

interface Props {
    course: CourseInfo;
    enrollments: Enrollment[];
}

export default function StudentsManagementClient({ course, enrollments }: Props) {
    const t = useTranslations("Admin.courseStudents");
    const [sortBy, setSortBy] = useState<"progress" | "lastActive" | "enrolled">("enrolled");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    // Calculate stats
    const totalStudents = enrollments.length;
    const completedCount = enrollments.filter(e => e.completedAt).length;
    const avgProgress = totalStudents > 0
        ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / totalStudents)
        : 0;

    const activeToday = enrollments.filter(e => {
        const lastAccess = new Date(e.lastAccessedAt);
        const today = new Date();
        return lastAccess.toDateString() === today.toDateString();
    }).length;

    // Sort enrollments
    const sorted = [...enrollments].sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortBy === "progress") return (a.progress - b.progress) * dir;
        if (sortBy === "lastActive") return (new Date(a.lastAccessedAt).getTime() - new Date(b.lastAccessedAt).getTime()) * dir;
        return (new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime()) * dir;
    });

    const toggleSort = (field: typeof sortBy) => {
        if (sortBy === field) {
            setSortDir(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDir("desc");
        }
    };

    const formatActivity = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return t("now");
        if (hours < 24) return t("hoursAgo", { count: hours });
        const days = Math.floor(hours / 24);
        return t("daysAgo", { count: days });
    };

    const getStatusInfo = (e: Enrollment) => {
        if (e.completedAt) return { label: t("completed"), color: "bg-emerald-500/10 text-emerald-600" };
        if (e.progress > 60) return { label: t("active"), color: "bg-blue-500/10 text-blue-600" };
        if (e.progress > 20) return { label: t("moderate"), color: "bg-amber-500/10 text-amber-600" };
        return { label: t("inactive"), color: "bg-slate-500/10 text-slate-500" };
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t("pageTitle")}
                </h1>
                <p className="text-sm text-slate-500">{course.title}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users size={20} className="text-blue-500" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{totalStudents}</div>
                    <div className="text-xs text-slate-500">{t("totalStudents")}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <BookCheck size={20} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{completedCount}</div>
                    <div className="text-xs text-slate-500">{t("completedCourse")}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <TrendingUp size={20} className="text-amber-500" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{avgProgress}%</div>
                    <div className="text-xs text-slate-500">{t("avgProgress")}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Clock size={20} className="text-purple-500" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{activeToday}</div>
                    <div className="text-xs text-slate-500">{t("activeToday")}</div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-bold text-slate-900 dark:text-white">{t("studentsList")}</h2>
                </div>

                {sorted.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        {t("noStudents")}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="text-start p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {t("student")}
                                    </th>
                                    <th
                                        className="text-start p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                                        onClick={() => toggleSort("progress")}
                                    >
                                        <span className="flex items-center gap-1">
                                            {t("progress")}
                                            {sortBy === "progress" && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                        </span>
                                    </th>
                                    <th
                                        className="text-start p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                                        onClick={() => toggleSort("lastActive")}
                                    >
                                        <span className="flex items-center gap-1">
                                            {t("lastActivity")}
                                            {sortBy === "lastActive" && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                        </span>
                                    </th>
                                    <th
                                        className="text-start p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                                        onClick={() => toggleSort("enrolled")}
                                    >
                                        <span className="flex items-center gap-1">
                                            {t("enrollDate")}
                                            {sortBy === "enrolled" && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                                        </span>
                                    </th>
                                    <th className="text-start p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {t("status")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((enrollment) => {
                                    const status = getStatusInfo(enrollment);
                                    return (
                                        <tr key={enrollment.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {enrollment.user.image ? (
                                                        <img
                                                            src={enrollment.user.image}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                                                            {enrollment.user.name?.[0] || "?"}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                                                            {enrollment.user.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{enrollment.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#d4af37] rounded-full transition-all"
                                                            style={{ width: `${enrollment.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        {enrollment.progress}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {formatActivity(enrollment.lastAccessedAt)}
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString("ar")}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
