import { prisma } from "@/lib/db";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, GraduationCap, MapPin, Mail, Phone, Send, Calendar, Clock, Users, BookOpen, Camera, Award, Star, Sparkles } from "lucide-react";

// قوائم الجامعات والمدن
const UNIVERSITIES: Record<string, { name: string; nameRu: string }> = {
    msu: { name: "جامعة موسكو الحكومية", nameRu: "МГУ им. М.В. Ломоносова" },
    rudn: { name: "جامعة الصداقة بين الشعوب", nameRu: "РУДН" },
    hse: { name: "المدرسة العليا للاقتصاد", nameRu: "НИУ ВШЭ" },
    misis: { name: "جامعة ميسيس", nameRu: "НИТУ МИСиС" },
    bauman: { name: "جامعة باومان التقنية", nameRu: "МГТУ им. Н.Э. Баумана" },
    mgimo: { name: "معهد موسكو للعلاقات الدولية", nameRu: "МГИМО" },
    mephi: { name: "جامعة ميفي النووية", nameRu: "НИЯУ МИФИ" },
    rggu: { name: "الجامعة الروسية للعلوم الإنسانية", nameRu: "РГГУ" },
    rea: { name: "أكاديمية بليخانوف الاقتصادية", nameRu: "РЭУ им. Г.В. Плеханова" },
    mglu: { name: "جامعة موسكو اللغوية", nameRu: "МГЛУ" },
    other: { name: "جامعة أخرى", nameRu: "Другой" },
};

const CITIES: Record<string, { name: string; nameRu: string }> = {
    moscow: { name: "موسكو", nameRu: "Москва" },
    spb: { name: "سانت بطرسبرغ", nameRu: "Санкт-Петербург" },
    kazan: { name: "قازان", nameRu: "Казань" },
    novosibirsk: { name: "نوفوسيبيرسك", nameRu: "Новосибирск" },
    yekaterinburg: { name: "يكاترينبرغ", nameRu: "Екатеринбург" },
    nizhny: { name: "نيجني نوفغورود", nameRu: "Нижний Новгород" },
    rostov: { name: "روستوف على الدون", nameRu: "Ростов-на-Дону" },
    other: { name: "مدينة أخرى", nameRu: "Другой" },
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MemberProfilePage({ params }: PageProps) {
    const { id } = await params;
    const locale = await getLocale();
    const t = await getTranslations("Members");
    const isRTL = locale === "ar";

    const member = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            nameRu: true,
            email: true,
            image: true,
            university: true,
            city: true,
            bio: true,
            phone: true,
            telegram: true,
            lastSeenAt: true,
            createdAt: true,
            role: true,
            _count: {
                select: {
                    rsvps: true,
                    enrollments: true,
                    photos: true,
                }
            }
        },
    });

    if (!member || member.role === "ADMIN") {
        notFound();
    }

    // التحقق من حالة الاتصال الفعلية
    const isActuallyOnline =
        (member as any).isOnline &&
        member.lastSeenAt &&
        Date.now() - new Date(member.lastSeenAt).getTime() < 2 * 60 * 1000;

    const getUniversityName = (id: string | null) => {
        if (!id || !UNIVERSITIES[id]) return null;
        return isRTL ? UNIVERSITIES[id].name : UNIVERSITIES[id].nameRu;
    };

    const getCityName = (id: string | null) => {
        if (!id || !CITIES[id]) return null;
        return isRTL ? CITIES[id].name : CITIES[id].nameRu;
    };

    const getLastSeenText = (lastSeenAt: Date | null) => {
        if (!lastSeenAt) return isRTL ? "غير معروف" : "Неизвестно";

        const diff = Date.now() - new Date(lastSeenAt).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return isRTL ? "الآن" : "Сейчас";
        if (minutes < 60) return isRTL ? `منذ ${minutes} دقيقة` : `${minutes} мин. назад`;
        if (hours < 24) return isRTL ? `منذ ${hours} ساعة` : `${hours} ч. назад`;
        return isRTL ? `منذ ${days} يوم` : `${days} дн. назад`;
    };

    const joinDate = new Date(member.createdAt).toLocaleDateString(
        isRTL ? "ar-EG" : "ru-RU",
        { year: "numeric", month: "long", day: "numeric" }
    );

    // حساب عدد الأيام منذ الانضمام
    const daysSinceJoin = Math.floor((Date.now() - new Date(member.createdAt).getTime()) / 86400000);

    // الاسم حسب اللغة
    const displayName = isRTL ? (member.name || member.nameRu) : (member.nameRu || member.name);
    const secondaryName = isRTL ? member.nameRu : member.name;

    // إحصائيات النشاط
    const activityStats = [
        {
            label: isRTL ? "الفعاليات" : "События",
            value: member._count.rsvps,
            icon: Calendar,
            color: "from-emerald-500 to-green-500",
            bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
            textColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
            label: isRTL ? "الدورات" : "Курсы",
            value: member._count.enrollments,
            icon: BookOpen,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-100 dark:bg-blue-500/20",
            textColor: "text-blue-600 dark:text-blue-400"
        },
        {
            label: isRTL ? "الصور" : "Фото",
            value: member._count.photos,
            icon: Camera,
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-amber-100 dark:bg-amber-500/20",
            textColor: "text-amber-600 dark:text-amber-400"
        },
        {
            label: isRTL ? "الأيام" : "Дней",
            value: daysSinceJoin,
            icon: Star,
            color: "from-violet-500 to-purple-500",
            bgColor: "bg-violet-100 dark:bg-violet-500/20",
            textColor: "text-violet-600 dark:text-violet-400"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header Background */}
            <div className="h-80 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl translate-y-1/3" />
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl" />
                </div>

                {/* Sparkles */}
                <Sparkles className="absolute top-20 right-20 text-white/20" size={40} />
                <Sparkles className="absolute bottom-32 left-32 text-white/10" size={24} />

                {/* Back Button */}
                <div className="container mx-auto px-4 pt-6 relative z-10">
                    <Link
                        href={`/${locale}/members`}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20"
                    >
                        <ArrowLeft size={18} className="rtl:rotate-180" />
                        <span>{isRTL ? "العودة للأعضاء" : "Назад к участникам"}</span>
                    </Link>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 -mt-40 relative z-10 pb-20">
                <div className="max-w-4xl mx-auto">
                    {/* Main Profile Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 overflow-hidden">
                        {/* Avatar Section */}
                        <div className="pt-12 pb-8 px-8 text-center relative">
                            {/* Avatar */}
                            <div className="relative mx-auto w-36 h-36 mb-6">
                                <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-1 shadow-2xl shadow-violet-500/30">
                                    <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-900 overflow-hidden">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={displayName || ""}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 text-violet-600 dark:text-violet-400">
                                                {displayName?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Online Indicator */}
                                <div
                                    className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg ${isActuallyOnline ? "bg-gradient-to-br from-emerald-400 to-green-500" : "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700"
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${isActuallyOnline ? "bg-white animate-pulse" : "bg-slate-200 dark:bg-slate-500"}`} />
                                </div>
                            </div>

                            {/* Name */}
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                                {displayName || (isRTL ? "بدون اسم" : "Без имени")}
                            </h1>

                            {/* Secondary Name */}
                            {secondaryName && secondaryName !== displayName && (
                                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium" dir={isRTL ? "ltr" : "rtl"}>
                                    {secondaryName}
                                </p>
                            )}

                            {/* Online Status Badge */}
                            <div className={`inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${isActuallyOnline
                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${isActuallyOnline ? "bg-white animate-pulse" : "bg-slate-400"}`} />
                                {isActuallyOnline
                                    ? (isRTL ? "متصل الآن" : "В сети сейчас")
                                    : (
                                        <>
                                            <Clock size={14} />
                                            {getLastSeenText(member.lastSeenAt)}
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="px-8 pb-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {activityStats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:scale-105 transition-transform"
                                    >
                                        <div className={`w-12 h-12 mx-auto mb-3 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                            <stat.icon className={stat.textColor} size={24} />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="px-8 pb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users size={20} className="text-violet-500" />
                                {isRTL ? "معلومات العضو" : "Информация об участнике"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* University */}
                                {member.university && (
                                    <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <GraduationCap className="text-white" size={26} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide mb-1">
                                                {isRTL ? "الجامعة" : "Университет"}
                                            </p>
                                            <p className="font-bold text-slate-900 dark:text-white text-lg">
                                                {getUniversityName(member.university)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* City */}
                                {member.city && (
                                    <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-500/10 dark:to-pink-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20">
                                        <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                                            <MapPin className="text-white" size={26} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wide mb-1">
                                                {isRTL ? "المدينة" : "Город"}
                                            </p>
                                            <p className="font-bold text-slate-900 dark:text-white text-lg">
                                                {getCityName(member.city)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Join Date */}
                                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                        <Calendar className="text-white" size={26} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide mb-1">
                                            {isRTL ? "تاريخ الانضمام" : "Дата регистрации"}
                                        </p>
                                        <p className="font-bold text-slate-900 dark:text-white text-lg">{joinDate}</p>
                                    </div>
                                </div>

                                {/* Telegram */}
                                {member.telegram && (
                                    <a
                                        href={`https://t.me/${member.telegram.replace("@", "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-5 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-500/10 dark:to-blue-500/10 rounded-2xl border border-sky-100 dark:border-sky-500/20 hover:scale-[1.02] transition-transform group"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-xl group-hover:shadow-sky-500/40 transition-shadow">
                                            <Send className="text-white" size={26} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wide mb-1">Telegram</p>
                                            <p className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                                {member.telegram}
                                            </p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {member.bio && (
                            <div className="px-8 pb-8">
                                <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 rounded-2xl border border-violet-100 dark:border-violet-500/20">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Award className="text-violet-500" size={20} />
                                        {isRTL ? "نبذة تعريفية" : "О себе"}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
