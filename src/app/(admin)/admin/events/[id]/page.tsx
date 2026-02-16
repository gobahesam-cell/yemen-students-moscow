"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { EventForm } from "@/components/admin/EventForm";
import {
    ArrowRight, Loader2, Users, Mail, Shield, Trash2, Calendar,
    Clock, UserCheck, Search, Filter, MoreVertical, ExternalLink,
    Download, MapPin, GraduationCap, Phone, User, Languages,
    CheckCircle2, AlertCircle, FileSpreadsheet, Edit, Printer,
    FileText, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();
    const t = useTranslations("Admin.eventPages");
    const locale = useLocale();
    const isRTL = locale === "ar";

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeView, setActiveView] = useState<"edit" | "attendees">("edit");
    const [showPrintView, setShowPrintView] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/events/${id}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
            <p className="font-black text-slate-500 animate-pulse tracking-widest uppercase text-xs">
                {t("reports.fetching")}
            </p>
        </div>
    );

    if (!event) return (
        <div className="text-center py-32 bg-rose-500/5 rounded-[3rem] border border-rose-500/10 mx-6">
            <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
            <p className="text-rose-500 font-black text-2xl tracking-tight">{t("notFound")}</p>
            <Link href="/admin/events" className="mt-8 inline-flex items-center gap-2 text-slate-900 dark:text-white font-black hover:underline px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95">
                <ArrowRight className="rtl:rotate-0 rotate-180" size={20} />
                {t("reports.backToEvents")}
            </Link>
        </div>
    );

    const filteredRSVPs = event.rsvps.filter((rsvp: any) =>
        rsvp.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rsvp.user.nameRu && rsvp.user.nameRu.toLowerCase().includes(searchTerm.toLowerCase())) ||
        rsvp.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Enhanced Professional Excel Generation (HTML based for styling) ---
    const exportToExcel = () => {
        const reportTitle = t("reports.officialAttendance");
        const eventInfo = `
            <div style="font-family: Arial; text-align: center; margin-bottom: 20px;">
                <h1 style="color: #10b981;">${reportTitle}</h1>
                <p><strong>${t('reports.event')}:</strong> ${event.title}</p>
                <p><strong>${t('reports.date')}:</strong> ${new Date(event.date).toLocaleDateString(locale)}</p>
                <p><strong>${t('reports.location')}:</strong> ${event.location}</p>
            </div>
        `;

        const tableHeaders = [
            t("reports.no"),
            t("reports.fullName"),
            t("reports.russianName"),
            t("reports.email"),
            t("reports.phone"),
            t("reports.university"),
            t("reports.city"),
            t("reports.regDate")
        ];

        let rows = "";
        event.rsvps.forEach((rsvp: any, index: number) => {
            const u = rsvp.user;
            rows += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${u.name || ""}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${u.nameRu || ""}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${u.email}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${u.phone || ""}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${u.university || ""}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${u.city || ""}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${new Date(rsvp.createdAt).toLocaleDateString(locale)}</td>
                </tr>
            `;
        });

        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Attendees</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                <style>
                    table { border-collapse: collapse; width: 100%; direction: ${isRTL ? 'rtl' : 'ltr'}; }
                    th { background-color: #10b981; color: white; border: 1px solid #ddd; padding: 12px; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9fafb; }
                </style>
            </head>
            <body>
                ${eventInfo}
                <table>
                    <thead>
                        <tr>${tableHeaders.map(h => `<th>${h}</th>`).join("")}</tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Report_${event.title.replace(/\s+/g, '_')}.xls`;
        link.click();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-10 pb-32" dir={isRTL ? "rtl" : "ltr"}>
            {/* Custom Styles for Printing */}
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; }
                    .print-table { width: 100% !important; border-collapse: collapse !important; margin-top: 20px; }
                    .print-table th, .print-table td { border: 1px solid #000 !important; padding: 12px !important; text-align: right !important; font-size: 10pt !important; }
                    .print-table th { background: #f0f0f0 !important; font-weight: bold !important; }
                    @page { margin: 1cm; }
                }
                .print-only { display: none; }
            `}</style>

            {/* Print View Content (Visible only when printing) */}
            <div className="print-only p-8 bg-white text-black">
                <div className="text-center mb-10 border-b-4 border-slate-900 pb-6">
                    <h1 className="text-3xl font-black mb-2">{t("reports.officialAttendance")}</h1>
                    <p className="text-xl font-bold">{event.title}</p>
                    <div className="flex justify-center gap-8 mt-4 text-sm">
                        <span><strong>{t("reports.date")}:</strong> {new Date(event.date).toLocaleDateString(locale)}</span>
                        <span><strong>{t("reports.totalRSVPs")}</strong> {event.rsvps.length}</span>
                    </div>
                </div>
                <table className="print-table w-full">
                    <thead>
                        <tr>
                            <th>{t("reports.no")}</th>
                            <th>{t("reports.fullName")}</th>
                            <th>{t("reports.russianName")}</th>
                            <th>{t("reports.university")}</th>
                            <th>{t("reports.phone")}</th>
                            <th>{t("reports.email")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event.rsvps.map((rsvp: any, i: number) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{rsvp.user.name}</td>
                                <td>{rsvp.user.nameRu || "-"}</td>
                                <td>{rsvp.user.university || "-"}</td>
                                <td>{rsvp.user.phone || "-"}</td>
                                <td>{rsvp.user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-20 flex justify-between text-sm italic">
                    <p>{t("reports.generatedFromDashboard")}</p>
                    <p>{new Date().toLocaleString(locale)}</p>
                </div>
            </div>

            {/* Premium Header with Dynamic Backdrop */}
            <div className="no-print relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-12 text-white shadow-2xl transition-all duration-500">
                <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-emerald-500/30 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/events"
                            className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/10 transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-2xl"
                        >
                            <ArrowRight size={28} className="rtl:rotate-0 rotate-180" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/20">
                                    {t("manageEvent")}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black md:text-5xl tracking-tight leading-tight">
                                {event.title}
                            </h1>
                            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl backdrop-blur-md">
                                    <Calendar size={16} className="text-emerald-400" />
                                    {new Date(event.date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl backdrop-blur-md">
                                    <MapPin size={16} className="text-blue-400" />
                                    {event.location}
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-2xl backdrop-blur-md border border-emerald-500/20">
                                    <Users size={16} />
                                    <span className="text-emerald-400">{event.rsvps.length}</span>
                                    {t("registered")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-3 rounded-2xl bg-white text-slate-900 px-6 py-4 font-black transition-all hover:scale-105 active:scale-95 group shadow-xl"
                        >
                            <Printer size={22} className="group-hover:-rotate-6 transition-transform" />
                            <span>{t("printSheet")}</span>
                        </button>

                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-5 font-black text-white transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] active:scale-95 group"
                        >
                            <FileSpreadsheet size={22} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-lg tracking-tight">{t("excelExport")}</span>
                        </button>
                    </div>
                </div>

                {/* Glass Tab Switcher */}
                <div className="mt-12 flex border-t border-white/5 pt-8">
                    <div className="flex gap-3 rounded-[2rem] bg-black/20 p-2 backdrop-blur-3xl border border-white/5">
                        <button
                            onClick={() => setActiveView("edit")}
                            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${activeView === 'edit' ? 'bg-white text-slate-900 shadow-2xl scale-100' : 'text-slate-400 hover:text-white hover:bg-white/5 scale-95'}`}
                        >
                            <Edit size={20} />
                            {t("detailsTab")}
                        </button>
                        <button
                            onClick={() => setActiveView("attendees")}
                            className={`flex items-center gap-2.5 px-8 py-3.5 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${activeView === 'attendees' ? 'bg-white text-slate-900 shadow-2xl scale-100' : 'text-slate-400 hover:text-white hover:bg-white/5 scale-95'}`}
                        >
                            <CheckCircle2 size={20} className={activeView === 'attendees' ? 'text-emerald-500' : ''} />
                            {t("attendeesTab")}
                            <span className={`ml-2 px-3 py-0.5 rounded-full text-[10px] ${activeView === 'attendees' ? 'bg-slate-900 text-white' : 'bg-white/10 text-slate-400'}`}>
                                {event.rsvps.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="no-print">
                <AnimatePresence mode="wait">
                    {activeView === "edit" ? (
                        <motion.div
                            key="edit-view"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                        >
                            <EventForm mode="edit" initialData={event} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="attendance-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="grid grid-cols-1 gap-10 lg:grid-cols-4"
                        >
                            {/* More Beautiful Attendance Table Card */}
                            <div className="lg:col-span-3">
                                <AdminCard
                                    title={t("certifiedRegistry")}
                                    description={t("detailedListDesc")}
                                    className="overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-100 dark:border-white/5 rounded-[3rem] shadow-sm"
                                >
                                    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-2">
                                        <div className="relative w-full max-w-md group">
                                            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" size={20} />
                                            <input
                                                type="text"
                                                placeholder={t("searchPlaceholder")}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="h-14 w-full rounded-[1.5rem] border border-slate-200 bg-white/50 pr-14 pl-6 text-sm font-black outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950/50 transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 items-center gap-3 rounded-[1.5rem] bg-slate-50 px-6 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                                                <Filter size={18} className="text-slate-400" />
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{t("sort")}</span>
                                                <span className="text-xs font-black text-slate-900 dark:text-white">{t("newest")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[2.5rem] border border-slate-100 bg-white/30 dark:border-slate-800/50 dark:bg-slate-900/30 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-right">
                                                <thead>
                                                    <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t("tableHeaderStudent")}</th>
                                                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t("tableHeaderStudy")}</th>
                                                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hidden xl:table-cell">{t("tableHeaderContact")}</th>
                                                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">{t("tableHeaderRegisteredAt")}</th>
                                                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-left">{t("actions")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {filteredRSVPs.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="py-24 text-center">
                                                                <div className="flex flex-col items-center gap-4 opacity-50">
                                                                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                                                        <Search size={32} />
                                                                    </div>
                                                                    <p className="font-black text-slate-400 italic text-lg tracking-tight">
                                                                        {t("noResultsFound")}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        filteredRSVPs.map((rsvp: any, idx: number) => (
                                                            <tr key={rsvp.id} className="group transition-all duration-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-5">
                                                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[1.2rem] bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 shadow-md group-hover:scale-110 transition-transform">
                                                                            {rsvp.user.image ? (
                                                                                <img src={rsvp.user.image} alt="" className="h-full w-full object-cover" />
                                                                            ) : (
                                                                                <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 font-black text-xl">
                                                                                    {rsvp.user.name?.[0]}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="font-black text-slate-900 dark:text-white text-base tracking-tight truncate group-hover:text-emerald-600 transition-colors">
                                                                                {rsvp.user.name}
                                                                            </p>
                                                                            <p className="text-[11px] font-bold text-slate-400 truncate mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                                                                                <Languages size={10} className="text-blue-500" />
                                                                                {rsvp.user.nameRu || "-"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/5 py-1 px-3 rounded-lg w-fit">
                                                                            <GraduationCap size={16} className="text-blue-500 shrink-0" />
                                                                            <span className="truncate max-w-[150px]">{rsvp.user.university || t("na")}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 px-3">
                                                                            <MapPin size={14} className="text-rose-500 shrink-0" />
                                                                            <span className="truncate max-w-[150px]">{rsvp.user.city || "-"}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 hidden xl:table-cell">
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                                            <Mail size={14} className="text-emerald-500 shrink-0" />
                                                                            <span className="truncate max-w-[180px]">{rsvp.user.email}</span>
                                                                        </div>
                                                                        {rsvp.user.phone && (
                                                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                                                <Phone size={14} className="text-blue-500 shrink-0" />
                                                                                <span>{rsvp.user.phone}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 hidden md:table-cell">
                                                                    <div className="text-xs font-black text-slate-800 dark:text-slate-200">
                                                                        {new Date(rsvp.createdAt).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                                                                    </div>
                                                                    <div className="mt-1 text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                                        <Clock size={10} />
                                                                        {new Date(rsvp.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Link
                                                                            href={`/admin/members/${rsvp.user.id}/edit`}
                                                                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-xl transition-all hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:text-white"
                                                                            title={t("viewProfile")}
                                                                        >
                                                                            <User size={20} />
                                                                        </Link>
                                                                        <button
                                                                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                                                                            onClick={() => {
                                                                                if (confirm(t("cancelConfirm"))) {
                                                                                    // Deletion logic
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Trash2 size={20} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </AdminCard>
                            </div>

                            <div className="space-y-10">
                                <AdminCard
                                    title={t("attendanceKPIs")}
                                    className="bg-gradient-to-br from-slate-900 to-slate-800 border-none text-white overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 bg-emerald-500/10 blur-[50px] rounded-full" />
                                    <div className="relative space-y-8 py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("current")}</p>
                                                <p className="text-4xl font-black text-emerald-400">{event.rsvps.length}</p>
                                            </div>
                                            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/5 border border-white/10 shadow-2xl">
                                                <Users size={32} className="text-emerald-500" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("reservationRate")}</span>
                                                <span className="text-lg font-black text-white">{event.capacity > 0 ? `${Math.round((event.rsvps.length / event.capacity) * 100)}%` : '100%'}</span>
                                            </div>
                                            <div className="h-4 overflow-hidden rounded-full bg-white/5 p-1 border border-white/10">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${event.capacity > 0 ? Math.min(100, (event.rsvps.length / event.capacity) * 100) : 100}%` }}
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 bg-white/5 px-4 py-2 rounded-xl">
                                                <AlertCircle size={14} className="text-amber-500" />
                                                {event.capacity === 0 ? t("unlimitedCapacity") : `${t("remaining")}: ${Math.max(0, event.capacity - event.rsvps.length)}`}
                                            </div>
                                        </div>
                                    </div>
                                </AdminCard>

                                <AdminCard
                                    title={t("extraControls")}
                                    className="border-slate-100 dark:border-white/5 shadow-sm rounded-[2.5rem]"
                                >
                                    <div className="space-y-4">
                                        <button
                                            onClick={handlePrint}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Printer size={20} className="text-blue-500" />
                                                <span className="text-sm font-black">{t("printSpecialSheet")}</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                        </button>
                                    </div>
                                </AdminCard>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
