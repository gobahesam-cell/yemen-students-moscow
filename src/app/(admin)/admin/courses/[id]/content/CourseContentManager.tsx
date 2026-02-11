"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Edit2, ChevronDown, ChevronUp,
    Video, FileText, BookOpen, HelpCircle, Save,
    GripVertical, Play, File, X, Check, Loader2
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Lesson {
    id: string;
    title: string;
    titleRu?: string | null;
    description?: string | null;
    type: "VIDEO" | "PDF" | "ARTICLE";
    videoUrl?: string | null;
    pdfUrl?: string | null;
    content?: string | null;
    duration?: number | null;
    order: number;
    isFree?: boolean;
}

interface Quiz {
    id: string;
    title: string;
    titleRu?: string | null;
    description?: string | null;
    passingScore: number;
    questions: QuizQuestion[];
}

interface QuizQuestion {
    id: string;
    question: string;
    questionRu?: string | null;
    options: string[];
    optionsRu?: string[] | null;
    correctIndex: number;
    order: number;
}

interface Unit {
    id: string;
    title: string;
    titleRu?: string | null;
    description?: string | null;
    order: number;
    lessons: Lesson[];
    quiz?: Quiz | null;
}

interface Course {
    id: string;
    title: string;
    units: Unit[];
}

interface Props {
    course: Course;
}

export default function CourseContentManager({ course }: Props) {
    const t = useTranslations("Admin.courseContent");
    const [units, setUnits] = useState<Unit[]>(course.units);
    const [expandedUnits, setExpandedUnits] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [editingQuiz, setEditingQuiz] = useState<string | null>(null);

    // Add new unit
    const [newUnitTitle, setNewUnitTitle] = useState("");
    const [showNewUnit, setShowNewUnit] = useState(false);

    // Toggle unit expansion
    const toggleUnit = (unitId: string) => {
        setExpandedUnits(prev =>
            prev.includes(unitId)
                ? prev.filter(id => id !== unitId)
                : [...prev, unitId]
        );
    };

    // Add unit
    const handleAddUnit = async () => {
        if (!newUnitTitle.trim()) return;
        setSaving(true);

        try {
            const res = await fetch("/api/admin/units", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: course.id,
                    title: newUnitTitle,
                    order: units.length + 1,
                }),
            });

            if (res.ok) {
                const newUnit = await res.json();
                setUnits([...units, { ...newUnit, lessons: [], quiz: null }]);
                setNewUnitTitle("");
                setShowNewUnit(false);
            }
        } catch (error) {
            console.error("Failed to add unit:", error);
        }

        setSaving(false);
    };

    // Delete unit
    const handleDeleteUnit = async (unitId: string) => {
        if (!confirm(t("confirmDeleteUnit"))) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/units/${unitId}`, { method: "DELETE" });
            if (res.ok) {
                setUnits(units.filter(u => u.id !== unitId));
            }
        } catch (error) {
            console.error("Failed to delete unit:", error);
        }

        setSaving(false);
    };

    // Add lesson
    const handleAddLesson = async (unitId: string, type: "VIDEO" | "PDF" | "ARTICLE") => {
        setSaving(true);

        const unit = units.find(u => u.id === unitId);
        const order = (unit?.lessons.length || 0) + 1;

        const titleMap = {
            VIDEO: t("newVideoLesson"),
            PDF: t("newPdfLesson"),
            ARTICLE: t("newArticle"),
        };

        try {
            const res = await fetch("/api/admin/lessons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    unitId,
                    title: titleMap[type],
                    type,
                    order,
                }),
            });

            if (res.ok) {
                const newLesson = await res.json();
                setUnits(units.map(u =>
                    u.id === unitId
                        ? { ...u, lessons: [...u.lessons, newLesson] }
                        : u
                ));
                setEditingLesson(newLesson.id);
            }
        } catch (error) {
            console.error("Failed to add lesson:", error);
        }

        setSaving(false);
    };

    // Update lesson
    const handleUpdateLesson = async (lessonId: string, data: Partial<Lesson>) => {
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/lessons/${lessonId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const updated = await res.json();
                setUnits(units.map(u => ({
                    ...u,
                    lessons: u.lessons.map(l =>
                        l.id === lessonId ? { ...l, ...updated } : l
                    ),
                })));
                setEditingLesson(null);
            }
        } catch (error) {
            console.error("Failed to update lesson:", error);
        }

        setSaving(false);
    };

    // Delete lesson
    const handleDeleteLesson = async (unitId: string, lessonId: string) => {
        if (!confirm(t("confirmDeleteLesson"))) return;
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
            if (res.ok) {
                setUnits(units.map(u =>
                    u.id === unitId
                        ? { ...u, lessons: u.lessons.filter(l => l.id !== lessonId) }
                        : u
                ));
            }
        } catch (error) {
            console.error("Failed to delete lesson:", error);
        }

        setSaving(false);
    };

    // Add quiz to unit
    const handleAddQuiz = async (unitId: string) => {
        setSaving(true);

        try {
            const res = await fetch("/api/admin/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    unitId,
                    title: t("unitQuiz"),
                    passingScore: 70,
                }),
            });

            if (res.ok) {
                const newQuiz = await res.json();
                setUnits(units.map(u =>
                    u.id === unitId
                        ? { ...u, quiz: { ...newQuiz, questions: [] } }
                        : u
                ));
                setEditingQuiz(newQuiz.id);
            }
        } catch (error) {
            console.error("Failed to add quiz:", error);
        }

        setSaving(false);
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case "VIDEO": return <Video size={16} className="text-blue-500" />;
            case "PDF": return <File size={16} className="text-red-500" />;
            case "ARTICLE": return <FileText size={16} className="text-emerald-500" />;
            default: return <BookOpen size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{units.length}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{t("statUnits")}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {units.reduce((acc, u) => acc + u.lessons.length, 0)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{t("statLessons")}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-black text-[#d4af37]">
                        {units.filter(u => u.quiz).length}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{t("statQuizzes")}</div>
                </div>
            </div>

            {/* Units List */}
            <div className="space-y-4">
                {units.map((unit, idx) => (
                    <motion.div
                        key={unit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        {/* Unit Header */}
                        <div
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            onClick={() => toggleUnit(unit.id)}
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center font-black">
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white">{unit.title}</h3>
                                <p className="text-xs text-slate-500">
                                    {t("lessonsCount", { count: unit.lessons.length })} {unit.quiz && `• ${t("quizCheck")}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteUnit(unit.id); }}
                                    className="p-2 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                {expandedUnits.includes(unit.id) ? (
                                    <ChevronUp size={20} className="text-slate-400" />
                                ) : (
                                    <ChevronDown size={20} className="text-slate-400" />
                                )}
                            </div>
                        </div>

                        {/* Unit Content */}
                        <AnimatePresence>
                            {expandedUnits.includes(unit.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 dark:border-slate-800"
                                >
                                    <div className="p-4 space-y-3">
                                        {/* Lessons */}
                                        {unit.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                            >
                                                {getLessonIcon(lesson.type)}
                                                <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {lesson.title}
                                                </span>
                                                {lesson.isFree && (
                                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                                                        {t("free")}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => setEditingLesson(lesson.id)}
                                                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLesson(unit.id, lesson.id)}
                                                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Quiz */}
                                        {unit.quiz && (
                                            <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl">
                                                <HelpCircle size={16} className="text-amber-600" />
                                                <span className="flex-1 text-sm font-medium text-amber-700">
                                                    {unit.quiz.title} ({t("questionsCount", { count: unit.quiz.questions.length })})
                                                </span>
                                                <button
                                                    onClick={() => setEditingQuiz(unit.quiz!.id)}
                                                    className="p-1.5 hover:bg-white rounded-lg text-amber-600 hover:text-amber-700 transition-colors"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Add Buttons */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <button
                                                onClick={() => handleAddLesson(unit.id, "VIDEO")}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <Video size={14} />
                                                {t("addVideo")}
                                            </button>
                                            <button
                                                onClick={() => handleAddLesson(unit.id, "PDF")}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-600 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <File size={14} />
                                                {t("addPdf")}
                                            </button>
                                            <button
                                                onClick={() => handleAddLesson(unit.id, "ARTICLE")}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <FileText size={14} />
                                                {t("addArticle")}
                                            </button>
                                            {!unit.quiz && (
                                                <button
                                                    onClick={() => handleAddQuiz(unit.id)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                                                >
                                                    <HelpCircle size={14} />
                                                    {t("addQuiz")}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Add New Unit */}
            {showNewUnit ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newUnitTitle}
                            onChange={(e) => setNewUnitTitle(e.target.value)}
                            placeholder={t("newUnitPlaceholder")}
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37]"
                            autoFocus
                        />
                        <button
                            onClick={handleAddUnit}
                            disabled={saving || !newUnitTitle.trim()}
                            className="px-4 py-3 bg-[#d4af37] text-slate-900 rounded-xl font-bold text-sm hover:bg-[#c9a430] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            {t("add")}
                        </button>
                        <button
                            onClick={() => { setShowNewUnit(false); setNewUnitTitle(""); }}
                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowNewUnit(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors font-bold flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    {t("addNewUnit")}
                </button>
            )}

            {/* Lesson Edit Modal */}
            <AnimatePresence>
                {editingLesson && (
                    <LessonEditModal
                        lesson={units.flatMap(u => u.lessons).find(l => l.id === editingLesson)!}
                        onSave={(data) => handleUpdateLesson(editingLesson, data)}
                        onClose={() => setEditingLesson(null)}
                        saving={saving}
                    />
                )}
            </AnimatePresence>

            {/* Quiz Edit Modal */}
            <AnimatePresence>
                {editingQuiz && (
                    <QuizEditModal
                        quiz={units.find(u => u.quiz?.id === editingQuiz)?.quiz!}
                        onClose={() => setEditingQuiz(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Lesson Edit Modal
function LessonEditModal({
    lesson,
    onSave,
    onClose,
    saving,
}: {
    lesson: Lesson;
    onSave: (data: Partial<Lesson>) => void;
    onClose: () => void;
    saving: boolean;
}) {
    const t = useTranslations("Admin.courseContent");
    const [title, setTitle] = useState(lesson.title);
    const [description, setDescription] = useState(lesson.description || "");
    const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
    const [pdfUrl, setPdfUrl] = useState(lesson.pdfUrl || "");
    const [content, setContent] = useState(lesson.content || "");
    const [duration, setDuration] = useState(lesson.duration || 10);
    const [isFree, setIsFree] = useState(lesson.isFree || false);

    const handleSubmit = () => {
        onSave({
            title,
            description,
            videoUrl: lesson.type === "VIDEO" ? videoUrl : undefined,
            pdfUrl: lesson.type === "PDF" ? pdfUrl : undefined,
            content: lesson.type === "ARTICLE" ? content : undefined,
            duration,
            isFree,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                    {t("editLesson")}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                            {t("lessonTitle")}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                            {t("description")}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37] resize-none"
                        />
                    </div>

                    {lesson.type === "VIDEO" && (
                        <div>
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                {t("videoUrl")}
                            </label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37]"
                                dir="ltr"
                            />
                        </div>
                    )}


                    {lesson.type === "PDF" && (
                        <div>
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                {t("pdfFile")}
                            </label>
                            <div className="space-y-3">
                                {/* File Upload */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append("file", file);
                                            formData.append("folder", "pdfs");

                                            try {
                                                const res = await fetch("/api/upload", {
                                                    method: "POST",
                                                    body: formData,
                                                });
                                                const data = await res.json();
                                                if (data.url) {
                                                    setPdfUrl(data.url);
                                                } else {
                                                    alert(data.error || t("uploadFailed"));
                                                }
                                            } catch (err) {
                                                console.error("Upload error:", err);
                                                alert(t("uploadError"));
                                            }
                                        }}
                                        className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#d4af37] file:text-slate-900 hover:file:bg-[#c9a430] file:cursor-pointer"
                                    />
                                </div>
                                {/* OR URL Input */}
                                <div className="text-xs text-center text-slate-400">{t("orDirectLink")}</div>
                                <input
                                    type="url"
                                    value={pdfUrl}
                                    onChange={(e) => setPdfUrl(e.target.value)}
                                    placeholder="https://example.com/file.pdf"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37]"
                                    dir="ltr"
                                />
                                {pdfUrl && (
                                    <div className="text-xs text-emerald-500 flex items-center gap-1">
                                        ✓ {pdfUrl.split("/").pop()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {lesson.type === "ARTICLE" && (
                        <div>
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                {t("articleContent")}
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={5}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37] resize-none font-mono"
                                dir="ltr"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                {t("durationMinutes")}
                            </label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                min={1}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#d4af37]"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFree}
                                    onChange={(e) => setIsFree(e.target.checked)}
                                    className="w-5 h-5 rounded-lg border-slate-300 text-[#d4af37] focus:ring-[#d4af37]"
                                />
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                    {t("freeLesson")}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 py-3 bg-[#d4af37] text-slate-900 rounded-xl font-bold hover:bg-[#c9a430] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {t("saveChanges")}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {t("cancel")}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Quiz Edit Modal with full CRUD
function QuizEditModal({
    quiz,
    onClose,
    onUpdate,
}: {
    quiz: Quiz;
    onClose: () => void;
    onUpdate?: (updatedQuiz: Quiz) => void;
}) {
    const t = useTranslations("Admin.courseContent");
    const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions);
    const [saving, setSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

    // Form state
    const [newQuestion, setNewQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState(0);

    const resetForm = () => {
        setNewQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(0);
        setShowAddForm(false);
        setEditingQuestion(null);
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.trim() || options.filter(o => o.trim()).length < 2) {
            alert(t("validationQuiz"));
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizId: quiz.id,
                    question: newQuestion,
                    options: options.filter(o => o.trim()),
                    correctIndex,
                }),
            });

            if (res.ok) {
                const q = await res.json();
                setQuestions([...questions, q]);
                resetForm();
            }
        } catch (error) {
            console.error("Add question error:", error);
        }
        setSaving(false);
    };

    const handleUpdateQuestion = async (questionId: string) => {
        if (!newQuestion.trim() || options.filter(o => o.trim()).length < 2) {
            alert(t("validationQuiz"));
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/questions/${questionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: newQuestion,
                    options: options.filter(o => o.trim()),
                    correctIndex,
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setQuestions(questions.map(q => q.id === questionId ? updated : q));
                resetForm();
            }
        } catch (error) {
            console.error("Update question error:", error);
        }
        setSaving(false);
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!confirm(t("confirmDeleteQuestion"))) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/questions/${questionId}`, { method: "DELETE" });
            if (res.ok) {
                setQuestions(questions.filter(q => q.id !== questionId));
            }
        } catch (error) {
            console.error("Delete question error:", error);
        }
        setSaving(false);
    };

    const startEditQuestion = (q: QuizQuestion) => {
        setEditingQuestion(q.id);
        setNewQuestion(q.question);
        setOptions([...q.options, "", "", "", ""].slice(0, 4));
        setCorrectIndex(q.correctIndex);
        setShowAddForm(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {t("quizManage", { name: quiz.title })}
                    </h3>
                    <span className="px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-sm font-bold">
                        {t("questionsCount", { count: questions.length })}
                    </span>
                </div>

                {/* Questions List */}
                <div className="space-y-3 mb-6">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="w-8 h-8 rounded-lg bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center font-bold text-sm shrink-0">
                                    {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white mb-2">{q.question}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, optIdx) => (
                                            <div
                                                key={optIdx}
                                                className={`p-2 rounded-lg text-sm truncate ${optIdx === q.correctIndex
                                                    ? "bg-emerald-500/10 text-emerald-600 font-bold"
                                                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                                    }`}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => startEditQuestion(q)}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {questions.length === 0 && !showAddForm && (
                        <div className="text-center py-8 text-slate-500">
                            {t("noQuestions")}
                        </div>
                    )}
                </div>

                {/* Add/Edit Form */}
                {showAddForm ? (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                            {editingQuestion ? t("editQuestion") : t("addNewQuestion")}
                        </h4>

                        <div>
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                {t("questionText")}
                            </label>
                            <input
                                type="text"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder={t("questionPlaceholder")}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400 block mb-2">
                                {t("optionsLabel")}
                            </label>
                            <div className="space-y-2">
                                {options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCorrectIndex(idx)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${correctIndex === idx
                                                ? "bg-emerald-500 text-white"
                                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400"
                                                }`}
                                        >
                                            {correctIndex === idx ? <Check size={14} /> : idx + 1}
                                        </button>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...options];
                                                newOpts[idx] = e.target.value;
                                                setOptions(newOpts);
                                            }}
                                            placeholder={t("optionPlaceholder", { num: idx + 1 })}
                                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                {t("optionHint")}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => editingQuestion ? handleUpdateQuestion(editingQuestion) : handleAddQuestion()}
                                disabled={saving}
                                className="flex-1 py-3 bg-[#d4af37] text-slate-900 rounded-xl font-bold hover:bg-[#c9a430] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                {editingQuestion ? t("saveEdits") : t("addQuestion")}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                {t("cancel")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors font-bold flex items-center justify-center gap-2 mb-6"
                    >
                        <Plus size={18} />
                        {t("addNewQuestion")}
                    </button>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {t("close")}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
