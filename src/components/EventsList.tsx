"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, Loader2, CheckCircle, ArrowLeft, Search, Clock, History, LayoutGrid, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  titleRu?: string | null;
  descriptionRu?: string | null;
  locationRu?: string | null;
  date: string;
  image: string | null;
  capacity: number | null;
  _count?: { rsvps: number };
}

export default function EventsList() {
  const locale = useLocale();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'ongoing'>('upcoming');

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);

      const title = locale === 'ru' && event.titleRu ? event.titleRu : event.title;
      const desc = locale === 'ru' && event.descriptionRu ? event.descriptionRu : event.description;
      const loc = locale === 'ru' && event.locationRu ? event.locationRu : event.location;

      const isSearchMatch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.toLowerCase().includes(searchQuery.toLowerCase());

      if (!isSearchMatch) return false;

      const isToday = eventDate.toDateString() === now.toDateString();

      if (activeTab === 'upcoming') return eventDate > now && !isToday;
      if (activeTab === 'past') return eventDate < now && !isToday;
      if (activeTab === 'ongoing') return isToday;

      return true;
    });
  }, [events, searchQuery, activeTab, locale]);

  useEffect(() => {
    fetch("/api/events")
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
          setError(locale === 'ar' ? "استجابة غير متوقعة من الخادم" : "Неожиданный ответ сервера");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(locale === 'ar' ? (err.message || "فشل الاتصال بالخادم") : (err.message || "Ошибка соединения"));
        setLoading(false);
        setEvents([]);
      });
  }, [locale]);

  const handleRSVP = async (eventId: string) => {
    setRsvpStatus(prev => ({ ...prev, [eventId]: 'loading' }));
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setRsvpStatus(prev => ({ ...prev, [eventId]: 'success' }));
      } else if (res.status === 401) {
        alert(locale === 'ar' ? "يجب تسجيل الدخول لتأكيد حضورك. سيتم تحويلك لصفحة تسجيل الدخول." : "Пожалуйста, войдите, чтобы подтвердить участие. Перенаправление на страницу входа.");
        router.push("/login");
        setRsvpStatus(prev => ({ ...prev, [eventId]: 'idle' }));
      } else {
        const errorMsg = data.error || (locale === 'ar' ? `خطأ ${res.status}: فشل تأكيد الحضور` : `Ошибка ${res.status}: Не удалось подтвердить участие`);
        alert(errorMsg);
        setRsvpStatus(prev => ({ ...prev, [eventId]: 'error' }));
      }
    } catch (err) {
      alert(locale === 'ar' ? "حدث خطأ في الاتصال بالخادم" : "Ошибка подключения к серверу");
      setRsvpStatus(prev => ({ ...prev, [eventId]: 'error' }));
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="bg-rose-50 dark:bg-rose-500/10 p-10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 max-w-2xl mx-auto">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-full w-fit mx-auto mb-6 shadow-sm">
          <Calendar size={48} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{locale === 'ar' ? 'عذراً، حدث خطأ' : 'Извините, произошла ошибка'}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          {locale === 'ar' ? 'إعادة تحميل الصفحة' : 'Перезагрузить страницу'}
        </button>
      </div>
    </div>
  );

  if (!events || events.length === 0) return (
    <div className="container mx-auto px-4 py-20 text-center text-slate-500 font-bold">
      {locale === 'ar' ? 'لا توجد فعاليات قادمة حالياً.' : 'На данный момент нет предстоящих мероприятий.'}
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Search and Tabs */}
      <div className="mb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md group">
            <Search className={`absolute ${locale === 'ar' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors`} size={20} />
            <input
              type="text"
              placeholder={locale === 'ar' ? 'ابحث عن فعالية...' : 'Поиск мероприятий...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-14 ${locale === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'} rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-bold text-slate-900 dark:text-white shadow-sm`}
            />
          </div>

          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.25rem] border border-slate-200 dark:border-slate-800 w-fit">
            {[
              { id: 'upcoming', label: locale === 'ar' ? 'القادمة' : 'Предстоящие', icon: Calendar },
              { id: 'ongoing', label: locale === 'ar' ? 'اليوم' : 'Сегодня', icon: Clock },
              { id: 'past', label: locale === 'ar' ? 'السابقة' : 'Прошедшие', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all
                  ${activeTab === tab.id
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full w-fit mx-auto mb-6 text-slate-300">
            <LayoutGrid size={64} />
          </div>
          <p className="text-xl font-bold text-slate-400">
            {locale === 'ar' ? 'لم يتم العثور على فعاليات تطابق بحثك.' : 'Мероприятия по вашему запросу не найдены.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={locale === 'ru' && event.titleRu ? event.titleRu : event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Calendar size={48} className="text-slate-300" />
                    </div>
                  )}
                  <div className={`absolute top-4 ${locale === 'ar' ? 'left-4' : 'right-4'}`}>
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                      <div className="text-center">
                        <span className="block text-xl font-black text-yellow-600">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase">
                          {new Date(event.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'ru-RU', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors">
                    {locale === 'ru' && event.titleRu ? event.titleRu : event.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                    {locale === 'ru' && event.descriptionRu ? event.descriptionRu : event.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                        <MapPin size={14} className="text-rose-500" />
                        {locale === 'ru' && event.locationRu ? event.locationRu : event.location}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                        <Globe size={14} className="text-blue-500" />
                        {new Date(event.date).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {event.capacity && event.capacity > 0 && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${(event.capacity - (event._count?.rsvps || 0)) <= 5
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                          }`}>
                          <Users size={14} />
                          <span>{locale === 'ar' ? 'المقاعد المتبقية' : 'Оставшееся количество мест'}: {Math.max(0, event.capacity - (event._count?.rsvps || 0))}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      {activeTab === 'past' || new Date(event.date) < new Date() ? (
                        <div className="flex-1 text-center py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 font-bold text-sm">
                          {locale === 'ar' ? 'انتهت الفعالية' : 'Мероприятие завершено'}
                        </div>
                      ) : (
                        event.capacity && event.capacity > 0 && (event._count?.rsvps || 0) >= event.capacity ? (
                          <div className="flex-1 text-center py-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-500 font-bold text-sm border border-rose-100 dark:border-rose-900/30">
                            {locale === 'ar' ? 'اكتملت المقاعد' : 'Места закончились'}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRSVP(event.id)}
                            disabled={rsvpStatus[event.id] === 'loading' || rsvpStatus[event.id] === 'success'}
                            className={`flex-1 h-14 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-sm
                            ${rsvpStatus[event.id] === 'success'
                                ? 'bg-emerald-500 text-white cursor-default'
                                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black shadow-lg shadow-yellow-500/20 active:scale-[0.98]'
                              }
                            disabled:opacity-70`}
                          >
                            {rsvpStatus[event.id] === 'loading' && <Loader2 className="animate-spin" size={18} />}
                            {rsvpStatus[event.id] === 'success' ? (
                              <>
                                <CheckCircle size={18} />
                                {locale === 'ar' ? 'تم تأكيد الحضور' : 'Участие подтверждено'}
                              </>
                            ) : (
                              <>
                                {locale === 'ar' ? 'تأكيد حضورك' : 'Подтвердить участие'}
                                <ArrowLeft size={16} className="rtl:rotate-180" />
                              </>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}