"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

interface QuizQuestion {
    id: string;
    question: string;
    questionRu?: string | null;
    options: string[];
    optionsRu: string[];
    correctIndex: number;
}

interface QuizPlayerProps {
    quiz: {
        id: string;
        title: string;
        titleRu?: string | null;
        passingScore: number;
        questions: QuizQuestion[];
    };
    courseSlug: string;
    onComplete?: (score: number, passed: boolean) => void;
}

export function QuizPlayer({ quiz, courseSlug, onComplete }: QuizPlayerProps) {
    const locale = useLocale();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = quiz.questions[currentIndex];
    const isLastQuestion = currentIndex === quiz.questions.length - 1;

    const title = locale === "ru" && quiz.titleRu ? quiz.titleRu : quiz.title;
    const question = locale === "ru" && currentQuestion?.questionRu
        ? currentQuestion.questionRu
        : currentQuestion?.question;
    const options = locale === "ru" && currentQuestion?.optionsRu?.length
        ? currentQuestion.optionsRu
        : currentQuestion?.options || [];

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        const newAnswers = [...answers, selectedOption];
        setAnswers(newAnswers);

        if (isLastQuestion) {
            // Calculate score
            let correct = 0;
            newAnswers.forEach((answer, idx) => {
                if (answer === quiz.questions[idx].correctIndex) {
                    correct++;
                }
            });
            const percentage = Math.round((correct / quiz.questions.length) * 100);
            setScore(percentage);
            setShowResult(true);
            onComplete?.(percentage, percentage >= quiz.passingScore);
        } else {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setAnswers([]);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
    };

    const passed = score >= quiz.passingScore;

    if (showResult) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${passed
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                            : "bg-gradient-to-br from-rose-500 to-pink-500"
                        }`}
                >
                    {passed ? (
                        <Trophy size={48} className="text-white" />
                    ) : (
                        <XCircle size={48} className="text-white" />
                    )}
                </motion.div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {passed
                        ? (locale === "ar" ? "مبروك! نجحت" : "Поздравляем! Вы сдали")
                        : (locale === "ar" ? "للأسف لم تنجح" : "К сожалению, не сдано")
                    }
                </h2>

                <p className="text-slate-500 mb-6">
                    {locale === "ar" ? "نتيجتك:" : "Ваш результат:"}
                    <span className={`text-4xl font-black mx-2 ${passed ? "text-emerald-500" : "text-rose-500"}`}>
                        {score}%
                    </span>
                    ({quiz.passingScore}% {locale === "ar" ? "للنجاح" : "для сдачи"})
                </p>

                <div className="flex items-center justify-center gap-4">
                    {!passed && (
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-all"
                        >
                            <RotateCcw size={18} />
                            {locale === "ar" ? "إعادة المحاولة" : "Повторить"}
                        </button>
                    )}
                    <Link
                        href={`/${locale}/courses/${courseSlug}`}
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold transition-all"
                    >
                        <BookOpen size={18} />
                        {locale === "ar" ? "العودة للدورة" : "Вернуться к курсу"}
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">{title}</h3>
                    <span className="text-sm font-bold text-slate-500">
                        {currentIndex + 1} / {quiz.questions.length}
                    </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            {question}
                        </h4>

                        <div className="space-y-3">
                            {options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full p-4 rounded-2xl text-right transition-all border-2 ${selectedOption === idx
                                            ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                            : "border-slate-200 dark:border-slate-700 hover:border-purple-500/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${selectedOption === idx
                                                ? "bg-purple-500 text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${selectedOption !== null
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    {isLastQuestion
                        ? (locale === "ar" ? "إظهار النتيجة" : "Показать результат")
                        : (locale === "ar" ? "السؤال التالي" : "Следующий вопрос")
                    }
                    <ArrowRight size={20} className={locale === "ar" ? "rotate-180" : ""} />
                </button>
            </div>
        </motion.div>
    );
}
