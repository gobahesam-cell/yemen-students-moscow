"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

interface PDFViewerProps {
    pdfUrl: string;
    title: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
    const locale = useLocale();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const isArabic = locale === "ar";

    // تحديد نوع الرابط
    const isLocalFile = pdfUrl.startsWith("/") || pdfUrl.startsWith("./");
    const isGoogleDrive = pdfUrl.includes("drive.google.com");
    const isCloudinary = pdfUrl.includes("cloudinary.com");

    // تحويل الرابط للعرض
    const getEmbedUrl = (url: string) => {
        // ملفات محلية - استخدام مباشر
        if (isLocalFile) {
            return url;
        }

        // Google Drive
        if (isGoogleDrive) {
            const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
            if (fileId) {
                return `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }

        // Cloudinary - استخدام مباشر
        if (isCloudinary) {
            return url;
        }

        // روابط خارجية أخرى - استخدام Google Docs Viewer
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    };

    const embedUrl = getEmbedUrl(pdfUrl);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-rose-500/5 to-pink-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-xl">
                        <FileText className="text-rose-500" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
                        <p className="text-[10px] text-slate-500">
                            {isArabic ? "مستند PDF" : "PDF документ"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
                        title={isArabic ? "فتح في نافذة جديدة" : "Открыть в новом окне"}
                    >
                        <ExternalLink size={18} />
                    </a>
                    <a
                        href={pdfUrl}
                        download
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
                        title={isArabic ? "تحميل" : "Скачать"}
                    >
                        <Download size={18} />
                    </a>
                </div>
            </div>

            {/* PDF Container */}
            <div className="relative" style={{ height: "80vh", minHeight: "500px" }}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800 z-10">
                        <div className="text-center space-y-3">
                            <Loader2 className="animate-spin text-rose-500 mx-auto" size={32} />
                            <p className="text-sm text-slate-500 font-medium">
                                {isArabic ? "جاري تحميل المستند..." : "Загрузка документа..."}
                            </p>
                        </div>
                    </div>
                )}

                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                        <div className="text-center space-y-4 p-8">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto">
                                <FileText className="text-rose-500" size={32} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white mb-1">
                                    {isArabic ? "تعذر عرض المستند" : "Не удалось отобразить"}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {isArabic ? "يرجى تحميل الملف لقراءته" : "Пожалуйста, скачайте файл"}
                                </p>
                            </div>
                            <a
                                href={pdfUrl}
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all"
                            >
                                <Download size={18} />
                                {isArabic ? "تحميل الملف" : "Скачать файл"}
                            </a>
                        </div>
                    </div>
                ) : isLocalFile ? (
                    // للملفات المحلية - استخدام object tag أو embed
                    <object
                        data={embedUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                    >
                        <embed
                            src={embedUrl}
                            type="application/pdf"
                            className="w-full h-full"
                        />
                        {/* Fallback if object/embed don't work */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                            <div className="text-center space-y-4 p-8">
                                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto">
                                    <FileText className="text-rose-500" size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                                        {isArabic ? "متصفحك لا يدعم عرض PDF" : "Ваш браузер не поддерживает PDF"}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {isArabic ? "يرجى تحميل الملف" : "Пожалуйста, скачайте файл"}
                                    </p>
                                </div>
                                <a
                                    href={pdfUrl}
                                    download
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all"
                                >
                                    <Download size={18} />
                                    {isArabic ? "تحميل الملف" : "Скачать файл"}
                                </a>
                            </div>
                        </div>
                    </object>
                ) : (
                    // للروابط الخارجية - استخدام iframe
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        title={title}
                        allow="autoplay"
                    />
                )}
            </div>

            {/* Footer with download button for better UX */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-sm transition-all"
                >
                    <Download size={16} />
                    {isArabic ? "تحميل الملف" : "Скачать файл"}
                </a>
            </div>
        </motion.div>
    );
}
