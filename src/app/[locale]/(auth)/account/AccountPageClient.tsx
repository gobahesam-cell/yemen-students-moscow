"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Mail, Shield, Calendar, Settings, ChevronLeft, Info, LogOut, MapPin, CheckCircle2, Loader2, Globe, Image as ImageIcon, BookOpen, GraduationCap, Play } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { CldUploadButton } from "next-cloudinary";
import { updateAvatarAction } from "@/app/actions/user";
import { getMyCoursesAction } from "@/app/actions/enrollment";

interface AccountPageProps {
    user: {
        name: string;
        nameRu?: string | null;
        email: string;
        role: string;
        image?: string | null;
        createdAt: string;
        university?: string | null;
        city?: string | null;
        bio?: string | null;
        telegram?: string | null;
    };
}

export default function AccountPageClient({ user }: AccountPageProps) {
    const t = useTranslations("Account");
    const locale = useLocale();
    const [myEvents, setMyEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [updatingAvatar, setUpdatingAvatar] = useState(false);
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const isRTL = locale === "ar";

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? "ar-EG" : "ru-RU", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "";

    useEffect(() => {
        // جلب الفعاليات التي سجل فيها العضو فعلياً
        fetch("/api/user/events")
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data)) {
                    setMyEvents(data);
                }
                setLoadingEvents(false);
            })
            .catch((err) => {
                console.error("Fetch events error:", err);
                setLoadingEvents(false);
            });

        // جلب الدورات المسجل فيها
        getMyCoursesAction()
            .then(result => {
                if (result && result.courses) {
                    setMyCourses(result.courses);
                }
                setLoadingCourses(false);
            })
            .catch((err) => {
                console.error("Fetch courses error:", err);
                setLoadingCourses(false);
            });
    }, []);

    const handleAvatarUpload = async (result: any) => {
        const imageUrl = result.info.secure_url;
        setUpdatingAvatar(true);
        const res = await updateAvatarAction(imageUrl);
        setUpdatingAvatar(false);
        if (res.success) {
            window.location.reload(); // Refresh to show new avatar
        } else {
            alert(res.error || "خطأ في تحديث الصورة");
        }
    };

    const getRoleName = (role: string) => {
        if (role === "ADMIN") return t("adminRole");
        if (role === "MEMBER") return t("memberRole");
        return role;
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-slate-950 pb-20 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
            {/* Background Decor (Hero Style) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[150px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2" />
            </div>

            {/* Profile Header Header */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="absolute -bottom-20 inset-x-0 flex justify-center px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white dark:bg-slate-900 border-8 border-white dark:border-slate-950 shadow-2xl flex items-center justify-center overflow-hidden relative group">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-amber-600">
                                    {user.name?.[0] || "U"}
                                </span>
                            )}

                            <CldUploadButton
                                uploadPreset="ysm_preset"
                                onSuccess={handleAvatarUpload}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <ImageIcon size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{t("changePhoto") || "تغيير"}</span>
                                </div>
                            </CldUploadButton>

                            {updatingAvatar && (
                                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-yellow-600" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-lg" title={t("statusLabel")}>
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-24 space-y-8 relative z-10">
                {/* Name, Role & Logout */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                    >
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isRTL ? user.name : (user.nameRu || user.name)}
                        </h1>
                        {/* الاسم الثانوي */}
                        {user.nameRu && isRTL && (
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium" dir="ltr">{user.nameRu}</p>
                        )}
                        {user.name && !isRTL && user.nameRu && (
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium" dir="rtl">{user.name}</p>
                        )}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-full text-sm font-bold border border-yellow-500/20">
                            <Shield size={16} />
                            {getRoleName(user.role)}
                        </div>
                    </motion.div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Mail, label: t("emailLabel"), value: user.email, color: "text-blue-500", bg: "bg-blue-500/5" },
                        { icon: Calendar, label: t("joinDateLabel"), value: joinDate, color: "text-indigo-500", bg: "bg-indigo-500/5" },
                        { icon: Shield, label: t("statusLabel"), value: t("verifiedStatus"), color: "text-emerald-500", bg: "bg-emerald-500/5" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 text-center"
                        >
                            <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                                <item.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-sm md:text-base font-black text-slate-900 dark:text-white truncate w-full">{item.value}</span>
                        </motion.div>
                    ))}
                </div>

                {/* MY COURSES SECTION */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
                >
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-yellow-500/5 to-amber-500/5">
                        <h2 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
                            <GraduationCap className="text-yellow-600" size={24} />
                            {locale === "ar" ? "دوراتي" : "Мои курсы"}
                        </h2>
                        <Link href={`/${locale}/courses`} className="text-xs font-bold text-yellow-600 hover:underline">
                            {locale === "ar" ? "تصفح الدورات" : "Все курсы"}
                        </Link>
                    </div>

                    <div className="p-8">
                        {loadingCourses ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-yellow-500" /></div>
                        ) : myCourses.length === 0 ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 max-w-sm mx-auto">
                                    <BookOpen className="text-slate-400 mx-auto mb-2" size={24} />
                                    <p className="text-sm text-slate-500 font-medium">
                                        {locale === "ar" ? "لم تسجل في أي دورة بعد" : "Вы еще не записались на курсы"}
                                    </p>
                                </div>
                                <Link href={`/${locale}/courses`} className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/20">
                                    {locale === "ar" ? "استكشف الدورات" : "Изучить курсы"}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myCourses.map((course, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/${locale}/courses/${course.slug}`}
                                        className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-yellow-500/30 transition-all overflow-hidden"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-32 w-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
                                            {course.thumbnail ? (
                                                <Image src={course.thumbnail} alt={locale === 'ru' && course.titleRu ? course.titleRu : course.title} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <GraduationCap size={40} className="text-yellow-500/50" />
                                                </div>
                                            )}
                                            {/* Progress Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700">
                                                <div
                                                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            {/* Continue Button */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                                    <Play size={20} className="text-yellow-600 mr-[-2px]" fill="currentColor" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2 truncate">
                                                {locale === 'ru' && course.titleRu ? course.titleRu : course.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="flex items-center gap-1 text-slate-500 font-bold">
                                                    <BookOpen size={12} className="text-yellow-600" />
                                                    {course.totalLessons} {locale === "ar" ? "درس" : "уроков"}
                                                </span>
                                                <span className={`font-black ${course.progress === 100 ? "text-emerald-500" : "text-yellow-600"}`}>
                                                    {course.progress === 100 ? (
                                                        <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {locale === "ar" ? "مكتمل" : "Завершен"}</span>
                                                    ) : (
                                                        `${course.progress}%`
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* MY EVENTS SECTION */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
                >
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                        <h2 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
                            <Calendar className="text-yellow-600" size={24} />
                            {t("myEventsTitle")}
                        </h2>
                        <Link href="/events" className="text-xs font-bold text-yellow-600 hover:underline">{t("viewAll")}</Link>
                    </div>

                    <div className="p-8">
                        {loadingEvents ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-yellow-500" /></div>
                        ) : myEvents.length === 0 ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 max-w-sm mx-auto">
                                    <Info className="text-slate-400 mx-auto mb-2" size={24} />
                                    <p className="text-sm text-slate-500 font-medium">{t("noEvents")}</p>
                                </div>
                                <Link href="/events" className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/20">{t("discoverEvents")}</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myEvents.map((ev, idx) => (
                                    <div key={idx} className="group relative bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-yellow-500/30 transition-all">
                                        <div className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                                                {ev.image ? <Image src={ev.image} alt={locale === 'ru' && ev.titleRu ? ev.titleRu : ev.title} fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-slate-400"><Calendar size={20} /></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1 truncate">{locale === 'ru' && ev.titleRu ? ev.titleRu : ev.title}</h4>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                                                    <span className="flex items-center gap-1"><Calendar size={12} className="text-yellow-600" /> {new Date(ev.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'ru-RU')}</span>
                                                    <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={12} /> {t("confirmedRSVP")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* SETTINGS & LOGOUT */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 md:p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 dark:text-white">{t("settingsTitle")}</h3>
                            <p className="text-xs text-slate-500 font-medium">{t("settingsDesc")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${locale}/account/settings`}
                            className="flex items-center gap-2 px-6 py-3 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-black rounded-2xl font-black transition-all text-sm shadow-sm border border-yellow-500/10"
                        >
                            <UserIcon size={20} />
                            {locale === "ar" ? "تعديل الملف" : "Редактировать"}
                        </Link>
                        <form action={logoutAction}>
                            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white rounded-2xl font-black transition-all text-sm shadow-sm border border-rose-500/10">
                                <LogOut size={20} />
                                {t("logout")}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Link href="/" className="text-slate-500 dark:text-slate-400 font-bold hover:text-yellow-600 transition-all flex items-center gap-2 text-sm bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <ChevronLeft size={18} className={isRTL ? "rotate-180" : "rotate-0"} />
                        {t("backHome")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
