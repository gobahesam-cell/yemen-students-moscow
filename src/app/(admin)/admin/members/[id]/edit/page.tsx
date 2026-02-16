"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight, Save, Loader2, User, Mail, GraduationCap,
    MapPin, Phone, Send, FileText, Trash2, Shield, Info,
    Sparkles, Globe, UserCheck
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const UNIVERSITIES = [
    { id: "msu", name: "جامعة موسكو الحكومية", nameRu: "МГУ им. М.В. Ломоносова" },
    { id: "rudn", name: "جامعة الصداقة بين الشعوب", nameRu: "РУДН" },
    { id: "hse", name: "المدرسة العليا للاقتصاد", nameRu: "НИУ ВШЭ" },
    { id: "misis", name: "جامعة ميسيس", nameRu: "НИТУ МИСиС" },
    { id: "bauman", name: "جامعة باومان التقنية", nameRu: "МГТУ им. Н.Э. Баумана" },
    { id: "mgimo", name: "معهد موسكو للعلاقات الدولية", nameRu: "МГИМО" },
    { id: "mephi", name: "جامعة ميفي النووية", nameRu: "НИЯУ МИФИ" },
    { id: "rggu", name: "الجامعة الروسية للعلوم الإنسانية", nameRu: "РГГУ" },
    { id: "rea", name: "أكاديمية بليخانوف الاقتصادية", nameRu: "РЭУ им. Г.В. Плеханова" },
    { id: "mglu", name: "جامعة موسكو اللغوية", nameRu: "МГЛУ" },
    { id: "other", name: "جامعة أخرى", nameRu: "Другой" },
];

const CITIES = [
    { id: "moscow", name: "موسكو", nameRu: "Москва" },
    { id: "spb", name: "سانت بطرسبرغ", nameRu: "Санкт-Петербург" },
    { id: "kazan", name: "قازان", nameRu: "Казань" },
    { id: "novosibirsk", name: "نوفوسيبيرسك", nameRu: "Новосибирск" },
    { id: "yekaterinburg", name: "يكاترينبرغ", nameRu: "Екатеринбург" },
    { id: "nizhny", name: "نيجني نوفغورود", nameRu: "Нижний Новгород" },
    { id: "rostov", name: "روستوف على الدون", nameRu: "Ростов-на-Дону" },
    { id: "other", name: "مدينة أخرى", nameRu: "Другой" },
];

interface MemberData {
    id: string;
    name: string | null;
    nameRu: string | null;
    email: string;
    image: string | null;
    role: string;
    university: string | null;
    city: string | null;
    bio: string | null;
    phone: string | null;
    telegram: string | null;
}

export default function AdminMemberEditPage() {
    const router = useRouter();
    const params = useParams();
    const t = useTranslations("Admin.members");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const memberId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [member, setMember] = useState<MemberData | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        nameRu: "",
        email: "",
        role: "MEMBER",
        university: "",
        city: "",
        bio: "",
        phone: "",
        telegram: "",
    });

    useEffect(() => {
        fetchMember();
    }, [memberId]);

    async function fetchMember() {
        try {
            const res = await fetch(`/api/admin/members/${memberId}`);
            if (!res.ok) throw new Error(t("fetchError"));
            const data = await res.json();
            setMember(data);
            setFormData({
                name: data.name || "",
                nameRu: data.nameRu || "",
                email: data.email || "",
                role: data.role || "MEMBER",
                university: data.university || "",
                city: data.city || "",
                bio: data.bio || "",
                phone: data.phone || "",
                telegram: data.telegram || "",
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/admin/members/${memberId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || t("saveError"));
            }

            setSuccess("✅ " + t("savedSuccess"));
            setTimeout(() => {
                router.refresh();
                router.push("/admin/members");
            }, 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
                <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
                <p className="font-black text-slate-500 animate-pulse">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="p-12 text-center bg-rose-500/5 rounded-[3rem] border border-rose-500/10">
                <p className="text-xl font-black text-rose-500">{t("memberNotFound")}</p>
                <Link href="/admin/members" className="mt-8 inline-flex items-center gap-2 text-slate-900 dark:text-white font-black hover:underline">
                    <ArrowRight className="rtl:rotate-0 rotate-180" size={20} />
                    {t("backToList")}
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-32 max-w-5xl mx-auto space-y-10" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl">
                <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

                <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white/10 shadow-2xl">
                        {member.image ? (
                            <Image src={member.image} alt={member.name || ""} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-black bg-gradient-to-br from-slate-700 to-slate-800 text-slate-400">
                                {member.name?.charAt(0) || "?"}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <Link
                            href="/admin/members"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-black text-xs uppercase tracking-widest mb-2"
                        >
                            <ArrowRight size={16} className="rtl:rotate-0 rotate-180" />
                            <span>{t("backToList")}</span>
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight">{t("editTitle")}</h1>
                        <p className="mt-1 font-bold text-slate-400">{member.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest backdrop-blur-md ${member.role === 'ADMIN' ? 'bg-amber-500 text-black' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {member.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence>
                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-6 rounded-[2rem] font-black text-sm flex items-center gap-4 ${error ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'}`}
                            >
                                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${error ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                                    {error ? <Shield size={20} /> : <UserCheck size={20} />}
                                </div>
                                {error || success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form id="member-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info Group */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <User size={20} />
                                </div>
                                <h2 className="text-lg font-black tracking-tight uppercase tracking-widest text-slate-900 dark:text-white">{t("basicInfo")}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("nameAr")}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl px-5 font-bold transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("nameRu")}</label>
                                    <input
                                        type="text"
                                        value={formData.nameRu}
                                        onChange={(e) => handleChange("nameRu", e.target.value)}
                                        dir="ltr"
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl px-5 font-bold transition-all outline-none text-left"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("email")}</label>
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl pr-12 pl-5 font-bold transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("role")}</label>
                                    <div className="relative">
                                        <Shield className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            value={formData.role}
                                            onChange={(e) => handleChange("role", e.target.value)}
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl pr-12 pl-5 font-black transition-all outline-none appearance-none"
                                        >
                                            <option value="MEMBER">{t("roleMember")}</option>
                                            <option value="ADMIN">{t("roleAdmin")}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Study Info Group */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <GraduationCap size={20} />
                                </div>
                                <h2 className="text-lg font-black tracking-tight uppercase tracking-widest text-slate-900 dark:text-white">{t("studyInfo")}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("universityLabel")}</label>
                                    <select
                                        value={formData.university}
                                        onChange={(e) => handleChange("university", e.target.value)}
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl px-5 font-bold transition-all outline-none"
                                    >
                                        <option value="">{t("notSpecified")}</option>
                                        {UNIVERSITIES.map((uni) => (
                                            <option key={uni.id} value={uni.id}>{isRTL ? uni.name : uni.nameRu}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("cityLabel")}</label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl px-5 font-bold transition-all outline-none"
                                    >
                                        <option value="">{t("notSpecified")}</option>
                                        {CITIES.map((city) => (
                                            <option key={city.id} value={city.id}>{isRTL ? city.name : city.nameRu}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Info Group */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <Phone size={20} />
                                </div>
                                <h2 className="text-lg font-black tracking-tight uppercase tracking-widest text-slate-900 dark:text-white">{t("contactInfo")}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("phone")}</label>
                                    <div className="relative">
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            dir="ltr"
                                            placeholder="+7 999 123 45 67"
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl pr-12 pl-5 font-bold transition-all outline-none text-left"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("telegram")}</label>
                                    <div className="relative">
                                        <Send className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={formData.telegram}
                                            onChange={(e) => handleChange("telegram", e.target.value)}
                                            dir="ltr"
                                            placeholder="@username"
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl pr-12 pl-5 font-bold transition-all outline-none text-left"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("bio")}</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleChange("bio", e.target.value)}
                                    rows={5}
                                    className="w-full p-6 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] font-medium leading-relaxed outline-none transition-all resize-none"
                                    placeholder={isRTL ? "اكتب نبذة مختصرة عن العضو..." : "Write a short bio..."}
                                />
                            </div>
                        </motion.div>
                    </form>
                </div>

                {/* Sidebar Sticky Actions */}
                <div className="space-y-8">
                    <div className="sticky top-10 space-y-8">
                        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-slate-900/50 backdrop-blur-xl">
                            <div className="flex flex-col gap-4">
                                <button
                                    form="member-form"
                                    type="submit"
                                    disabled={saving}
                                    className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <Save size={24} />
                                    )}
                                    <span className="uppercase tracking-[0.15em]">{t("saveChanges")}</span>
                                </button>

                                <Link
                                    href="/admin/members"
                                    className="flex h-16 w-full items-center justify-center rounded-2xl bg-slate-100 font-black text-slate-900 transition-all hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                                >
                                    {t("cancel")}
                                </Link>
                            </div>

                            <div className="mt-8 border-t border-slate-100 pt-8 dark:border-white/5">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-500/5 text-blue-500">
                                    <Info size={18} className="mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-widest">{isRTL ? "تحذير الأمان" : "Security Tip"}</p>
                                        <p className="text-[10px] font-bold leading-relaxed opacity-80">
                                            {isRTL ? "تغيير الصلاحيات إلى مدير يمنح المستخدم وصولاً كاملاً للوحة التحكم والبيانات الحساسة." : "Granting ADMIN role gives full access to the dashboard and sensitive data."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[2.5rem] border border-rose-500/10 bg-rose-500/5 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-rose-500 text-sm uppercase tracking-widest">{isRTL ? "منطقة الخطر" : "Danger Zone"}</h4>
                                <Trash2 size={20} className="text-rose-500 opacity-50" />
                            </div>
                            <p className="text-[10px] font-bold text-rose-500/70 mb-6 leading-relaxed">
                                {isRTL ? "سيؤدي حذف هذا العضو إلى إزالته نهائياً من النظام وكافة سجلاته." : "Deleting this member will permanently remove them and all their records from the system."}
                            </p>
                            <button className="h-14 w-full rounded-2xl bg-rose-500 px-6 font-black text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-600 active:scale-95 text-xs uppercase tracking-widest">
                                {isRTL ? "حذف الحساب نهائياً" : "Permanently Delete Member"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
