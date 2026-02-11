"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Save, Trash2, FileText, Tag, Pin, Eye, EyeOff, Sparkles, Image as ImageIcon, Loader2, Globe } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { useTranslations } from "next-intl";

type PostDTO = {
  id: string;
  title: string;
  content: string;
  category: string;
  titleRu?: string | null;
  contentRu?: string | null;
  categoryRu?: string | null;
  isDraft: boolean;
  isPinned: boolean;
  image: string | null;
};

export default function EditPostForm({ post }: { post: PostDTO }) {
  const router = useRouter();
  const t = useTranslations("Admin.forms");
  const [activeTab, setActiveTab] = useState<"ar" | "ru">("ar");

  // Arabic State
  const [titleAr, setTitleAr] = useState(post.title);
  const [contentAr, setContentAr] = useState(post.content);
  const [categoryAr, setCategoryAr] = useState(post.category || "عام");

  // Russian State
  const [titleRu, setTitleRu] = useState(post.titleRu || "");
  const [contentRu, setContentRu] = useState(post.contentRu || "");
  const [categoryRu, setCategoryRu] = useState(post.categoryRu || "Общие");

  const [image, setImage] = useState(post.image || "");
  const [isDraft, setIsDraft] = useState(post.isDraft);
  const [isPinned, setIsPinned] = useState(post.isPinned);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleAr,
          content: contentAr,
          category: categoryAr,
          titleRu,
          contentRu,
          categoryRu,
          image,
          isDraft,
          isPinned
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMsg(t("saveFailed", { error: text.slice(0, 100) }));
        return;
      }

      setMsg(t("saveSuccess"));
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(t("deleteConfirm"))) return;

    setMsg(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) {
        setMsg(t("deleteFailed"));
        return;
      }
      router.replace("/admin/posts");
    } finally {
      setDeleting(false);
    }
  };

  const generateWithAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setMsg(null);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
    >
      {/* Form Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <FileText className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">{t("editPostTitle")}</h2>
            <p className="text-sm text-slate-500">{t("editPostDesc")}</p>
          </div>
        </div>

        {/* Language Tabs Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("ar")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "ar" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            {t("arabic")}
          </button>
          <button
            onClick={() => setActiveTab("ru")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "ru" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            {t("russian")}
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-6 space-y-6">
        {/* Message */}
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-sm font-medium ${msg.includes("✅")
              ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
          >
            {msg}
          </motion.div>
        )}

        {/* Tab Content: Arabic */}
        {activeTab === "ar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <FileText size={16} />
                {t("titleAr")}
              </label>
              <input
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                dir="rtl"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <FileText size={16} />
                  {t("contentAr")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
                >
                  <Sparkles size={14} />
                  {t("aiFormulate")}
                </button>
              </div>
              <RichTextEditor content={contentAr} onChange={setContentAr} />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Tag size={16} />
                {t("categoryAr")}
              </label>
              <input
                value={categoryAr}
                onChange={(e) => setCategoryAr(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                dir="rtl"
              />
            </div>
          </motion.div>
        )}

        {/* Tab Content: Russian */}
        {activeTab === "ru" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Globe size={16} />
                {t("titleRu")}
              </label>
              <input
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                placeholder="Заголовок на русском"
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                dir="ltr"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <FileText size={16} />
                  {t("contentRu")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
                >
                  <Sparkles size={14} />
                  {t("aiTranslateRu")}
                </button>
              </div>
              <RichTextEditor content={contentRu} onChange={setContentRu} />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Tag size={16} />
                {t("categoryRu")}
              </label>
              <input
                value={categoryRu}
                onChange={(e) => setCategoryRu(e.target.value)}
                placeholder="Общие / Новости"
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                dir="ltr"
              />
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

          {/* Common Options */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">{t("displayOptions")}</label>
            <div className="flex flex-wrap gap-3">
              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${isDraft ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30" : "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"}`}>
                <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} className="sr-only" />
                {isDraft ? <EyeOff size={18} className="text-orange-500" /> : <Eye size={18} className="text-green-500" />}
                <span className={`text-sm font-medium ${isDraft ? "text-orange-700 dark:text-orange-400" : "text-green-700 dark:text-green-400"}`}>
                  {isDraft ? t("draftHidden") : t("publishedPublic")}
                </span>
              </label>

              <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${isPinned ? "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="sr-only" />
                <Pin size={18} className={isPinned ? "text-purple-500" : "text-slate-400"} />
                <span className={`text-sm font-medium ${isPinned ? "text-purple-700 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`}>
                  {isPinned ? t("pinnedStar") : t("normalPost")}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form Footer */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
        >
          <Save size={18} />
          {saving ? t("saving") : t("saveChanges")}
        </button>

        <Link
          href="/admin/posts"
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
        >
          <ArrowRight size={18} />
          {t("backToList")}
        </Link>

        <button
          onClick={remove}
          disabled={deleting}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-all mr-auto disabled:opacity-50"
        >
          <Trash2 size={18} />
          {deleting ? t("deleting") : t("deletePost")}
        </button>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{t("aiEditModalTitle")}</h3>
                  <p className="text-sm text-slate-500">{t("aiEditModalDesc")}</p>
                </div>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={t("aiEditPlaceholder")}
                className="w-full min-h-[120px] p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all resize-none text-sm font-bold"
              />

              <div className="flex gap-3">
                <button
                  onClick={generateWithAI}
                  disabled={aiLoading || !aiPrompt}
                  className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  {t("aiEditGenerate")}
                </button>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-6 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
