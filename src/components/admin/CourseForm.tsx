"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminCard } from "./AdminCard";
import { Save, ArrowRight, BookOpen, Globe, Image as ImageIcon, Loader2 } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
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
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="flex items-center justify-between gap-4 sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="p-3 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-colors text-slate-500"
                >
                    <ArrowRight size={24} />
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>{initialData ? t("saveEdits") : t("createCourse")}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Tabs */}
                    <div className="flex p-1 bg-slate-200/50 dark:bg-white/5 rounded-2xl w-fit">
                        <button
                            type="button"
                            onClick={() => setActiveTab("ar")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "ar" ? "bg-white dark:bg-slate-800 shadow-sm text-yellow-600" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Globe size={16} />
                            {tf("arabic")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("ru")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "ru" ? "bg-white dark:bg-slate-800 shadow-sm text-yellow-600" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Globe size={16} />
                            {tf("russian")}
                        </button>
                    </div>

                    <AdminCard delay={0.1}>
                        <div className="space-y-6">
                            {activeTab === "ar" ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 flex items-center gap-2 px-1">
                                            <BookOpen size={16} />
                                            {t("courseTitleAr")}
                                        </label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 text-lg font-bold outline-none focus:ring-2 ring-yellow-500/20 transition-all"
                                            placeholder={t("courseTitleArPlaceholder")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">{t("courseDescAr")}</label>
                                        <textarea
                                            required
                                            rows={8}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm leading-relaxed outline-none focus:ring-2 ring-yellow-500/20 transition-all resize-none"
                                            placeholder={t("courseDescArPlaceholder")}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 flex items-center gap-2 px-1">
                                            <Globe size={16} />
                                            {t("courseTitleRu")}
                                        </label>
                                        <input
                                            value={formData.titleRu}
                                            onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 text-lg font-bold outline-none focus:ring-2 ring-yellow-500/20 transition-all"
                                            placeholder={t("courseTitleRuPlaceholder")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">{t("courseDescRu")}</label>
                                        <textarea
                                            rows={8}
                                            value={formData.descriptionRu}
                                            onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm leading-relaxed outline-none focus:ring-2 ring-yellow-500/20 transition-all resize-none"
                                            placeholder={t("courseDescRuPlaceholder")}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </AdminCard>
                </div>

                <div className="space-y-6">
                    <AdminCard delay={0.2} title={t("generalSettings")}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 px-1">{t("slugLabel")}</label>
                                <input
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                    className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-mono outline-none focus:ring-2 ring-yellow-500/20 transition-all"
                                    placeholder="example-course-slug"
                                />
                                <p className="text-[10px] text-slate-400 px-1">{t("slugHint")}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 px-1 text-center block">{t("coverImage")}</label>
                                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                                    <div className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden group">
                                        {formData.thumbnail ? (
                                            <>
                                                <img src={formData.thumbnail} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CldUploadButton
                                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ysm_uploads"}
                                                        onSuccess={(res: any) => setFormData({ ...formData, thumbnail: res.info.secure_url })}
                                                        className="bg-white text-black px-4 py-2 rounded-xl font-bold text-xs"
                                                    >
                                                        {t("changeImage")}
                                                    </CldUploadButton>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                                    <ImageIcon size={32} className="text-slate-300" />
                                                </div>
                                                <CldUploadButton
                                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ysm_uploads"}
                                                    onSuccess={(res: any) => setFormData({ ...formData, thumbnail: res.info.secure_url })}
                                                    className="text-yellow-600 font-bold text-sm hover:underline"
                                                >
                                                    {t("uploadImage")}
                                                </CldUploadButton>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video rounded-2xl border-2 border-dashed border-red-200 bg-red-50 dark:bg-red-500/5 flex items-center justify-center text-red-500 p-4 text-center text-xs font-bold">
                                        Cloudinary variables not set in Vercel.
                                        Please add them to the dashboard.
                                    </div>
                                )}
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </form>
    );
}
