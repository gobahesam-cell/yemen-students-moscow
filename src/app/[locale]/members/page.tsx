import { prisma } from "@/lib/db";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Users, GraduationCap, MapPin, Search, Filter } from "lucide-react";

// قوائم الجامعات والمدن
const UNIVERSITIES: Record<string, { name: string; nameRu: string }> = {
    msu: { name: "جامعة موسكو الحكومية", nameRu: "МГУ" },
    rudn: { name: "جامعة الصداقة بين الشعوب", nameRu: "РУДН" },
    hse: { name: "المدرسة العليا للاقتصاد", nameRu: "ВШЭ" },
    misis: { name: "جامعة ميسيس", nameRu: "МИСиС" },
    bauman: { name: "جامعة باومان التقنية", nameRu: "МГТУ Баумана" },
    mgimo: { name: "معهد موسكو للعلاقات الدولية", nameRu: "МГИМО" },
    mephi: { name: "جامعة ميفي النووية", nameRu: "МИФИ" },
    rggu: { name: "الجامعة الروسية للعلوم الإنسانية", nameRu: "РГГУ" },
    rea: { name: "أكاديمية بليخانوف الاقتصادية", nameRu: "РЭУ Плеханова" },
    mglu: { name: "جامعة موسكو اللغوية", nameRu: "МГЛУ" },
    other: { name: "جامعة أخرى", nameRu: "Другой" },
};

const CITIES: Record<string, { name: string; nameRu: string }> = {
    moscow: { name: "موسكو", nameRu: "Москва" },
    spb: { name: "سانت بطرسبرغ", nameRu: "СПб" },
    kazan: { name: "قازان", nameRu: "Казань" },
    novosibirsk: { name: "نوفوسيبيرسك", nameRu: "Новосибирск" },
    yekaterinburg: { name: "يكاترينبرغ", nameRu: "Екатеринбург" },
    nizhny: { name: "نيجني نوفغورود", nameRu: "Нижний Новгород" },
    rostov: { name: "روستوف على الدون", nameRu: "Ростов-на-Дону" },
    other: { name: "مدينة أخرى", nameRu: "Другой" },
};

interface SearchParams {
    university?: string;
    city?: string;
    q?: string;
}

export default async function MembersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const locale = await getLocale();
    const t = await getTranslations("Members");
    const params = await searchParams;
    const isRTL = locale === "ar";

    // بناء شروط البحث
    const where: any = {
        role: "MEMBER",
    };

    if (params.university) {
        where.university = params.university;
    }

    if (params.city) {
        where.city = params.city;
    }

    if (params.q) {
        where.OR = [
            { name: { contains: params.q, mode: "insensitive" } },
            { nameRu: { contains: params.q, mode: "insensitive" } },
        ];
    }

    // جلب الأعضاء
    const members = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            nameRu: true,
            image: true,
            university: true,
            city: true,
            isOnline: true,
            lastSeenAt: true,
            createdAt: true,
        },
        orderBy: [
            { isOnline: "desc" },
            { lastSeenAt: "desc" },
        ],
        take: 50,
    });

    // التحقق من حالة الاتصال الفعلية
    const membersWithStatus = members.map((member) => {
        const isActuallyOnline =
            member.isOnline &&
            member.lastSeenAt &&
            Date.now() - new Date(member.lastSeenAt).getTime() < 2 * 60 * 1000;

        return {
            ...member,
            isOnline: isActuallyOnline,
        };
    });

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

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[150px] -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full text-yellow-600 dark:text-yellow-400 text-sm font-bold mb-6">
                            <Users size={16} />
                            <span>{isRTL ? "أعضاء الجالية" : "Участники сообщества"}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                            {isRTL ? "تعرف على أعضاء جاليتنا" : "Познакомьтесь с участниками"}
                        </h1>

                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            {isRTL
                                ? "مجتمع من الطلاب اليمنيين الدارسين في مختلف الجامعات الروسية"
                                : "Сообщество йеменских студентов, обучающихся в различных российских университетах"
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <form className="flex flex-wrap gap-4 items-center justify-center">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                name="q"
                                placeholder={isRTL ? "ابحث بالاسم..." : "Поиск по имени..."}
                                defaultValue={params.q}
                                className="w-full h-12 pr-12 pl-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* University Filter */}
                        <select
                            name="university"
                            defaultValue={params.university}
                            className="h-12 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                        >
                            <option value="">{isRTL ? "كل الجامعات" : "Все университеты"}</option>
                            {Object.entries(UNIVERSITIES).map(([id, uni]) => (
                                <option key={id} value={id}>
                                    {isRTL ? uni.name : uni.nameRu}
                                </option>
                            ))}
                        </select>

                        {/* City Filter */}
                        <select
                            name="city"
                            defaultValue={params.city}
                            className="h-12 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                        >
                            <option value="">{isRTL ? "كل المدن" : "Все города"}</option>
                            {Object.entries(CITIES).map(([id, city]) => (
                                <option key={id} value={id}>
                                    {isRTL ? city.name : city.nameRu}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="h-12 px-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl font-bold transition-all flex items-center gap-2"
                        >
                            <Filter size={18} />
                            <span>{isRTL ? "تصفية" : "Фильтр"}</span>
                        </button>
                    </form>
                </div>
            </section>

            {/* Members Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {membersWithStatus.length === 0 ? (
                        <div className="text-center py-20">
                            <Users className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={64} />
                            <p className="text-slate-500 text-lg">
                                {isRTL ? "لا يوجد أعضاء مطابقين للبحث" : "Нет участников, соответствующих поиску"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {membersWithStatus.map((member) => (
                                <Link
                                    key={member.id}
                                    href={`/members/${member.id}`}
                                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300"
                                >
                                    {/* Avatar with Online Status */}
                                    <div className="relative mx-auto w-24 h-24 mb-4">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            {member.image ? (
                                                <Image
                                                    src={member.image}
                                                    alt={member.name || ""}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                                    {member.name?.charAt(0) || "?"}
                                                </div>
                                            )}
                                        </div>

                                        {/* Online Indicator */}
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 ${member.isOnline ? "bg-emerald-500" : "bg-slate-400"
                                                }`}
                                        />
                                    </div>

                                    {/* Name */}
                                    <h3 className="font-bold text-slate-900 dark:text-white text-center mb-1 group-hover:text-yellow-600 transition-colors">
                                        {isRTL ? member.name : (member.nameRu || member.name)}
                                    </h3>

                                    {/* Status */}
                                    <p className={`text-xs text-center mb-4 ${member.isOnline ? "text-emerald-600" : "text-slate-500"
                                        }`}>
                                        {member.isOnline
                                            ? (isRTL ? "متصل الآن" : "В сети")
                                            : getLastSeenText(member.lastSeenAt)
                                        }
                                    </p>

                                    {/* Info */}
                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                        {member.university && (
                                            <div className="flex items-center gap-2">
                                                <GraduationCap size={14} className="text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{getUniversityName(member.university)}</span>
                                            </div>
                                        )}
                                        {member.city && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                                                <span>{getCityName(member.city)}</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
