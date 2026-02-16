"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Calendar, MapPin, Users, Edit, Trash2, Plus, Loader2,
  Image as ImageIcon, Info, Clock, ChevronRight, Download,
  Search, Filter, Sparkles, LayoutGrid, List as ListIcon,
  FileSpreadsheet, Printer
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  title: string;
  titleRu?: string;
  date: string;
  location: string;
  locationRu?: string;
  image: string | null;
  capacity: number | null;
  _count: {
    rsvps: number;
  };
}

export default function AdminEventsPage() {
  const t = useTranslations("Admin.events");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    fetch("/api/admin/events")
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
          setError("Error fetching events");
        }
      })
      .catch((err) => {
        setError(err.message || "Error fetching events");
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  const deleteEvent = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
      } else {
        alert(t("deleteFailed"));
      }
    } catch (err) {
      alert(t("deleteFailed"));
    }
  };

  // --- Professional Excel Export (Improved Encoding & Formatting) ---
  const exportAttendees = async (eventId: string, eventTitle: string) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`);
      if (!res.ok) throw new Error("Failed");
      const eventData = await res.json();

      if (!eventData.rsvps || eventData.rsvps.length === 0) {
        alert(isRTL ? "لا يوجد مسجلين" : "No attendees");
        return;
      }

      const reportTitle = isRTL ? "كشف المسجلين الرسمي" : "Official Attendance Registry";
      const tableHeaders = isRTL
        ? ["م", "الاسم الكامل", "الاسم بالروسية", "البريد الإلكتروني", "رقم الهاتف", "الجامعة", "تاريخ التسجيل"]
        : ["No", "Full Name", "Russian Name", "Email", "Phone", "University", "Reg Date"];

      let rows = "";
      eventData.rsvps.forEach((rsvp: any, index: number) => {
        const u = rsvp.user;
        rows += `
              <tr>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${u.name || ""}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${u.nameRu || ""}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${u.email}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${u.phone || ""}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${u.university || ""}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${new Date(rsvp.createdAt).toLocaleDateString(locale)}</td>
              </tr>
          `;
      });

      const htmlContent = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
              <meta charset="utf-8">
              <style>
                  table { border-collapse: collapse; width: 100%; direction: ${isRTL ? 'rtl' : 'ltr'}; }
                  th { background-color: #10b981; color: white; border: 1px solid #ddd; padding: 12px; font-weight: bold; }
              </style>
          </head>
          <body>
              <div style="text-align: center; margin-bottom: 20px;">
                  <h1>${reportTitle}</h1>
                  <h3>${eventTitle}</h3>
              </div>
              <table>
                  <thead>
                      <tr>${tableHeaders.map(h => `<th>${h}</th>`).join("")}</tr>
                  </thead>
                  <tbody>${rows}</tbody>
              </table>
          </body>
          </html>
      `;

      const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Report_${eventTitle.replace(/\s+/g, '_')}.xls`;
      link.click();
    } catch (err) {
      alert("Export failed");
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.titleRu && e.titleRu.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const pastEvents = events.filter(e => new Date(e.date) < now);

  const stats = [
    { label: t("totalEvents"), value: events.length, icon: Calendar, color: "from-blue-500 to-indigo-600" },
    { label: t("upcoming"), value: upcomingEvents.length, icon: Sparkles, color: "from-amber-400 to-orange-500" },
    { label: t("rsvps"), value: events.reduce((acc, e) => acc + (e._count?.rsvps || 0), 0), icon: Users, color: "from-emerald-400 to-teal-600" },
    { label: t("past"), value: pastEvents.length, icon: Clock, color: "from-slate-400 to-slate-600" },
  ];

  return (
    <div className="min-h-screen pb-20" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Section */}
      <div className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-black md:text-5xl tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-xl text-lg font-bold text-slate-400">
              {t("description")}
            </p>
          </div>

          <Link
            href="/admin/events/new"
            className="group flex items-center gap-3 rounded-[1.5rem] bg-emerald-500 px-8 py-5 font-black transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95 shadow-xl"
          >
            <Plus size={24} />
            <span className="text-lg tracking-tight">{t("addNew")}</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 border border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</div>
                  <div className="text-3xl font-black">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row lg:px-2">
        <div className="relative w-full max-w-lg group">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
          <input
            type="text"
            placeholder={isRTL ? "البحث في الفعاليات..." : "Search Events..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-16 w-full rounded-[1.5rem] border border-slate-200 bg-white pr-14 pl-6 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all font-black text-sm shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 rounded-[1.5rem] bg-slate-100 p-2 dark:bg-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-12 px-6 items-center gap-3 rounded-xl transition-all font-black text-xs ${viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-xl dark:bg-slate-700' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <LayoutGrid size={18} />
            {isRTL ? "مربعات" : "Grid"}
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex h-12 px-6 items-center gap-3 rounded-xl transition-all font-black text-xs ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-xl dark:bg-slate-700' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <ListIcon size={18} />
            {isRTL ? "قائمة" : "List"}
          </button>
        </div>
      </div>

      {/* Events Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="animate-spin text-emerald-500 mb-6" size={64} />
          <p className="font-black text-slate-500 tracking-widest uppercase text-xs">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[4rem] border-4 border-dashed border-slate-200 bg-slate-50/50 py-40 text-center dark:border-slate-800 dark:bg-slate-900/50 mx-2">
          <div className="mb-8 rounded-[2rem] bg-white p-10 dark:bg-slate-800 shadow-2xl">
            <Calendar size={80} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t("empty")}</h3>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 px-2" : "space-y-6 lg:px-2"}>
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < now;

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className={`group relative flex flex-col overflow-hidden rounded-[3rem] border bg-white transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] dark:bg-slate-900 ${isPast ? 'border-slate-100 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'}`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-6 right-6 z-10 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border ${isPast ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/20 shadow-lg shadow-emerald-500/10'}`}>
                    {isPast ? t("past") : isRTL ? "قادمة" : "Upcoming"}
                  </div>

                  {/* Image Header */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {event.image ? (
                      <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <ImageIcon size={64} className="text-slate-300 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
                  </div>

                  {/* Content Body */}
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-3 text-xs font-black text-emerald-600 dark:text-emerald-400 mb-3">
                      <Calendar size={14} />
                      {eventDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 leading-tight dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-400 line-clamp-1">
                        <MapPin size={16} className="text-rose-500 shrink-0" />
                        <span className="text-[11px] font-black truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <Users size={16} className="text-blue-500 shrink-0" />
                        <span className="text-[11px] font-black">{event._count.rsvps}</span>
                      </div>
                    </div>

                    {/* Pro Action Footer */}
                    <div className="mt-auto pt-8 flex items-center gap-4">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="flex h-14 flex-1 items-center justify-center gap-3 rounded-[1.2rem] bg-slate-900 font-black text-white transition-all hover:bg-emerald-600 hover:scale-105 shadow-xl shadow-slate-900/10"
                      >
                        <Edit size={20} />
                        <span className="text-xs uppercase tracking-widest">{isRTL ? "إدارة" : "Manage"}</span>
                      </Link>

                      <button
                        onClick={() => exportAttendees(event.id, event.title)}
                        className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-white text-emerald-600 border-2 border-slate-100 transition-all hover:bg-emerald-50 hover:border-emerald-100 dark:bg-slate-800 dark:border-slate-800 dark:hover:bg-emerald-500/10"
                        title={isRTL ? "تصدير الأكسل" : "Excel Export"}
                      >
                        <FileSpreadsheet size={22} />
                      </button>

                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white dark:bg-rose-500/10"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
