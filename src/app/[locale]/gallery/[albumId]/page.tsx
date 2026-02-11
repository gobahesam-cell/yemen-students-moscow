"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, ImageIcon, X, ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

interface Photo {
    id: string;
    url: string;
    caption: string | null;
}

interface Album {
    id: string;
    titleAr: string;
    titleRu: string | null;
    description: string | null;
    photos: Photo[];
}

export default function AlbumPage() {
    const params = useParams();
    const locale = useLocale();
    const albumId = params.albumId as string;
    const isArabic = locale === "ar";

    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const res = await fetch(`/api/gallery/${albumId}`);
                if (res.ok) {
                    const data = await res.json();
                    setAlbum(data);
                }
            } catch (error) {
                console.error("Error fetching album:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [albumId]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex === null || !album) return;

        if (e.key === "Escape") {
            setSelectedIndex(null);
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            const direction = e.key === "ArrowRight" ? 1 : -1;
            const newIndex = selectedIndex + direction;
            if (newIndex >= 0 && newIndex < album.photos.length) {
                setSelectedIndex(newIndex);
            }
        }
    }, [selectedIndex, album]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        );
    }

    if (!album) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {isArabic ? "الألبوم غير موجود" : "Альбом не найден"}
                    </h1>
                    <Link href={`/${locale}/gallery`} className="text-purple-600 hover:underline">
                        {isArabic ? "العودة للمعرض" : "Вернуться в галерею"}
                    </Link>
                </div>
            </div>
        );
    }

    const selectedPhoto = selectedIndex !== null ? album.photos[selectedIndex] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/${locale}/gallery`}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
                    >
                        {isArabic ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                            {isArabic ? album.titleAr : album.titleRu || album.titleAr}
                        </h1>
                        {album.description && (
                            <p className="text-slate-500 mt-1">{album.description}</p>
                        )}
                        <p className="text-sm text-slate-400 mt-1">
                            {album.photos.length} {isArabic ? "صورة" : "фото"}
                        </p>
                    </div>
                </div>

                {/* Photos Grid */}
                {album.photos.length === 0 ? (
                    <div className="text-center py-20">
                        <ImageIcon className="mx-auto mb-4 text-slate-300" size={60} />
                        <p className="text-slate-500">
                            {isArabic ? "لا توجد صور في هذا الألبوم" : "В этом альбоме нет фотографий"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {album.photos.map((photo, index) => (
                            <button
                                key={photo.id}
                                onClick={() => setSelectedIndex(index)}
                                className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.caption || `Photo ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedPhoto && selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setSelectedIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedIndex(null)}
                        className="absolute top-4 right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X size={28} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
                        {selectedIndex + 1} / {album.photos.length}
                    </div>

                    {/* Previous Button */}
                    {selectedIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex - 1);
                            }}
                            className="absolute left-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}

                    {/* Next Button */}
                    {selectedIndex < album.photos.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(selectedIndex + 1);
                            }}
                            className="absolute right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative max-w-[90vw] max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedPhoto.url}
                            alt={selectedPhoto.caption || "Photo"}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[85vh] object-contain"
                        />

                        {/* Caption & Download */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-end justify-between">
                                {selectedPhoto.caption && (
                                    <p className="text-white text-sm">{selectedPhoto.caption}</p>
                                )}
                                <a
                                    href={selectedPhoto.url}
                                    download
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
