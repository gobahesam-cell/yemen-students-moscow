"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AdminCard } from "./AdminCard";
import { Save, ArrowRight, BookOpen, Globe, Image as ImageIcon, Loader2 } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import ImageUploader from "./ImageUploader";
import { upsertCourseAction } from "@/app/actions/courses";
import { useTranslations } from "next-intl";

interface CourseFormProps {
    initialData?: {
        id: string;
        slug: string;
        title: string;
        titleRu?: string | null;
        description: string;
        descriptionRu?: string | null;
        thumbnail?: string | null;
    };
}

export default function CourseForm({ initialData }: CourseFormProps) {
    const router = useRouter();
    const t = useTranslations("Admin.courseForm");
    const tf = useTranslations("Admin.forms");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"ar" | "ru">("ar");

    const [formData, setFormData] = useState({
        id: initialData?.id,
        slug: initialData?.slug || "",
        title: initialData?.title || "",
        titleRu: initialData?.titleRu || "",
        description: initialData?.description || "",
        descriptionRu: initialData?.descriptionRu || "",
        thumbnail: initialData?.thumbnail || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await upsertCourseAction(formData);
        setLoading(false);

        if (res.success) {
            router.push("/admin/courses");
            router.refresh();
        } else {
            alert(res.error || t("saveError"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
            {/* Header: Sticky with Glassmorphism */}
            <div className="flex items-center justify-between gap-4 sticky top-0 z-40 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl py-6 border-b border-slate-200/50 dark:border-white/5 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => router.back()}
                        className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
                    >
                        <ArrowRight size={24} className={activeTab === 'ar' ? 'rotate-0' : 'rotate-180'} />
                    </motion.button>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight hidden sm:block">
                        {initialData ? t("editCourse") : t("createNewCourse")}
                    </h2>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="group flex items-center gap-3 bg-slate-900 dark:bg-yellow-500 text-white dark:text-black px-8 py-4 rounded-[1.5rem] font-black text-sm hover:shadow-xl hover:shadow-yellow-500/10 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
                    <span className="uppercase tracking-widest">{initialData ? t("saveEdits") : t("createCourse")}</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Language Tabs: Modern Toggle */}
                    <div className="inline-flex p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-[1.5rem] relative">
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("ar")}
                            className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors ${activeTab === "ar" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            {activeTab === "ar" && (
                                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm -z-10" />
                            )}
                            <Globe size={14} />
                            {tf("arabic")}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setActiveTab("ru")}
                            className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors ${activeTab === "ru" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            {activeTab === "ru" && (
                                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm -z-10" />
                            )}
                            <Globe size={14} />
                            {tf("russian")}
                        </motion.button>
                    </div>

                    <AdminCard delay={0.1}>
                        <div className="space-y-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    {activeTab === "ar" ? (
                                        <>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                    <BookOpen size={14} />
                                                    {t("courseTitleAr")}
                                                </label>
                                                <input
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-xl font-black text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
                                                    placeholder={t("courseTitleArPlaceholder")}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("courseDescAr")}</label>
                                                <textarea
                                                    required
                                                    rows={10}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300 outline-none transition-all resize-none placeholder:text-slate-400"
                                                    placeholder={t("courseDescArPlaceholder")}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                    <Globe size={14} />
                                                    {t("courseTitleRu")}
                                                </label>
                                                <input
                                                    value={formData.titleRu}
                                                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                                                    className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-xl font-black text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 text-left"
                                                    dir="ltr"
                                                    placeholder={t("courseTitleRuPlaceholder")}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("courseDescRu")}</label>
                                                <textarea
                                                    rows={10}
                                                    value={formData.descriptionRu}
                                                    onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                                                    className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300 outline-none transition-all resize-none placeholder:text-slate-400 text-left"
                                                    dir="ltr"
                                                    placeholder={t("courseDescRuPlaceholder")}
                                                />
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </AdminCard>
                </div>

                <div className="space-y-8">
                    <AdminCard delay={0.2} title={t("generalSettings")}>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t("slugLabel")}</label>
                                <input
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                    className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-[1.25rem] p-4 text-sm font-black font-mono text-slate-600 dark:text-slate-400 outline-none transition-all"
                                    placeholder="example-course-slug"
                                    dir="ltr"
                                />
                                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{t("slugHint")}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 text-center block w-full">{t("coverImage")}</label>
                                <div className="p-2 bg-slate-100/50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <ImageUploader
                                        value={formData.thumbnail || ""}
                                        onChange={(url: string) => setFormData({ ...formData, thumbnail: url })}
                                        folder="yemen_students/courses"
                                    />
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </form>
    );
}
