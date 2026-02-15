"use client";

import { useState } from "react";
import { GraduationCap, Settings, BookOpen, Trash2, Users, PlayCircle, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2rem] border border-slate-200/50 dark:border-white/5 overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-2 cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                        <GraduationCap size={64} className="text-yellow-500/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Top Actions */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-yellow-500 hover:text-black transition-all shadow-2xl"
                    >
                        <Settings size={18} />
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-rose-500 transition-all shadow-2xl disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                </div>

                {/* Stats Badge */}
                <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white text-xs font-black shadow-2xl">
                        <Users size={14} className="text-yellow-500" />
                        <span>{course._count.enrollments}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors tracking-tighter">
                    {course.title}
                </h3>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                    {course.description}
                </p>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="flex flex-col items-center justify-center p-3 py-4 bg-slate-50/50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                        <BookOpen size={16} className="text-blue-500 mb-2" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Units</span>
                        <div className="text-sm font-black text-slate-900 dark:text-white">{course.units.length}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 py-4 bg-slate-50/50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                        <PlayCircle size={16} className="text-emerald-500 mb-2" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lessons</span>
                        <div className="text-sm font-black text-slate-900 dark:text-white">{lessonsCount}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 py-4 bg-slate-50/50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                        <Users size={16} className="text-yellow-500 mb-2" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Students</span>
                        <div className="text-sm font-black text-slate-900 dark:text-white">{course._count.enrollments}</div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                    <Link
                        href={`/admin/courses/${course.id}/students`}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
                    >
                        <Users size={14} />
                        {t("students")}
                    </Link>
                    <Link
                        href={`/admin/courses/${course.id}/content`}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-500 hover:opacity-80 transition-opacity"
                    >
                        <FileText size={14} />
                        {t("content")}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
