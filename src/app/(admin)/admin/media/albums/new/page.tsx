"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FolderPlus, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import ImageUploader from "@/components/admin/ImageUploader";

interface Event {
    id: string;
    title: string;
    titleRu: string | null;
}

export default function NewAlbumPage() {
    const router = useRouter();
    const t = useTranslations("Admin.media");
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    const [form, setForm] = useState({
        titleAr: "",
        titleRu: "",
        description: "",
        coverImage: "",
        eventId: "",
        isPublic: true,
    });

    useEffect(() => {
        fetch("/api/admin/events")
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.titleAr.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/albums", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const album = await res.json();
                router.push(`/admin/media/albums/${album.id}`);
            }
        } catch (error) {
            console.error("Error creating album:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-2xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/admin/media/albums"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
                >
                    <ArrowRight size={20} />
                </Link>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                    <FolderPlus className="text-blue-500" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t("createNewAlbum")}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                    {/* Cover Image */}
                    <div>
                        <ImageUploader
                            value={form.coverImage}
                            onChange={(url) => setForm({ ...form, coverImage: url })}
                            folder="yemen_students/albums"
                        />
                    </div>

                    {/* Title Arabic */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t("titleAr")}
                        </label>
                        <input
                            type="text"
                            value={form.titleAr}
                            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={t("titleArPlaceholder")}
                            required
                        />
                    </div>

                    {/* Title Russian */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t("titleRu")}
                        </label>
                        <input
                            type="text"
                            value={form.titleRu}
                            onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Культурная неделя"
                            dir="ltr"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t("descriptionLabel")}
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            rows={3}
                            placeholder={t("descriptionPlaceholder")}
                        />
                    </div>

                    {/* Event Link */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t("linkToEvent")}
                        </label>
                        <select
                            value={form.eventId}
                            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">{t("noLink")}</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">{t("publicAlbum")}</p>
                            <p className="text-sm text-slate-500">{t("publicAlbumDesc")}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isPublic}
                                onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !form.titleAr.trim()}
                    className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            {t("creating")}
                        </>
                    ) : (
                        <>
                            <FolderPlus size={20} />
                            {t("createAlbumBtn")}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
