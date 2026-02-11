"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArrowRight, Save, FileText, Tag, Pin, Eye, EyeOff, Sparkles, Image as ImageIcon, Loader2, Globe } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { useTranslations } from "next-intl";

export default function NewPostPage() {
  const router = useRouter();
  const t = useTranslations("Admin.forms");
  const [activeTab, setActiveTab] = useState<"ar" | "ru">("ar");

  // Arabic State
  const [titleAr, setTitleAr] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [categoryAr, setCategoryAr] = useState("عام");

  // Russian State
  const [titleRu, setTitleRu] = useState("");
  const [contentRu, setContentRu] = useState("");
  const [categoryRu, setCategoryRu] = useState("Общие");

  const [isDraft, setIsDraft] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleAr,
          content: contentAr,
          category: categoryAr,
          titleRu: titleRu || null,
          contentRu: contentRu || null,
          categoryRu: categoryRu || "Общие",
          image,
          isDraft,
          isPinned
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error || t("errorOccurred", { status: res.status }));
        return;
      }

      setMsg(t("createSuccess"));
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setMsg(t("serverError"));
    } finally {
      setSaving(false);
    }
  }

  const generateWithAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, bilingual: true }),
      });
      const data = await res.json();
      if (data.contentAr || data.content) {
        if (data.titleAr) setTitleAr(data.titleAr);
        if (data.titleRu) setTitleRu(data.titleRu);
        if (data.image) setImage(data.image);
        if (data.contentAr) setContentAr(data.contentAr);
        if (data.contentRu) setContentRu(data.contentRu);
        setShowAiModal(false);
        setAiPrompt("");
      } else {
        setMsg("❌ " + (data.error || t("aiFailed")));
      }
    } catch (err) {
      setMsg(t("aiError"));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title={t("newPostTitle")}
        description={t("newPostDesc")}
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
      >
        {/* Form Header Tabs */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <FileText className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">{t("contentDetails")}</h2>
            </div>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("ar")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "ar" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500"}`}
            >
              {t("arabic")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ru")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "ru" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500"}`}
            >
              {t("russian")}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">

          {/* AR Tab Content */}
          {activeTab === "ar" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"> <FileText size={16} /> {t("titleAr")} </label>
                <input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  required={activeTab === "ar"}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  dir="rtl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"> <FileText size={16} /> {t("contentAr")} </label>
                  <button type="button" onClick={() => setShowAiModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-black">
                    <Sparkles size={14} /> {t("aiGenerate")}
                  </button>
                </div>
                <RichTextEditor content={contentAr} onChange={setContentAr} />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"> <Tag size={16} /> {t("categoryAr")} </label>
                <input value={categoryAr} onChange={(e) => setCategoryAr(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" dir="rtl" />
              </div>
            </motion.div>
          )}

          {/* RU Tab Content */}
          {activeTab === "ru" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"> <Globe size={16} /> {t("titleRu")} </label>
                <input
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  dir="ltr"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"> <FileText size={16} /> {t("contentRu")} </label>
                  <button type="button" onClick={() => setShowAiModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-black">
                    <Sparkles size={14} /> {t("aiTranslateRu")}
                  </button>
                </div>
                <RichTextEditor content={contentRu} onChange={setContentRu} />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"> <Tag size={16} /> {t("categoryRu")} </label>
                <input value={categoryRu} onChange={(e) => setCategoryRu(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" dir="ltr" />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Image Upload */}
            <div className="space-y-2">
              <ImageUploader
                value={image}
                onChange={setImage}
                folder="yemen_students/news"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">{t("displayOptions")}</label>
              <div className="flex flex-wrap gap-2">
                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${isDraft ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}`}>
                  <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} className="sr-only" />
                  {isDraft ? <EyeOff size={18} className="text-orange-500" /> : <Eye size={18} className="text-green-500" />}
                  <span className="text-sm font-bold">{isDraft ? t("draftLabel") : t("publishedLabel")}</span>
                </label>
                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${isPinned ? "bg-purple-50 border-purple-200 shadow-sm" : "bg-slate-50 border-slate-200"}`}>
                  <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="sr-only" />
                  <Pin size={18} className={isPinned ? "text-purple-600" : "text-slate-400"} />
                  <span className="text-sm font-bold">{isPinned ? t("pinnedStar") : t("normalPost")}</span>
                </label>
              </div>
            </div>
          </div>

          {msg && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-xl text-sm font-bold ${msg.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {msg}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all disabled:opacity-50">
            <Save size={18} /> {saving ? t("saving") : t("publishPost")}
          </button>
          <Link href="/admin/posts" className="px-6 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl font-bold flex items-center gap-2">
            <ArrowRight size={18} /> {t("cancel")}
          </Link>
        </div>
      </motion.form>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600"> <Sparkles size={24} /> </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{t("aiModalTitle")}</h3>
                <p className="text-sm text-slate-500">{t("aiModalDesc")}</p>
              </div>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={t("aiPlaceholder")}
              className="w-full min-h-[140px] p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 transition-all mb-6 font-bold"
            />
            <div className="flex gap-3">
              <button onClick={generateWithAI} disabled={aiLoading || !aiPrompt} className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50">
                {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} {t("aiBilingual")}
              </button>
              <button onClick={() => setShowAiModal(false)} className="px-6 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-2xl font-bold">{t("cancel")}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
