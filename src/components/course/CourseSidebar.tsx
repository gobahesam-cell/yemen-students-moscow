"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown, ChevronUp, Play, FileText, BookOpen,
    CheckCircle2, Lock, Clock, Trophy
} from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";

interface Lesson {
    id: string;
    title: string;
    titleRu?: string | null;
    type: "VIDEO" | "PDF" | "ARTICLE";
    duration?: number | null;
    isFree?: boolean;
    completed?: boolean;
}

interface Unit {
    id: string;
    title: string;
    titleRu?: string | null;
    order: number;
    lessons: Lesson[];
    hasQuiz?: boolean;
    quizPassed?: boolean;
}

interface CourseSidebarProps {
    units: Unit[];
    currentLessonId?: string;
    onLessonSelect: (lessonId: string) => void;
    onQuizSelect?: (unitId: string) => void;
    isEnrolled?: boolean;
    progress?: number;
}

export function CourseSidebar({
    units,
    currentLessonId,
    onLessonSelect,
    onQuizSelect,
    isEnrolled = false,
    progress = 0,
}: CourseSidebarProps) {
    const locale = useLocale();
    const [expandedUnits, setExpandedUnits] = useState<Set<string>>(
        new Set(units.length > 0 ? [units[0].id] : [])
    );

    const toggleUnit = (unitId: string) => {
        const newExpanded = new Set(expandedUnits);
        if (newExpanded.has(unitId)) {
            newExpanded.delete(unitId);
        } else {
            newExpanded.add(unitId);
        }
        setExpandedUnits(newExpanded);
    };

    const getLocalizedTitle = (title: string, titleRu?: string | null) => {
        return locale === "ru" && titleRu ? titleRu : title;
    };

    const getLessonIcon = (type: string, completed?: boolean) => {
        if (completed) return <CheckCircle2 size={16} className="text-emerald-500" />;
        switch (type) {
            case "VIDEO":
                return <Play size={16} className="text-blue-500" />;
            case "PDF":
                return <FileText size={16} className="text-rose-500" />;
            case "ARTICLE":
                return <BookOpen size={16} className="text-amber-500" />;
            default:
                return <Play size={16} />;
        }
    };

    const totalLessons = units.reduce((acc, unit) => acc + unit.lessons.length, 0);
    const completedLessons = units.reduce(
        (acc, unit) => acc + unit.lessons.filter((l) => l.completed).length,
        0
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            {/* Header with Progress */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-900 dark:text-white text-lg">
                        {locale === "ar" ? "محتوى الدورة" : "Содержание курса"}
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                        {completedLessons}/{totalLessons}
                    </span>
                </div>
                <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {progress}% {locale === "ar" ? "مكتمل" : "завершено"}
                </p>
            </div>

            {/* Units List */}
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
                {units.map((unit, unitIndex) => (
                    <div key={unit.id} className="border-b border-slate-100 dark:border-slate-800 last:border-none">
                        {/* Unit Header */}
                        <button
                            onClick={() => toggleUnit(unit.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center font-black text-sm">
                                    {unitIndex + 1}
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                        {getLocalizedTitle(unit.title, unit.titleRu)}
                                    </h4>
                                    <p className="text-[10px] text-slate-400">
                                        {unit.lessons.length} {locale === "ar" ? "دروس" : "уроков"}
                                    </p>
                                </div>
                            </div>
                            {expandedUnits.has(unit.id) ? (
                                <ChevronUp size={18} className="text-slate-400" />
                            ) : (
                                <ChevronDown size={18} className="text-slate-400" />
                            )}
                        </button>

                        {/* Lessons List */}
                        <AnimatePresence>
                            {expandedUnits.has(unit.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-3 space-y-1">
                                        {unit.lessons.map((lesson, lessonIndex) => {
                                            const isActive = lesson.id === currentLessonId;
                                            const isLocked = !isEnrolled && !lesson.isFree;

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => !isLocked && onLessonSelect(lesson.id)}
                                                    disabled={isLocked}
                                                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-right ${isActive
                                                            ? "bg-yellow-500/10 border border-yellow-500/30"
                                                            : isLocked
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? "bg-yellow-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                                                        }`}>
                                                        {isLocked ? (
                                                            <Lock size={12} className="text-slate-400" />
                                                        ) : (
                                                            getLessonIcon(lesson.type, lesson.completed)
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isActive ? "text-yellow-600" : "text-slate-700 dark:text-slate-300"
                                                            }`}>
                                                            {lessonIndex + 1}. {getLocalizedTitle(lesson.title, lesson.titleRu)}
                                                        </p>
                                                        {lesson.duration && (
                                                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {lesson.duration} {locale === "ar" ? "د" : "мин"}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {lesson.isFree && !isEnrolled && (
                                                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                                                            {locale === "ar" ? "مجاني" : "Бесплатно"}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}

                                        {/* Quiz Button */}
                                        {unit.hasQuiz && (
                                            <button
                                                onClick={() => onQuizSelect?.(unit.id)}
                                                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${unit.quizPassed
                                                        ? "bg-emerald-500/10 border border-emerald-500/30"
                                                        : "bg-purple-500/5 hover:bg-purple-500/10"
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${unit.quizPassed ? "bg-emerald-500" : "bg-purple-500"
                                                    } text-white`}>
                                                    <Trophy size={12} />
                                                </div>
                                                <span className={`text-sm font-bold ${unit.quizPassed ? "text-emerald-600" : "text-purple-600"
                                                    }`}>
                                                    {locale === "ar" ? "اختبار الوحدة" : "Тест модуля"}
                                                </span>
                                                {unit.quizPassed && (
                                                    <CheckCircle2 size={14} className="text-emerald-500 mr-auto" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
