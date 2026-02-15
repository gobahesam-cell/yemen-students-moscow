"use client";

import { useState } from "react";
import { AdminCard } from "./AdminCard";
import { Calendar, MapPin, Image as ImageIcon, Type, AlignLeft, Info, Loader2, Users, Sparkles, Globe, AlertCircle, ArrowRight, Save } from "lucide-react";
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
        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
            {/* Sticky Header with Glassmorphism */}
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
                        {mode === "create" ? t("publishEvent") : t("editEvent")}
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowAiModal(true)}
                        className="hidden sm:flex items-center gap-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all"
                    >
                        <Sparkles size={16} />
                        {t("aiGenerate")}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="group flex items-center gap-3 bg-slate-900 dark:bg-emerald-500 text-white dark:text-black px-8 py-4 rounded-[1.5rem] font-black text-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} className="group-hover:rotate-12 transition-transform" />}
                        <span className="uppercase tracking-widest">{mode === "create" ? t("publishEvent") : t("saveChanges")}</span>
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Error Box */}
                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center gap-4 text-rose-500 font-bold"
                            >
                                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                                    <AlertCircle size={20} />
                                </div>
                                <p className="text-sm leading-relaxed">{errorMessage}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Language Tabs & AI Shortcut */}
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="inline-flex p-1.5 bg-slate-200/50 dark:bg-white/5 rounded-[1.5rem] relative">
                            <motion.button
                                type="button"
                                onClick={() => setActiveTab("ar")}
                                className={`relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors ${activeTab === "ar" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                            >
                                {activeTab === "ar" && (
                                    <motion.div layoutId="activeTabEvent" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm -z-10" />
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
                                    <motion.div layoutId="activeTabEvent" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm -z-10" />
                                )}
                                <Globe size={14} />
                                {tf("russian")}
                            </motion.button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAiModal(true)}
                            className="sm:hidden flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest"
                        >
                            <Sparkles size={14} />
                            {t("aiGenerate")}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <AdminCard delay={0.1}>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                            <Type size={14} className="text-yellow-500" />
                                            {activeTab === 'ar' ? t("eventTitle") : t("eventTitleRu")}
                                        </label>
                                        <input
                                            value={activeTab === 'ar' ? formData.titleAr : formData.titleRu}
                                            onChange={e => setFormData({ ...formData, [activeTab === 'ar' ? 'titleAr' : 'titleRu']: e.target.value })}
                                            className={`w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-xl font-black text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 ${activeTab === 'ru' ? 'text-left' : ''}`}
                                            dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                            placeholder={activeTab === 'ar' ? t("eventTitlePlaceholder") : t("eventTitleRuPlaceholder")}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                            <AlignLeft size={14} className="text-blue-500" />
                                            {activeTab === 'ar' ? t("eventDesc") : t("eventDescRu")}
                                        </label>
                                        <textarea
                                            rows={12}
                                            value={activeTab === 'ar' ? formData.descriptionAr : formData.descriptionRu}
                                            onChange={e => setFormData({ ...formData, [activeTab === 'ar' ? 'descriptionAr' : 'descriptionRu']: e.target.value })}
                                            className={`w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300 outline-none transition-all resize-none placeholder:text-slate-400 ${activeTab === 'ru' ? 'text-left' : ''}`}
                                            dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                            placeholder={activeTab === 'ar' ? t("eventDescPlaceholder") : t("eventDescRuPlaceholder")}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                            <MapPin size={14} className="text-rose-500" />
                                            {activeTab === 'ar' ? t("locationAr") : t("locationRu")}
                                        </label>
                                        <input
                                            value={activeTab === 'ar' ? formData.locationAr : formData.locationRu}
                                            onChange={e => setFormData({ ...formData, [activeTab === 'ar' ? 'locationAr' : 'locationRu']: e.target.value })}
                                            className={`w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-5 text-lg font-black text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 ${activeTab === 'ru' ? 'text-left' : ''}`}
                                            dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                                            placeholder={activeTab === 'ar' ? t("locationArPlaceholder") : t("locationRuPlaceholder")}
                                        />
                                    </div>
                                </div>
                            </AdminCard>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="space-y-10">
                    <AdminCard title={t("timing")}>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Calendar size={14} className="text-emerald-500" />
                                {t("dateTime")}
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-4 text-sm font-black text-slate-900 dark:text-white outline-none transition-all"
                            />
                        </div>
                    </AdminCard>

                    <AdminCard title={t("settingsMedia")}>
                        <div className="space-y-8">
                            <div className="p-2 bg-slate-100/50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                <ImageUploader
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                    folder="yemen_students/events"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                    <Users size={14} className="text-purple-500" />
                                    {t("maxCapacity")}
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-yellow-500/20 rounded-2xl p-4 text-sm font-black text-slate-900 dark:text-white outline-none transition-all"
                                    placeholder={t("unlimitedPlaceholder")}
                                />
                                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
                                    <Info size={14} className="text-slate-400" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                                        {t("unlimitedHint")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    {/* Tip Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-blue-600/5 dark:bg-blue-500/5 border border-blue-600/10 dark:border-blue-500/20 rounded-[2rem] p-8 shadow-sm"
                    >
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0 text-blue-600 shadow-sm shadow-blue-600/5">
                                <Sparkles size={20} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest">{t("tipTitle")}</h4>
                                <p className="text-xs text-blue-700/80 dark:text-blue-300/60 leading-relaxed font-bold">
                                    {t("tipDesc")}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* AI Assistant Modal: Premium Redesign */}
            <AnimatePresence>
                {showAiModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAiModal(false)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative bg-white dark:bg-slate-950 w-full max-w-xl rounded-[3rem] p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden group"
                        >
                            {/* Accent Gradients */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-purple-500/20 group-hover:rotate-6 transition-transform duration-500">
                                        <Sparkles size={36} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{t("aiTitle")}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("aiDesc")}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Describe your event (Ar or Ru)</label>
                                    <textarea
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder={t("aiPlaceholder")}
                                        className="w-full min-h-[200px] p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-purple-500/20 text-slate-900 dark:text-white outline-none transition-all font-bold resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={handleAiGenerate}
                                        disabled={aiLoading || !aiPrompt}
                                        className="flex-1 h-16 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-2xl transition-all disabled:opacity-50"
                                    >
                                        {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                                        <span className="uppercase tracking-[0.15em] text-xs font-black">{t("aiBilingual")}</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setShowAiModal(false)}
                                        className="px-10 h-16 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-white/10 transition-all uppercase tracking-[0.15em] text-xs font-black"
                                    >
                                        {tf("cancel")}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </form>
    );
}
