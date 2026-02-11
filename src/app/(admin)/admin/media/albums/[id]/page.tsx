"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FolderOpen, Loader2, Upload, Trash2, Save, ImageIcon, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Photo {
    id: string;
    url: string;
    caption: string | null;
    isApproved: boolean;
    createdAt: string;
    uploader: { id: string; name: string | null; email: string };
}

interface Album {
    id: string;
    titleAr: string;
    titleRu: string | null;
    description: string | null;
    coverImage: string | null;
    isPublic: boolean;
    eventId: string | null;
    event: { id: string; title: string; titleRu: string | null } | null;
    photos: Photo[];
}

interface Event {
    id: string;
    title: string;
    titleRu: string | null;
}

export default function AlbumDetailPage() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations("Admin.media");
    const albumId = params.id as string;

    const [album, setAlbum] = useState<Album | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

    const [form, setForm] = useState({
        titleAr: "",
        titleRu: "",
        description: "",
        coverImage: "",
        eventId: "",
        isPublic: true,
    });

    const fetchAlbum = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/albums/${albumId}`);
            const data = await res.json();
            setAlbum(data);
            setForm({
                titleAr: data.titleAr || "",
                titleRu: data.titleRu || "",
                description: data.description || "",
                coverImage: data.coverImage || "",
                eventId: data.eventId || "",
                isPublic: data.isPublic,
            });
        } catch (error) {
            console.error("Error fetching album:", error);
        } finally {
            setLoading(false);
        }
    }, [albumId]);

    useEffect(() => {
        fetchAlbum();
        fetch("/api/admin/events")
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch(console.error);
    }, [fetchAlbum]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`/api/admin/albums/${albumId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            await fetchAlbum();
        } catch (error) {
            console.error("Error saving album:", error);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("albumId", albumId);

                await fetch("/api/admin/photos", {
                    method: "POST",
                    body: formData,
                });
            }
            await fetchAlbum();
        } catch (error) {
            console.error("Error uploading photos:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhotos = async () => {
        if (selectedPhotos.length === 0) return;
        if (!confirm(t("confirmDeletePhotos", { count: selectedPhotos.length }))) return;

        try {
            await fetch("/api/admin/photos/batch", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedPhotos, action: "delete" }),
            });
            setSelectedPhotos([]);
            await fetchAlbum();
        } catch (error) {
            console.error("Error deleting photos:", error);
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        try {
            await fetch(`/api/admin/photos/${photoId}`, { method: "DELETE" });
            await fetchAlbum();
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    const handleApprovePhoto = async (photoId: string, approve: boolean) => {
        try {
            await fetch(`/api/admin/photos/${photoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: approve }),
            });
            await fetchAlbum();
        } catch (error) {
            console.error("Error updating photo:", error);
        }
    };

    const togglePhotoSelection = (photoId: string) => {
        setSelectedPhotos((prev) =>
            prev.includes(photoId)
                ? prev.filter((id) => id !== photoId)
                : [...prev, photoId]
        );
    };

    const setAsCover = (url: string) => {
        setForm({ ...form, coverImage: url });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        );
    }

    if (!album) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">{t("albumNotFound")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/media/albums"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
                    >
                        <ArrowRight size={20} />
                    </Link>
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <FolderOpen className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            {album.titleAr}
                        </h1>
                        <p className="text-sm text-slate-500">{t("photoCount", { count: album.photos.length })}</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {t("saveChanges")}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Album Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <h2 className="font-bold text-slate-900 dark:text-white">{t("albumSettings")}</h2>

                        {/* Cover */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                {t("coverImage")}
                            </label>
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                                {form.coverImage ? (
                                    <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title Ar */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {t("titleAr")}
                            </label>
                            <input
                                type="text"
                                value={form.titleAr}
                                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                            />
                        </div>

                        {/* Title Ru */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {t("titleRu")}
                            </label>
                            <input
                                type="text"
                                value={form.titleRu}
                                onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                dir="ltr"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {t("descriptionLabel")}
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Event */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {t("linkEvent")}
                            </label>
                            <select
                                value={form.eventId}
                                onChange={(e) => setForm({ ...form, eventId: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                            >
                                <option value="">{t("noLinkShort")}</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Public */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{t("publicAlbum")}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isPublic}
                                    onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Photos Grid */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Upload / Actions Bar */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                        <div className="flex items-center gap-2">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold cursor-pointer transition-all">
                                {uploading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <Upload size={18} />
                                )}
                                {t("uploadPhotos")}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>

                            {selectedPhotos.length > 0 && (
                                <button
                                    onClick={handleDeletePhotos}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold"
                                >
                                    <Trash2 size={18} />
                                    {t("deleteSelected", { count: selectedPhotos.length })}
                                </button>
                            )}
                        </div>

                        <span className="text-sm text-slate-500">
                            {t("photoCount", { count: album.photos.length })}
                        </span>
                    </div>

                    {/* Photos */}
                    {album.photos.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                            <ImageIcon className="mx-auto mb-4 text-slate-300" size={48} />
                            <p className="text-slate-500">{t("noPhotosInAlbum")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {album.photos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className={`relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group ${selectedPhotos.includes(photo.id) ? "ring-2 ring-blue-500" : ""
                                        }`}
                                >
                                    <Image
                                        src={photo.url}
                                        alt={photo.caption || "Photo"}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Selection Checkbox */}
                                    <button
                                        onClick={() => togglePhotoSelection(photo.id)}
                                        className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPhotos.includes(photo.id)
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : "bg-white/80 border-slate-300"
                                            }`}
                                    >
                                        {selectedPhotos.includes(photo.id) && <Check size={14} />}
                                    </button>

                                    {/* Status Badge */}
                                    {!photo.isApproved && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white rounded text-xs font-bold">
                                            {t("pendingBadge")}
                                        </div>
                                    )}

                                    {/* Hover Actions */}
                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setAsCover(photo.url)}
                                                className="p-1.5 bg-white rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 text-xs"
                                                title={t("setCover")}
                                            >
                                                <ImageIcon size={14} />
                                            </button>
                                            {!photo.isApproved && (
                                                <button
                                                    onClick={() => handleApprovePhoto(photo.id, true)}
                                                    className="p-1.5 bg-white rounded-lg text-slate-700 hover:bg-green-50 hover:text-green-600"
                                                    title={t("approve")}
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeletePhoto(photo.id)}
                                                className="p-1.5 bg-white rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600"
                                                title={t("delete")}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
