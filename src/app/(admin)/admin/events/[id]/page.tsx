"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { EventForm } from "@/components/admin/EventForm";
import { ArrowRight, Loader2, Users, Mail, Shield, Trash2, Calendar, Clock, UserCheck, Search, Filter, MoreVertical, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();
    const t = useTranslations("Admin.eventPages");
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch(`/api/admin/events/${id}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>;
    if (!event) return <div className="text-center py-20 text-rose-500 font-bold">{t("notFound")}</div>;

    const filteredRSVPs = event.rsvps.filter((rsvp: any) =>
        rsvp.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/events" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <ArrowRight size={24} className="rtl:rotate-180" />
                </Link>
                <AdminPageHeader
                    title={t("editEventTitle")}
                    description={t("editEventDesc", { name: event.title })}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Edit Form */}
                <div className="xl:col-span-2">
                    <EventForm mode="edit" initialData={event} />
                </div>

                {/* RSVP List */}
                <div className="space-y-6">
                    <AdminCard
                        title={t("attendeesTitle")}
                        description={t("attendeesDesc")}
                    >
                        <div className="space-y-6">
                            {/* Table Controls */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                                <div className="relative w-full md:w-96 group">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t("searchPlaceholder")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-sm font-bold"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-500">
                                        {t("totalRegistered", { count: event.rsvps.length })}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                <table className="w-full text-right">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t("user")}</th>
                                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">{t("registrationTime")}</th>
                                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t("status")}</th>
                                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-left">{t("actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredRSVPs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-bold italic">
                                                    {t("noResults")}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRSVPs.map((rsvp: any) => (
                                                <tr key={rsvp.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-lg shadow-sm border border-white dark:border-slate-700 group-hover:scale-110 transition-transform">
                                                                {rsvp.user.name?.[0] || "U"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-black text-slate-900 dark:text-white truncate text-base">{rsvp.user.name}</p>
                                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                                    <Mail size={12} className="text-yellow-500" />
                                                                    <span className="truncate">{rsvp.user.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 hidden md:table-cell">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
                                                                <Clock size={12} className="text-blue-500" />
                                                                {new Date(rsvp.createdAt).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 rounded-md w-fit">
                                                                {new Date(rsvp.createdAt).toLocaleDateString("ar-EG")}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
                                                            <UserCheck size={12} />
                                                            {t("confirmed")}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/admin/users/${rsvp.user.id}`}
                                                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-yellow-500 hover:text-black transition-all"
                                                                title={t("viewProfile")}
                                                            >
                                                                <ExternalLink size={18} />
                                                            </Link>
                                                            <button
                                                                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                                title={t("cancelAttendance")}
                                                                onClick={() => {
                                                                    if (confirm(t("cancelConfirm"))) {
                                                                        // API call for deletion will be added later
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 size={18} />
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

                    <AdminCard title={t("quickStats")} className="bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold">{t("currentAttendance")}</span>
                                <span className="font-black text-yellow-600 text-lg">{event.rsvps.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold">{t("remainingCapacity")}</span>
                                <span className="font-black text-blue-600">
                                    {event.capacity === 0 ? t("unlimited") : Math.max(0, event.capacity - event.rsvps.length)}
                                </span>
                            </div>
                            {event.capacity > 0 && (
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500"
                                        style={{ width: `${Math.min(100, (event.rsvps.length / event.capacity) * 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
