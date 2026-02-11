"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, ArrowRight, Loader2, Trash2, Check, Eye, Filter } from "lucide-react";
import { useTranslations } from "next-intl";

interface Photo {
    id: string;
    url: string;
    caption: string | null;
    isApproved: boolean;
    createdAt: string;
    album: { id: string; titleAr: string; titleRu: string | null };
    uploader: { id: string; name: string | null; email: string };
}

export default function AdminPhotosPage() {
    const t = useTranslations("Admin.media");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

    useEffect(() => {
        fetchPhotos();
    }, [filter]);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            let url = "/api/admin/photos";
            if (filter === "approved") url += "?approved=true";
            else if (filter === "pending") url += "?pending=true";

            const res = await fetch(url);
            const data = await res.json();
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchAction = async (action: "approve" | "delete") => {
        if (selectedPhotos.length === 0) return;

        const confirmMsg = action === "delete"
            ? t("confirmDeleteBatch", { count: selectedPhotos.length })
            : t("confirmApproveBatch", { count: selectedPhotos.length });

        if (!confirm(confirmMsg)) return;

        try {
            await fetch("/api/admin/photos/batch", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedPhotos, action }),
            });
            setSelectedPhotos([]);
            await fetchPhotos();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedPhotos((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedPhotos.length === photos.length) {
            setSelectedPhotos([]);
        } else {
            setSelectedPhotos(photos.map((p) => p.id));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/media"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
                    >
                        <ArrowRight size={20} />
                    </Link>
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                        <ImageIcon className="text-purple-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t("allPhotosTitle")}
                        </h1>
                        <p className="text-sm text-slate-500">{t("photoCount", { count: photos.length })}</p>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as "all" | "approved" | "pending")}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    >
                        <option value="all">{t("filterAll")}</option>
                        <option value="approved">{t("filterApproved")}</option>
                        <option value="pending">{t("filterPending")}</option>
                    </select>

                    <button
                        onClick={selectAll}
                        className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        {selectedPhotos.length === photos.length ? t("deselectAll") : t("selectAll")}
                    </button>
                </div>

                {selectedPhotos.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{t("selected", { count: selectedPhotos.length })}</span>
                        <button
                            onClick={() => handleBatchAction("approve")}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold"
                        >
                            <Check size={16} />
                            {t("approve")}
                        </button>
                        <button
                            onClick={() => handleBatchAction("delete")}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold"
                        >
                            <Trash2 size={16} />
                            {t("delete")}
                        </button>
                    </div>
                )}
            </div>

            {/* Photos Grid */}
            {photos.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <ImageIcon className="mx-auto mb-4 text-slate-300" size={48} />
                    <p className="text-slate-500">{t("noPhotos")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className={`relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group cursor-pointer ${selectedPhotos.includes(photo.id) ? "ring-2 ring-purple-500" : ""
                                }`}
                            onClick={() => toggleSelection(photo.id)}
                        >
                            <Image
                                src={photo.url}
                                alt={photo.caption || "Photo"}
                                fill
                                className="object-cover"
                            />

                            {/* Selection indicator */}
                            <div
                                className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPhotos.includes(photo.id)
                                    ? "bg-purple-500 border-purple-500 text-white"
                                    : "bg-white/80 border-slate-300"
                                    }`}
                            >
                                {selectedPhotos.includes(photo.id) && <Check size={14} />}
                            </div>

                            {/* Status */}
                            {!photo.isApproved && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold">
                                    {t("pendingBadge")}
                                </div>
                            )}

                            {/* Info overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/media/albums/${photo.album.id}`}
                                    className="text-white text-xs hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {photo.album.titleAr}
                                </Link>
                                <p className="text-white/70 text-[10px] truncate">
                                    {photo.uploader.name || photo.uploader.email}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
