"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, MapPin, Users, Edit, Trash2, Plus, Loader2, Image as ImageIcon, Info, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  title: string;
  titleRu?: string;
  date: string;
  location: string;
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

  useEffect(() => {
    fetch("/api/admin/events")
      .then(res => {
        if (!res.ok) {
          return res.json().then(d => { throw new Error(d.error || 'Failed to fetch') });
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
          setError("Error fetching events");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Admin fetch error:", err);
        setError(err.message || "Error fetching events");
        setLoading(false);
        setEvents([]);
      });
  }, []);

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

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const pastEvents = events.filter(e => new Date(e.date) < now);

  const statsCards = [
    { label: t("totalEvents"), value: events.length, color: "from-blue-500 to-cyan-500" },
    { label: t("upcoming"), value: upcomingEvents.length, color: "from-emerald-500 to-green-500" },
    { label: t("past"), value: pastEvents.length, color: "from-slate-500 to-slate-600" },
    { label: t("rsvps"), value: events.reduce((acc, e) => acc + (e._count?.rsvps || 0), 0), color: "from-violet-500 to-purple-500" },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl text-white shadow-lg shadow-emerald-500/25">
              <Calendar size={24} />
            </div>
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {t("description")}
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>{t("addNew")}</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <Calendar size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl p-8 text-center">
          <div className="p-4 bg-rose-100 dark:bg-rose-500/20 rounded-full w-fit mx-auto mb-4">
            <Info size={32} className="text-rose-500" />
          </div>
          <p className="text-rose-600 dark:text-rose-400 font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-800 underline"
          >
            {t("retry")}
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4">
            <Calendar size={40} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-bold">{t("empty")}</p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-emerald-600 hover:text-emerald-500"
          >
            <Plus size={16} />
            {t("addNew")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {events.map((event, idx) => {
            const eventDate = new Date(event.date);
            const isPast = eventDate < now;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white dark:bg-slate-900 rounded-2xl border ${isPast ? 'border-slate-200 dark:border-slate-800 opacity-70' : 'border-emerald-100 dark:border-emerald-500/20'} overflow-hidden hover:shadow-lg transition-all group`}
              >
                <div className="flex">
                  {/* Image */}
                  <div className="relative w-32 md:w-40 shrink-0">
                    {event.image ? (
                      <Image src={event.image} alt={event.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <ImageIcon size={24} className="text-slate-400" />
                      </div>
                    )}
                    {/* Date Badge */}
                    <div className="absolute top-2 left-2 bg-white dark:bg-slate-900 rounded-lg p-1.5 text-center shadow-lg">
                      <div className="text-xs font-bold text-emerald-600">{eventDate.toLocaleDateString(locale, { month: 'short' })}</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white leading-none">{eventDate.getDate()}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {isRTL ? event.title : (event.titleRu || event.title)}
                      </h3>
                      {isPast && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          {t("past")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-emerald-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={12} className="text-blue-500" />
                        <span>{event._count?.rsvps || 0} {t("rsvps")}</span>
                        {event.capacity && <span className="text-slate-400">/ {event.capacity}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={12} />
                        {t("edit")}
                      </Link>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} />
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
