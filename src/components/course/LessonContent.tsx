"use client";

import { motion } from "framer-motion";
import { BookOpen, Play, FileText, CheckCircle2, Clock } from "lucide-react";
import { useLocale } from "next-intl";
import { CoursePlayer } from "./CoursePlayer";
import { PDFViewer } from "./PDFViewer";

interface Lesson {
    id: string;
    title: string;
    titleRu?: string | null;
    description?: string | null;
    descriptionRu?: string | null;
    type: "VIDEO" | "PDF" | "ARTICLE";
    videoUrl?: string | null;
    pdfUrl?: string | null;
    content?: string | null;
    duration?: number | null;
    completed?: boolean;
}

interface LessonContentProps {
    lesson: Lesson;
    onComplete?: () => void;
    onProgress?: (seconds: number) => void;
}

export function LessonContent({ lesson, onComplete, onProgress }: LessonContentProps) {
    const locale = useLocale();

    const title = locale === "ru" && lesson.titleRu ? lesson.titleRu : lesson.title;
    const description = locale === "ru" && lesson.descriptionRu ? lesson.descriptionRu : lesson.description;

    const getTypeIcon = () => {
        switch (lesson.type) {
            case "VIDEO":
                return <Play size={18} className="text-blue-500" />;
            case "PDF":
                return <FileText size={18} className="text-rose-500" />;
            case "ARTICLE":
                return <BookOpen size={18} className="text-amber-500" />;
        }
    };

    const getTypeName = () => {
        switch (lesson.type) {
            case "VIDEO":
                return locale === "ar" ? "فيديو" : "Видео";
            case "PDF":
                return locale === "ar" ? "ملف PDF" : "PDF файл";
            case "ARTICLE":
                return locale === "ar" ? "مقالة" : "Статья";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Lesson Info Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                        {getTypeIcon()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                {getTypeName()}
                            </span>
                            {lesson.duration && (
                                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {lesson.duration} {locale === "ar" ? "دقيقة" : "мин"}
                                </span>
                            )}
                            {lesson.completed && (
                                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    {locale === "ar" ? "مكتمل" : "Завершено"}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Display */}
            {lesson.type === "VIDEO" && lesson.videoUrl && (
                <CoursePlayer
                    videoUrl={lesson.videoUrl}
                    title={title}
                    onComplete={onComplete}
                    onProgress={onProgress}
                />
            )}

            {lesson.type === "PDF" && lesson.pdfUrl && (
                <PDFViewer pdfUrl={lesson.pdfUrl} title={title} />
            )}

            {lesson.type === "ARTICLE" && lesson.content && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl"
                >
                    <article
                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-yellow-600"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                    />
                </motion.div>
            )}

            {/* Mark Complete Button */}
            {!lesson.completed && onComplete && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onComplete}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
                >
                    <CheckCircle2 size={24} />
                    {locale === "ar" ? "إكمال الدرس" : "Завершить урок"}
                </motion.button>
            )}
        </motion.div>
    );
}
