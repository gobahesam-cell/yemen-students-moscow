"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    BookOpen, Users, Clock, Play, Lock, ChevronRight,
    GraduationCap, ArrowRight, Sparkles, CheckCircle2, Award
} from "lucide-react";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { LessonContent } from "@/components/course/LessonContent";
import { QuizPlayer } from "@/components/course/QuizPlayer";
import { enrollInCourseAction, updateLessonProgressAction, saveQuizAttemptAction } from "@/app/actions/enrollment";

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
    isFree?: boolean;
    completed?: boolean;
}

interface QuizQuestion {
    id: string;
    question: string;
    questionRu?: string | null;
    options: string[];
    optionsRu: string[];
    correctIndex: number;
}

interface Quiz {
    id: string;
    title: string;
    titleRu?: string | null;
    passingScore: number;
    questions: QuizQuestion[];
}

interface Unit {
    id: string;
    title: string;
    titleRu?: string | null;
    order: number;
    hasQuiz?: boolean;
    quiz?: Quiz | null;
    lessons: Lesson[];
}

interface CoursePageClientProps {
    course: {
        id: string;
        slug: string;
        title: string;
        titleRu?: string | null;
        description: string;
        descriptionRu?: string | null;
        thumbnail?: string | null;
        units: Unit[];
    };
    stats: {
        totalLessons: number;
        totalDuration: number;
        studentCount: number;
    };
    enrollment: {
        isLoggedIn: boolean;
        isEnrolled: boolean;
        progress: number;
        currentLessonId: string | null;
    };
    locale: string;
}

export default function CoursePageClient({
    course,
    stats,
    enrollment,
    locale,
}: CoursePageClientProps) {
    const isRTL = locale === "ar";
    const [isEnrolled, setIsEnrolled] = useState(enrollment.isEnrolled);
    const [progress, setProgress] = useState(enrollment.progress);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const title = locale === "ru" && course.titleRu ? course.titleRu : course.title;
    const description = locale === "ru" && course.descriptionRu ? course.descriptionRu : course.description;

    // Initialize current lesson
    useEffect(() => {
        if (isEnrolled && course.units.length > 0) {
            // Find current lesson or first incomplete lesson
            let targetLesson: Lesson | null = null;

            if (enrollment.currentLessonId) {
                for (const unit of course.units) {
                    const found = unit.lessons.find((l) => l.id === enrollment.currentLessonId);
                    if (found) {
                        targetLesson = found;
                        break;
                    }
                }
            }

            if (!targetLesson) {
                // Find first incomplete lesson
                for (const unit of course.units) {
                    const incomplete = unit.lessons.find((l) => !l.completed);
                    if (incomplete) {
                        targetLesson = incomplete;
                        break;
                    }
                }
            }

            if (!targetLesson && course.units[0]?.lessons[0]) {
                targetLesson = course.units[0].lessons[0];
            }

            setCurrentLesson(targetLesson);
            setShowContent(true);
        }
    }, [isEnrolled, course.units, enrollment.currentLessonId]);

    const handleEnroll = async () => {
        if (!enrollment.isLoggedIn) {
            window.location.href = `/${locale}/login?redirect=/${locale}/courses/${course.slug}`;
            return;
        }

        setEnrolling(true);
        const result = await enrollInCourseAction(course.id);
        setEnrolling(false);

        if (result.success) {
            setIsEnrolled(true);
            // Start with first lesson
            if (course.units[0]?.lessons[0]) {
                setCurrentLesson(course.units[0].lessons[0]);
                setShowContent(true);
            }
        } else if (result.error) {
            alert(result.error);
        }
    };

    const handleLessonSelect = (lessonId: string) => {
        for (const unit of course.units) {
            const found = unit.lessons.find((l) => l.id === lessonId);
            if (found) {
                setCurrentLesson(found);
                setActiveQuiz(null);
                setShowContent(true);
                break;
            }
        }
    };

    const handleLessonComplete = async () => {
        if (!currentLesson) return;

        await updateLessonProgressAction(currentLesson.id, true);

        // Update local state
        currentLesson.completed = true;

        // Move to next lesson
        let foundCurrent = false;
        for (const unit of course.units) {
            for (const lesson of unit.lessons) {
                if (foundCurrent && !lesson.completed) {
                    setCurrentLesson(lesson);
                    return;
                }
                if (lesson.id === currentLesson.id) {
                    foundCurrent = true;
                }
            }
        }

        // All lessons complete
        setProgress(100);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins} ${locale === "ar" ? "دقيقة" : "мин"}`;
        return `${hours} ${locale === "ar" ? "ساعة" : "ч"} ${mins} ${locale === "ar" ? "د" : "мин"}`;
    };

    // Landing view (not enrolled)
    if (!isEnrolled || !showContent) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" dir={isRTL ? "rtl" : "ltr"}>
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <Link
                                    href={`/${locale}/courses`}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#d4af37] hover:text-[#c9a430] transition-colors"
                                >
                                    <ArrowRight size={16} className={isRTL ? "" : "rotate-180"} />
                                    {locale === "ar" ? "العودة للدورات" : "Назад к курсам"}
                                </Link>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-xs font-black">
                                            {locale === "ar" ? "دورة تعليمية" : "Учебный курс"}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <Users size={14} />
                                            {stats.studentCount} {locale === "ar" ? "طالب" : "студентов"}
                                        </span>
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                        {title}
                                    </h1>

                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {description}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <div className="p-2 bg-blue-500/10 rounded-xl">
                                            <BookOpen size={20} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalLessons}</p>
                                            <p className="text-xs text-slate-500">{locale === "ar" ? "درس" : "уроков"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <div className="p-2 bg-amber-500/10 rounded-xl">
                                            <Clock size={20} className="text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{formatDuration(stats.totalDuration)}</p>
                                            <p className="text-xs text-slate-500">{locale === "ar" ? "مدة الدورة" : "длительность"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                                            <GraduationCap size={20} className="text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{course.units.length}</p>
                                            <p className="text-xs text-slate-500">{locale === "ar" ? "وحدة" : "модулей"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="w-full sm:w-auto px-10 py-5 bg-[#d4af37] hover:bg-[#c9a430] text-slate-900 rounded-2xl font-black text-lg shadow-xl shadow-[#d4af37]/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {enrolling ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            {locale === "ar" ? "جاري التسجيل..." : "Запись..."}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={24} />
                                            {enrollment.isLoggedIn
                                                ? locale === "ar" ? "ابدأ الدورة الآن" : "Начать курс"
                                                : locale === "ar" ? "سجل دخول للبدء" : "Войдите, чтобы начать"
                                            }
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>

                            {/* Thumbnail */}
                            <motion.div
                                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                            >
                                <div className="aspect-video rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                                    {course.thumbnail ? (
                                        <Image
                                            src={course.thumbnail}
                                            alt={title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                                            <GraduationCap size={80} className="text-[#d4af37]/50" />
                                        </div>
                                    )}
                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                                            <Play size={32} className="text-[#d4af37] mr-[-4px]" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Course Content Preview */}
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <BookOpen className="text-[#d4af37]" />
                        {locale === "ar" ? "محتوى الدورة" : "Содержание курса"}
                    </h2>

                    <div className="space-y-4">
                        {course.units.map((unit, idx) => (
                            <motion.div
                                key={unit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center font-black">
                                        {idx + 1}
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {locale === "ru" && unit.titleRu ? unit.titleRu : unit.title}
                                    </h3>
                                    <span className="text-xs text-slate-500 mr-auto">
                                        {unit.lessons.length} {locale === "ar" ? "دروس" : "уроков"}
                                    </span>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {unit.lessons.slice(0, 3).map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                {lesson.isFree ? (
                                                    <Play size={14} className="text-emerald-500" />
                                                ) : (
                                                    <Lock size={14} className="text-slate-400" />
                                                )}
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate flex-1">
                                                {locale === "ru" && lesson.titleRu ? lesson.titleRu : lesson.title}
                                            </span>
                                            {lesson.isFree && (
                                                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                                                    {locale === "ar" ? "مجاني" : "Free"}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {unit.lessons.length > 3 && (
                                        <div className="flex items-center justify-center p-3 text-sm text-slate-500">
                                            +{unit.lessons.length - 3} {locale === "ar" ? "دروس أخرى" : "ещё"}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Learning view (enrolled)
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${locale}/courses`}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <ArrowRight size={20} className={isRTL ? "" : "rotate-180"} />
                        </Link>
                        <div>
                            <h1 className="font-black text-xl text-slate-900 dark:text-white">{title}</h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span>{progress}% {locale === "ar" ? "مكتمل" : "завершено"}</span>
                                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {progress >= 100 && (
                        <Link
                            href={`/${locale}/courses/${course.slug}/certificate`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] text-slate-900 rounded-xl font-bold shadow-lg shadow-[#d4af37]/25 hover:bg-[#c9a430] transition-colors"
                        >
                            <Award size={18} />
                            {locale === "ar" ? "احصل على الشهادة" : "Получить сертификат"}
                        </Link>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Lesson or Quiz Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {activeQuiz ? (
                                <motion.div
                                    key={`quiz-${activeQuiz.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <QuizPlayer
                                        quiz={activeQuiz}
                                        courseSlug={course.slug}
                                        onComplete={async (score, passed) => {
                                            // حفظ نتيجة الاختبار وإعادة حساب التقدم
                                            await saveQuizAttemptAction(
                                                activeQuiz.id,
                                                course.id,
                                                score,
                                                passed
                                            );
                                            if (passed) {
                                                setActiveQuiz(null);
                                                // تحديث التقدم في الواجهة
                                                setProgress(prev => Math.min(100, prev + 1));
                                            }
                                        }}
                                    />
                                </motion.div>
                            ) : currentLesson ? (
                                <motion.div
                                    key={currentLesson.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <LessonContent
                                        lesson={currentLesson}
                                        onComplete={handleLessonComplete}
                                    />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <CourseSidebar
                                units={course.units}
                                currentLessonId={currentLesson?.id}
                                onLessonSelect={handleLessonSelect}
                                onQuizSelect={(unitId) => {
                                    const unit = course.units.find(u => u.id === unitId);
                                    if (unit?.quiz) {
                                        setActiveQuiz(unit.quiz);
                                        setCurrentLesson(null);
                                    }
                                }}
                                isEnrolled={isEnrolled}
                                progress={progress}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
