"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, User, Mail, GraduationCap, MapPin, Phone, Send, FileText, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

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

            setSuccess(t("savedSuccess"));
            setTimeout(() => router.push("/admin/members"), 1500);
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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-yellow-500" size={32} />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">{t("memberNotFound")}</p>
                <Link href="/admin/members" className="text-yellow-600 hover:underline mt-4 inline-block">
                    {t("backToList")}
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/members"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm mb-4"
                >
                    <ArrowLeft size={18} />
                    <span>{t("backToList")}</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {member.image ? (
                            <Image src={member.image} alt={member.name || ""} width={64} height={64} className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                                {member.name?.charAt(0) || "?"}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("editTitle")}</h1>
                        <p className="text-slate-500">{member.email}</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-center font-bold">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-center font-bold">
                        {success}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                    <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <User size={20} className="text-yellow-500" />
                        {t("basicInfo")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("nameAr")}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* Name Ru */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("nameRu")}</label>
                            <input
                                type="text"
                                value={formData.nameRu}
                                onChange={(e) => handleChange("nameRu", e.target.value)}
                                dir="ltr"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("email")}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("role")}</label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            >
                                <option value="MEMBER">{t("roleMember")}</option>
                                <option value="ADMIN">{t("roleAdmin")}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                    <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap size={20} className="text-blue-500" />
                        {t("studyInfo")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* University */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("universityLabel")}</label>
                            <select
                                value={formData.university}
                                onChange={(e) => handleChange("university", e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            >
                                <option value="">{t("notSpecified")}</option>
                                {UNIVERSITIES.map((uni) => (
                                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("cityLabel")}</label>
                            <select
                                value={formData.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            >
                                <option value="">{t("notSpecified")}</option>
                                {CITIES.map((city) => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                    <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Phone size={20} className="text-emerald-500" />
                        {t("contactInfo")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("phone")}</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                dir="ltr"
                                placeholder="+7 999 123 45 67"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>

                        {/* Telegram */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("telegram")}</label>
                            <input
                                type="text"
                                value={formData.telegram}
                                onChange={(e) => handleChange("telegram", e.target.value)}
                                dir="ltr"
                                placeholder="@username"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("bio")}</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            rows={4}
                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 resize-none"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:from-slate-300 disabled:to-slate-400 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>{t("saving")}</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{t("saveChanges")}</span>
                            </>
                        )}
                    </button>

                    <Link
                        href="/admin/members"
                        className="h-14 px-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold transition-all flex items-center justify-center"
                    >
                        {t("cancel")}
                    </Link>
                </div>
            </form>
        </div>
    );
}
