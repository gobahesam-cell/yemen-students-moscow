"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Loader2, Trash2, Check, X, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Photo {
    id: string;
    url: string;
    caption: string | null;
    createdAt: string;
    album: { id: string; titleAr: string };
    uploader: { id: string; name: string | null; email: string };
}

export default function PendingPhotosPage() {
    const t = useTranslations("Admin.media");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch("/api/admin/photos?pending=true");
            const data = await res.json();
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (photoId: string, action: "approve" | "reject") => {
        setProcessing(photoId);
        try {
            if (action === "approve") {
                await fetch(`/api/admin/photos/${photoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isApproved: true }),
                });
            } else {
                await fetch(`/api/admin/photos/${photoId}`, { method: "DELETE" });
            }
            setPhotos(photos.filter((p) => p.id !== photoId));
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setProcessing(null);
        }
    };

    const handleApproveAll = async () => {
        if (!confirm(t("confirmApproveAll", { count: photos.length }))) return;

        try {
            await fetch("/api/admin/photos/batch", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: photos.map((p) => p.id), action: "approve" }),
            });
            setPhotos([]);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-amber-500" size={40} />
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
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Clock className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t("pendingTitle")}
                        </h1>
                        <p className="text-sm text-slate-500">{t("pendingWaiting", { count: photos.length })}</p>
                    </div>
                </div>

                {photos.length > 0 && (
                    <button
                        onClick={handleApproveAll}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold"
                    >
                        <Check size={18} />
                        {t("approveAll")}
                    </button>
                )}
            </div>

            {/* Photos */}
            {photos.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Check className="text-emerald-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {t("noPending")}
                    </h3>
                    <p className="text-slate-500">{t("allReviewed")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                                <Image
                                    src={photo.url}
                                    alt={photo.caption || "Photo"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                    <span>{photo.uploader.name || photo.uploader.email}</span>
                                    <span>•</span>
                                    <span>{new Date(photo.createdAt).toLocaleDateString("ar-SA")}</span>
                                </div>

                                <Link
                                    href={`/admin/media/albums/${photo.album.id}`}
                                    className="text-sm text-purple-600 hover:underline"
                                >
                                    {photo.album.titleAr}
                                </Link>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4">
                                    <button
                                        onClick={() => handleAction(photo.id, "approve")}
                                        disabled={processing === photo.id}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold disabled:opacity-50"
                                    >
                                        {processing === photo.id ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            <Check size={18} />
                                        )}
                                        {t("approve")}
                                    </button>
                                    <button
                                        onClick={() => handleAction(photo.id, "reject")}
                                        disabled={processing === photo.id}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold disabled:opacity-50"
                                    >
                                        <X size={18} />
                                        {t("reject")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
