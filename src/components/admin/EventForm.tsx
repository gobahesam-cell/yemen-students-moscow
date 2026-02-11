"use client";

import { useState } from "react";
import { AdminCard } from "./AdminCard";
import { Calendar, MapPin, Image as ImageIcon, Type, AlignLeft, Info, Loader2, Users, Sparkles, Globe, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import ImageUploader from "@/components/admin/ImageUploader";

interface EventFormProps {
    initialData?: any;
    mode: "create" | "edit";
}

export function EventForm({ initialData, mode }: EventFormProps) {
    const router = useRouter();
    const t = useTranslations("Admin.eventForm");
    const tf = useTranslations("Admin.forms");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"ar" | "ru">("ar");
    const [aiLoading, setAiLoading] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        titleAr: initialData?.title || "",
        descriptionAr: initialData?.description || "",
        locationAr: initialData?.location || "",

        titleRu: initialData?.titleRu || "",
        descriptionRu: initialData?.descriptionRu || "",
        locationRu: initialData?.locationRu || "",

        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : "",
        image: initialData?.image || "",
        capacity: initialData?.capacity || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        // Validation: Required Arabic fields
        if (!formData.titleAr || !formData.descriptionAr || !formData.locationAr || !formData.date) {
            setErrorMessage(t("validationError"));
            setActiveTab("ar");
            return;
        }

        setLoading(true);

        const url = mode === "create" ? "/api/admin/events" : `/api/admin/events/${initialData.id}`;
        const method = mode === "create" ? "POST" : "PATCH";

        try {
            const dataToSave = {
                title: formData.titleAr,
                description: formData.descriptionAr,
                location: formData.locationAr,
                titleRu: formData.titleRu || null,
                descriptionRu: formData.descriptionRu || null,
                locationRu: formData.locationRu || null,
                date: formData.date,
                image: formData.image,
                capacity: formData.capacity,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
            });

            if (res.ok) {
                router.push("/admin/events");
                router.refresh();
            } else {
                const data = await res.json();
                setErrorMessage(t("saveFailed", { error: data.error || "unknown" }) + (data.details ? ` - ${data.details}` : ''));
            }
        } catch (err) {
            setErrorMessage(t("serverError"));
        } finally {
            setLoading(false);
        }
    };

    const handleAiGenerate = async () => {
        if (!aiPrompt) return;
        setAiLoading(true);
        setErrorMessage(null);
        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt, bilingual: true }),
            });
            const data = await res.json();

            if (data.titleAr || data.contentAr) {
                setFormData(prev => ({
                    ...prev,
                    titleAr: data.titleAr || prev.titleAr,
                    titleRu: data.titleRu || prev.titleRu,
                    descriptionAr: data.contentAr || prev.descriptionAr,
                    descriptionRu: data.contentRu || prev.descriptionRu,
                    image: data.image || prev.image,
                }));
                setShowAiModal(false);
                setAiPrompt("");
            } else {
                setErrorMessage(t("aiFailed"));
            }
        } catch (err) {
            setErrorMessage(t("aiError"));
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

                {/* Error Box */}
                <AnimatePresence>
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-sm"
                        >
                            <AlertCircle size={20} />
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Language Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
                    <button
                        type="button"
                        onClick={() => setActiveTab("ar")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === "ar" ? "bg-white dark:bg-slate-700 text-yellow-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        <Globe size={16} />
                        {tf("arabic")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("ru")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === "ru" ? "bg-white dark:bg-slate-700 text-yellow-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        <Globe size={16} />
                        {tf("russian")}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "ar" ? (
                        <motion.div
                            key="ar-fields"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <AdminCard title={t("arTitle")}>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Type size={16} className="text-yellow-600" />
                                                {t("eventTitle")}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowAiModal(true)}
                                                className="text-[10px] bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:scale-105 transition-all shadow-lg shadow-purple-500/10"
                                            >
                                                <Sparkles size={12} />
                                                {t("aiGenerate")}
                                            </button>
                                        </label>
                                        <input
                                            value={formData.titleAr}
                                            onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                                            placeholder={t("eventTitlePlaceholder")}
                                            dir="rtl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black flex items-center gap-2">
                                            <AlignLeft size={16} className="text-blue-600" />
                                            {t("eventDesc")}
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={formData.descriptionAr}
                                            onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none font-medium"
                                            placeholder={t("eventDescPlaceholder")}
                                            dir="rtl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black flex items-center gap-2">
                                            <MapPin size={16} className="text-rose-600" />
                                            {t("locationAr")}
                                        </label>
                                        <input
                                            value={formData.locationAr}
                                            onChange={e => setFormData({ ...formData, locationAr: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all"
                                            placeholder={t("locationArPlaceholder")}
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            </AdminCard>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ru-fields"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            <AdminCard title={t("ruTitle")}>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black flex items-center gap-2">
                                            <Type size={16} className="text-yellow-600" />
                                            {t("eventTitleRu")}
                                        </label>
                                        <input
                                            value={formData.titleRu}
                                            onChange={e => setFormData({ ...formData, titleRu: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                                            placeholder={t("eventTitleRuPlaceholder")}
                                            dir="ltr"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black flex items-center gap-2">
                                            <AlignLeft size={16} className="text-blue-600" />
                                            {t("eventDescRu")}
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={formData.descriptionRu}
                                            onChange={e => setFormData({ ...formData, descriptionRu: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all resize-none font-medium"
                                            placeholder={t("eventDescRuPlaceholder")}
                                            dir="ltr"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black flex items-center gap-2">
                                            <MapPin size={16} className="text-rose-600" />
                                            {t("locationRu")}
                                        </label>
                                        <input
                                            value={formData.locationRu}
                                            onChange={e => setFormData({ ...formData, locationRu: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                                            placeholder={t("locationRuPlaceholder")}
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AdminCard title={t("timing")}>
                    <div className="space-y-2">
                        <label className="text-sm font-black flex items-center gap-2">
                            <Calendar size={16} className="text-emerald-600" />
                            {t("dateTime")}
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                        />
                    </div>
                </AdminCard>
            </div>

            <div className="space-y-6">
                <AdminCard title={t("settingsMedia")}>
                    <div className="space-y-6">
                        <ImageUploader
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            folder="yemen_students/events"
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-black flex items-center gap-2">
                                <Users size={16} className="text-purple-600" />
                                {t("maxCapacity")}
                            </label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                                placeholder={t("unlimitedPlaceholder")}
                            />
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                                <Info size={12} />
                                {t("unlimitedHint")}
                            </p>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:scale-[1.02] active:scale-[0.98] text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <ImageIcon size={20} />
                                    {mode === "create" ? t("publishEvent") : t("saveChanges")}
                                </>
                            )}
                        </button>
                    </div>
                </AdminCard>

                {/* Info Card */}
                <AdminCard className="bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20">
                    <div className="flex gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg h-fit text-blue-600">
                            <Info size={20} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-blue-900 dark:text-blue-100">{t("tipTitle")}</h4>
                            <p className="text-xs text-blue-700/70 dark:text-blue-300/60 leading-relaxed font-bold">
                                {t("tipDesc")}
                            </p>
                        </div>
                    </div>
                </AdminCard>
            </div>

            {/* AI Assistant Modal */}
            {showAiModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white/10"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">{t("aiTitle")}</h3>
                                <p className="text-sm text-slate-500">{t("aiDesc")}</p>
                            </div>
                        </div>

                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder={t("aiPlaceholder")}
                            className="w-full min-h-[150px] p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 transition-all mb-6 font-bold resize-none"
                        />

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleAiGenerate}
                                disabled={aiLoading || !aiPrompt}
                                className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                                {t("aiBilingual")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAiModal(false)}
                                className="px-6 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                {tf("cancel")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </form>
    );
}
