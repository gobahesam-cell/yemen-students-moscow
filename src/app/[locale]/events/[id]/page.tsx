"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Loader2, CheckCircle, ArrowRight, ArrowLeft, Clock, Info, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface EventData {
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

export default function EventDetailsPage() {
  const { locale, id } = useParams() as { locale: "ar" | "ru"; id: string };
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch(`/api/admin/events/${id}`) // Using admin endpoint to get full details if needed, or create a public one
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleRSVP = async () => {
    setRsvpStatus('loading');
    try {
      const res = await fetch(`/api/events/${id}/rsvp`, { method: "POST" });
      if (res.ok) {
        setRsvpStatus('success');
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setRsvpStatus('error');
      }
    } catch (err) {
      setRsvpStatus('error');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-40">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  if (!event) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-black text-rose-500">
        {locale === 'ar' ? 'عذراً، الفعالية غير موجودة' : 'Sorry, event not found'}
      </h1>
      <Link href={`/${locale}/events`} className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
        <ArrowRight className="rtl:rotate-180" />
        {locale === 'ar' ? 'الرجوع للفعاليات' : 'Back to events'}
      </Link>
    </div>
  );

  const title = locale === 'ru' && event.titleRu ? event.titleRu : event.title;
  const description = locale === 'ru' && event.descriptionRu ? event.descriptionRu : event.description;
  const location = locale === 'ru' && event.locationRu ? event.locationRu : event.location;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10">
        <Link href={`/${locale}/events`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-yellow-500 hover:text-black transition-all group">
          {locale === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          {locale === 'ar' ? 'الرجوع للفعاليات' : 'Back to events'}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800"
          >
            {event.image ? (
              <img src={event.image} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Calendar size={80} className="text-slate-300" />
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <Calendar className="text-yellow-600" size={20} />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{locale === 'ar' ? 'التاريخ' : 'DATE'}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <Clock className="text-blue-600" size={20} />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{locale === 'ar' ? 'الوقت' : 'TIME'}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(event.date).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <MapPin className="text-rose-600" size={20} />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{locale === 'ar' ? 'الموقع' : 'LOCATION'}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{location}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8 sticky top-8">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{locale === 'ar' ? 'تأكيد الحضور' : 'Confirm Attendance'}</h3>
              <p className="text-sm text-slate-500 font-bold">{locale === 'ar' ? 'يرجى تسجيل الرغبة في الحضور لضمان مقعدك' : 'Please RSVP to secure your spot'}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500">{locale === 'ar' ? 'الحاضرون حالياً' : 'Current attendees'}:</span>
                <span className="text-slate-900 dark:text-white">{event._count?.rsvps || 0}</span>
              </div>
              {event.capacity && event.capacity > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">{locale === 'ar' ? 'السعة الكلية' : 'Total capacity'}:</span>
                    <span className="text-slate-900 dark:text-white">{event.capacity}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, ((event._count?.rsvps || 0) / event.capacity) * 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleRSVP}
              disabled={rsvpStatus === 'loading' || rsvpStatus === 'success'}
              className={`w-full h-16 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-lg
                   ${rsvpStatus === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:scale-[1.02] active:scale-[0.98] text-black shadow-xl shadow-yellow-500/20'
                }
                   disabled:opacity-70`}
            >
              {rsvpStatus === 'loading' && <Loader2 className="animate-spin" />}
              {rsvpStatus === 'success' ? (
                <>
                  <CheckCircle size={24} />
                  {locale === 'ar' ? 'تم التأكيد!' : 'Confirmed!'}
                </>
              ) : (
                <>
                  {locale === 'ar' ? 'احجز مقعدك الآن' : 'Book your spot'}
                  {locale === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                </>
              )}
            </button>

            <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3 italic">
              <Info className="text-blue-600 shrink-0" size={18} />
              <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                {locale === 'ar'
                  ? 'عند تأكيد حضورك، سيظهر اسمك في قائمة المسجلين لدى الإدارة. يرجى الحضور في الموعد المحدد.'
                  : 'By confirming, your name will be added to the registration list. Please arrive on time.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}