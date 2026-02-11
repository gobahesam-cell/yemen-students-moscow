"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Link2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ImageUploaderProps {
    value: string; // URL الحالي
    onChange: (url: string) => void;
    folder?: string; // المجلد في Cloudinary
}

export default function ImageUploader({ value, onChange, folder = "yemen_students/general" }: ImageUploaderProps) {
    const t = useTranslations("Admin.forms");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        // التحقق من النوع
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            setError(t("uploadInvalidType"));
            return;
        }

        // التحقق من الحجم (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError(t("uploadTooLarge"));
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t("uploadError"));
            }

            onChange(data.url);
        } catch (err: any) {
            setError(err.message || t("uploadError"));
        } finally {
            setUploading(false);
        }
    }, [folder, onChange, t]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        // إعادة تعيين الحقل للسماح برفع نفس الملف مرة أخرى
        e.target.value = "";
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput("");
            setShowUrlInput(false);
        }
    };

    const handleRemove = () => {
        onChange("");
        setError("");
    };

    // إذا يوجد صورة — نعرض المعاينة
    if (value) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                    <ImageIcon size={16} className="text-indigo-600" />
                    {t("coverImage")}
                </label>
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                    <div className="aspect-video relative">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                        title={t("removeImage")}
                    >
                        <X size={16} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-[10px] text-white/70 truncate font-mono">{value}</p>
                    </div>
                </div>
            </div>
        );
    }

    // واجهة الرفع
    return (
        <div className="space-y-2">
            <label className="text-sm font-black flex items-center gap-2">
                <ImageIcon size={16} className="text-indigo-600" />
                {t("coverImage")}
            </label>

            {/* منطقة السحب والإفلات */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8
                    flex flex-col items-center justify-center gap-3 text-center
                    ${dragOver
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 scale-[1.01]"
                        : "border-slate-200 dark:border-slate-700 hover:border-yellow-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                    ${uploading ? "pointer-events-none opacity-60" : ""}
                `}
            >
                {uploading ? (
                    <>
                        <Loader2 className="animate-spin text-yellow-500" size={36} />
                        <p className="text-sm font-bold text-slate-500">{t("uploading")}</p>
                    </>
                ) : (
                    <>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-yellow-500/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                            <Upload className={`${dragOver ? "text-yellow-600" : "text-slate-400"}`} size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {t("dragDrop")}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold">
                                JPEG, PNG, WebP, GIF — {t("maxSize")} 10MB
                            </p>
                        </div>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* خيار لصق رابط */}
            {!showUrlInput ? (
                <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold transition-colors mx-auto"
                >
                    <Link2 size={12} />
                    {t("orPasteUrl")}
                </button>
            ) : (
                <div className="flex gap-2">
                    <input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20"
                        onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                    />
                    <button
                        type="button"
                        onClick={handleUrlSubmit}
                        className="h-10 px-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-sm font-bold transition-colors"
                    >
                        ✓
                    </button>
                    <button
                        type="button"
                        onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                        className="h-10 px-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* رسالة خطأ */}
            {error && (
                <p className="text-xs text-red-500 font-bold text-center">{error}</p>
            )}
        </div>
    );
}
