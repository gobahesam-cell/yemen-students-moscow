"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FolderOpen, Plus, Trash2, Edit, ImageIcon, ArrowRight, Loader2, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface Album {
    id: string;
    titleAr: string;
    titleRu: string | null;
    description: string | null;
    coverImage: string | null;
    isPublic: boolean;
    createdAt: string;
    event: { id: string; title: string; titleRu: string | null } | null;
    _count: { photos: number };
}

export default function AdminAlbumsPage() {
    const t = useTranslations("Admin.media");
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const res = await fetch("/api/admin/albums");
            const data = await res.json();
            setAlbums(data);
        } catch (error) {
            console.error("Error fetching albums:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("confirmDeleteAlbum"))) {
            return;
        }

        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/albums/${id}`, { method: "DELETE" });
            if (res.ok) {
                setAlbums(albums.filter((a) => a.id !== id));
            }
        } catch (error) {
            console.error("Error deleting album:", error);
        } finally {
            setDeleting(null);
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
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <FolderOpen className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("albumsTitle")}</h1>
                        <p className="text-sm text-slate-500">{t("albumCount", { count: albums.length })}</p>
                    </div>
                </div>

                <Link
                    href="/admin/media/albums/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all"
                >
                    <Plus size={18} />
                    {t("newAlbumBtn")}
                </Link>
            </div>

            {/* Albums Grid */}
            {albums.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {t("noAlbums")}
                    </h3>
                    <p className="text-slate-500 mb-4">{t("startCreating")}</p>
                    <Link
                        href="/admin/media/albums/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-bold"
                    >
                        <Plus size={18} />
                        {t("createAlbum")}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                        <div
                            key={album.id}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all"
                        >
                            {/* Cover */}
                            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                                {album.coverImage ? (
                                    <Image
                                        src={album.coverImage}
                                        alt={album.titleAr}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FolderOpen className="text-slate-300 dark:text-slate-600" size={48} />
                                    </div>
                                )}

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Link
                                        href={`/admin/media/albums/${album.id}`}
                                        className="p-3 bg-white rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit size={20} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(album.id)}
                                        disabled={deleting === album.id}
                                        className="p-3 bg-white rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {deleting === album.id ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <Trash2 size={20} />
                                        )}
                                    </button>
                                </div>

                                {/* Photo Count Badge */}
                                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded-lg text-white text-sm flex items-center gap-1">
                                    <ImageIcon size={14} />
                                    {album._count.photos}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                    {album.titleAr}
                                </h3>
                                {album.titleRu && (
                                    <p className="text-sm text-slate-500 mb-2">{album.titleRu}</p>
                                )}

                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar size={12} />
                                    {new Date(album.createdAt).toLocaleDateString("ar-SA")}
                                </div>

                                {album.event && (
                                    <div className="mt-2 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs inline-block">
                                        {album.event.title}
                                    </div>
                                )}

                                {!album.isPublic && (
                                    <div className="mt-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs inline-block">
                                        {t("private")}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
