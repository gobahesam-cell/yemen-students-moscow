"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import {
    Users, Search, Eye, Edit, Calendar, GraduationCap, Camera,
    Wifi, WifiOff, Filter, ChevronDown, TrendingUp, UserCheck, UserPlus, Activity,
    Trash2, Loader2
} from "lucide-react";
import { motion } from "framer-motion";

const UNIVERSITIES = [
    { id: "msu", name: "جامعة موسكو", nameRu: "МГУ" },
    { id: "rudn", name: "جامعة الصداقة", nameRu: "РУДН" },
    { id: "hse", name: "المدرسة العليا للاقتصاد", nameRu: "ВШЭ" },
    { id: "misis", name: "ميسيس", nameRu: "МИСиС" },
    { id: "bauman", name: "باومان", nameRu: "МГТУ" },
    { id: "mgimo", name: "مجيمو", nameRu: "МГИМО" },
    { id: "other", name: "أخرى", nameRu: "Другой" },
];

const CITIES = [
    { id: "moscow", name: "موسكو", nameRu: "Москва" },
    { id: "spb", name: "سانت بطرسبرغ", nameRu: "СПб" },
    { id: "kazan", name: "قازان", nameRu: "Казань" },
    { id: "other", name: "أخرى", nameRu: "Другой" },
];

interface Member {
    id: string;
    name: string | null;
    nameRu: string | null;
    email: string;
    image: string | null;
    university: string | null;
    city: string | null;
    role: string;
    createdAt: string;
    lastSeenAt: string | null;
    isOnline: boolean;
    _count: {
        rsvps: number;
        enrollments: number;
        photos: number;
    };
}

export default function AdminMembersPage() {
    const t = useTranslations("Admin");
    const locale = useLocale();
    const isRTL = locale === "ar";

    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [universityFilter, setUniversityFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(memberId: string) {
        if (!confirm(t("members.confirmDelete"))) return;

        setDeleting(memberId);
        try {
            const res = await fetch(`/api/admin/members/${memberId}`, { method: "DELETE" });
            if (res.ok) {
                setMembers(members.filter(m => m.id !== memberId));
            } else {
                const data = await res.json();
                alert(data.error || "Error");
            }
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeleting(null);
        }
    }

    // Filter members
    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nameRu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesUniversity = !universityFilter || member.university === universityFilter;
        const matchesCity = !cityFilter || member.city === cityFilter;
        const matchesStatus = !statusFilter ||
            (statusFilter === "online" && member.isOnline) ||
            (statusFilter === "offline" && !member.isOnline);

        return matchesSearch && matchesUniversity && matchesCity && matchesStatus;
    });

    // Stats
    const totalMembers = members.length;
    const onlineMembers = members.filter(m => m.isOnline).length;
    const today = new Date().toDateString();
    const newToday = members.filter(m => new Date(m.createdAt).toDateString() === today).length;
    const totalActivity = members.reduce((acc, m) => acc + (m._count?.rsvps || 0) + (m._count?.enrollments || 0) + (m._count?.photos || 0), 0);

    const getUniversityName = (id: string | null) => {
        if (!id) return "-";
        const uni = UNIVERSITIES.find(u => u.id === id);
        return uni ? (isRTL ? uni.name : uni.nameRu) : id;
    };

    const getCityName = (id: string | null) => {
        if (!id) return "-";
        const city = CITIES.find(c => c.id === id);
        return city ? (isRTL ? city.name : city.nameRu) : id;
    };

    const statsCards = [
        { label: t("members.totalMembers"), value: totalMembers, icon: Users, color: "from-blue-500 to-cyan-500", iconColor: "text-blue-500" },
        { label: t("members.onlineNow"), value: onlineMembers, icon: Wifi, color: "from-emerald-500 to-green-500", iconColor: "text-emerald-500" },
        { label: t("members.newToday"), value: newToday, icon: UserPlus, color: "from-violet-500 to-purple-500", iconColor: "text-violet-500" },
        { label: t("members.totalActivity"), value: totalActivity, icon: Activity, color: "from-amber-500 to-orange-500", iconColor: "text-amber-500" },
    ];

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white shadow-lg shadow-violet-500/25">
                            <Users size={24} />
                        </div>
                        {t("members.title")}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                        {t("members.description")}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                                <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                        <input
                            type="text"
                            placeholder={t("members.search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full h-11 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all`}
                        />
                    </div>

                    {/* University Filter */}
                    <div className="relative">
                        <select
                            value={universityFilter}
                            onChange={(e) => setUniversityFilter(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm appearance-none outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                            <option value="">{t("members.allUniversities")}</option>
                            {UNIVERSITIES.map(uni => (
                                <option key={uni.id} value={uni.id}>{isRTL ? uni.name : uni.nameRu}</option>
                            ))}
                        </select>
                        <ChevronDown className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
                    </div>

                    {/* City Filter */}
                    <div className="relative">
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm appearance-none outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                            <option value="">{t("members.allCities")}</option>
                            {CITIES.map(city => (
                                <option key={city.id} value={city.id}>{isRTL ? city.name : city.nameRu}</option>
                            ))}
                        </select>
                        <ChevronDown className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm appearance-none outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        >
                            <option value="">{t("members.allStatuses")}</option>
                            <option value="online">{t("members.online")}</option>
                            <option value="offline">{t("members.offline")}</option>
                        </select>
                        <ChevronDown className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={16} />
                    </div>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredMembers.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        <Users className="mx-auto mb-3 text-slate-300 dark:text-slate-700" size={48} />
                        {t("members.empty")}
                    </div>
                ) : (
                    filteredMembers.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-500/30 transition-all group"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                            {member.image ? (
                                                <Image src={member.image} alt={member.name || ""} fill className="object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-white">
                                                    {member.name?.[0]?.toUpperCase() || "?"}
                                                </span>
                                            )}
                                        </div>
                                        {/* Online indicator */}
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${member.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            {member.name || t("users.noName")}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-mono">{member.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${member.role === "ADMIN" ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" :
                                    member.role === "EDITOR" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
                                        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                                    }`}>
                                    {t(`nav.roles.${member.role}` as any)}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <GraduationCap size={14} className="text-violet-500" />
                                    <span>{getUniversityName(member.university)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Calendar size={14} className="text-blue-500" />
                                    <span>{getCityName(member.city)}</span>
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="flex items-center gap-3 py-3 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Calendar size={12} className="text-emerald-500" />
                                    <span>{member._count?.rsvps || 0} {t("members.events")}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <GraduationCap size={12} className="text-blue-500" />
                                    <span>{member._count?.enrollments || 0} {t("members.courses")}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Camera size={12} className="text-amber-500" />
                                    <span>{member._count?.photos || 0} {t("members.photos")}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={`/${locale}/members/${member.id}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-xl transition-colors"
                                >
                                    <Eye size={14} />
                                    {t("members.view")}
                                </Link>
                                <Link
                                    href={`/admin/members/${member.id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors"
                                >
                                    <Edit size={14} />
                                    {t("members.edit")}
                                </Link>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    disabled={deleting === member.id}
                                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {deleting === member.id ? (
                                        <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                        <Trash2 size={14} />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
