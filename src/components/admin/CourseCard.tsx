"use client";

import { useState } from "react";
import { GraduationCap, Settings, BookOpen, Trash2, Users, PlayCircle, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string | null;
        thumbnail: string | null;
        units: { _count: { lessons: number } }[];
        _count: { enrollments: number };
    };
}

export function CourseCard({ course }: CourseCardProps) {
    const router = useRouter();
    const t = useTranslations("Admin.courses");
    const [isDeleting, setIsDeleting] = useState(false);

    const lessonsCount = course.units.reduce((acc, u) => acc + u._count.lessons, 0);

    const handleDelete = async () => {
        if (!confirm(t("deleteConfirm"))) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/courses/${course.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || t("deleteFailed"));
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert(t("deleteFailed"));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none hover:border-[#d4af37]/30 transition-all duration-500 hover:-translate-y-1">
            {/* Thumbnail */}
            <div className="relative h-40 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap size={48} className="text-[#d4af37]/50" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Actions */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg transition-colors hover:bg-white text-slate-600 dark:text-slate-300 hover:text-blue-500 shadow-sm"
                    >
                        <Settings size={16} />
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-lg transition-colors hover:bg-white text-slate-600 dark:text-slate-300 hover:text-red-500 shadow-sm disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                </div>

                {/* Stats Badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur rounded-lg text-white text-xs font-bold">
                        <Users size={12} />
                        {course._count.enrollments}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#d4af37] transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                </p>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <BookOpen size={14} className="text-blue-500 mx-auto mb-1" />
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{course.units.length} {t("units")}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <PlayCircle size={14} className="text-emerald-500 mx-auto mb-1" />
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{lessonsCount} {t("lessons")}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Users size={14} className="text-[#d4af37] mx-auto mb-1" />
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{course._count.enrollments} {t("students")}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                        href={`/admin/courses/${course.id}/students`}
                        className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
                    >
                        <Users size={14} />
                        {t("students")}
                    </Link>
                    <Link
                        href={`/admin/courses/${course.id}/content`}
                        className="flex items-center gap-1.5 text-sm font-bold text-[#d4af37] hover:text-[#c9a430] transition-colors"
                    >
                        <FileText size={14} />
                        {t("content")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
