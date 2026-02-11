"use client";

import { useState } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { Plus, Video, FileText, Link as LinkIcon, Trash2, Edit2, X, Save, Loader2 } from "lucide-react";
import { upsertMaterialAction, deleteMaterialAction } from "@/app/actions/courses";
import { useTranslations } from "next-intl";

interface Material {
    id: string;
    title: string;
    titleRu?: string | null;
    type: string;
    url: string;
}

interface Props {
    courseId: string;
    initialMaterials: Material[];
}

export default function MaterialsListClient({ courseId, initialMaterials }: Props) {
    const t = useTranslations("Admin.courseMaterials");
    const [materials, setMaterials] = useState(initialMaterials);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: "",
        courseId,
        title: "",
        titleRu: "",
        type: "VIDEO",
        url: "",
    });

    const resetForm = () => {
        setFormData({ id: "", courseId, title: "", titleRu: "", type: "VIDEO", url: "" });
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleEdit = (m: Material) => {
        setFormData({
            id: m.id,
            courseId,
            title: m.title,
            titleRu: m.titleRu || "",
            type: m.type,
            url: m.url,
        });
        setEditingId(m.id);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await upsertMaterialAction(formData);
        setLoading(false);

        if (res.success) {
            window.location.reload(); // Simple sync
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("confirmDelete"))) return;
        const res = await deleteMaterialAction(id, courseId);
        if (res.success) {
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6">
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>{t("addNew")}</span>
                </button>
            )}

            {isFormOpen && (
                <AdminCard delay={0} className="border-2 border-blue-500/20 bg-blue-50/10 dark:bg-blue-500/5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">{editingId ? t("editMaterial") : t("newMaterial")}</h3>
                            <button type="button" onClick={resetForm} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 px-1">{t("titleAr")}</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 px-1">{t("titleRu")}</label>
                                <input
                                    value={formData.titleRu}
                                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 px-1">{t("materialType")}</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                >
                                    <option value="VIDEO">{t("typeVideo")}</option>
                                    <option value="PDF">{t("typePdf")}</option>
                                    <option value="LINK">{t("typeLink")}</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 px-1">{t("urlLabel")}</label>
                                <input
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:ring-2 ring-blue-500/20"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                <span>{t("saveMaterial")}</span>
                            </button>
                        </div>
                    </form>
                </AdminCard>
            )}

            <div className="grid gap-4">
                {materials.map((m, i) => (
                    <AdminCard key={m.id} delay={i * 0.05} className="flex items-center justify-between gap-4 p-4 hover:border-blue-500/20 group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                {m.type === "VIDEO" ? <Video size={24} /> : m.type === "PDF" ? <FileText size={24} /> : <LinkIcon size={24} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{m.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.type}</span>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{m.url}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(m)}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors text-blue-500"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(m.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </AdminCard>
                ))}
            </div>
        </div>
    );
}
