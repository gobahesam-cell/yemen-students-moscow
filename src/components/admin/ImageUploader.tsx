"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Link2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
    value: string; // URL الحالي
    onChange: (url: string) => void;
    folder?: string; // المجلد في Cloudinary
}

export default function ImageUploader({ value, onChange, folder = "yemen_students/general" }: ImageUploaderProps) {
    const t = useTranslations("Admin.forms");
    const tf = useTranslations("Admin.forms");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        // Validation
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            setError(t("uploadInvalidType"));
            return;
        }

        // Vercel body size limit is 4.5MB
        if (file.size > 4.5 * 1024 * 1024) {
            setError("حجم الملف يجب أن لا يتجاوز 4.5MB (قيود Vercel)");
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

            if (!res.ok || data.error) {
                // If there's a detailed error from the server (like Vercel limits or Cloudinary issues)
                const errorMsg = data.detail ? `${data.error}: ${data.detail}` : (data.error || t("uploadError"));
                throw new Error(errorMsg);
            }

            if (data.url) {
                onChange(data.url);
                setError("");
            } else {
                throw new Error(t("uploadError") || "Upload failed");
            }
        } catch (err: any) {
            console.error("Upload error details:", err);
            setError(err.message || t("uploadError") || "Upload failed");
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

    // If image exists — show preview
    if (value) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 shadow-sm"
            >
                <div className="aspect-video relative">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    title={t("removeImage")}
                >
                    <X size={18} />
                </motion.button>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <ImageIcon size={14} className="text-white/60" />
                        <p className="text-[10px] text-white/80 truncate font-black uppercase tracking-widest">{value}</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Upload interface
    return (
        <div className="space-y-4">
            <motion.div
                whileHover={{ scale: 1.005 }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative cursor-pointer rounded-[2rem] border-2 border-dashed transition-all duration-500 p-10
                    flex flex-col items-center justify-center gap-4 text-center overflow-hidden
                    ${dragOver
                        ? "border-yellow-500 bg-yellow-500/5 scale-[1.02] shadow-2xl shadow-yellow-500/5"
                        : "border-slate-200 dark:border-white/10 hover:border-yellow-500/50 hover:bg-slate-50 dark:hover:bg-white/5"
                    }
                    ${uploading ? "pointer-events-none" : ""}
                `}
            >
                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="relative">
                                <Loader2 className="animate-spin text-yellow-500" size={48} />
                                <div className="absolute inset-0 blur-xl bg-yellow-500/20 animate-pulse" />
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{t("uploading")}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${dragOver ? "bg-yellow-500 text-white rotate-12" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                                <Upload size={28} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                    {t("dragDrop")}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                                    JPEG, PNG, WebP, GIF<br />
                                    {t("maxSize")} 4.5MB
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </motion.div>

            {/* Paste URL Option */}
            <div className="px-2">
                {!showUrlInput ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        onClick={() => setShowUrlInput(true)}
                        className="flex items-center gap-2 text-[10px] text-slate-400 hover:text-yellow-600 font-black uppercase tracking-[0.15em] transition-colors mx-auto"
                    >
                        <Link2 size={12} />
                        {t("orPasteUrl")}
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 p-1 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5"
                    >
                        <input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 h-12 bg-transparent px-4 text-xs font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                            dir="ltr"
                        />
                        <button
                            type="button"
                            onClick={handleUrlSubmit}
                            className="h-10 px-6 bg-slate-900 dark:bg-yellow-500 text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
                        >
                            {tf("confirm")}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center pt-2">
                            {error}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
