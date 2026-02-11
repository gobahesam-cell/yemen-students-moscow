"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, User, GraduationCap, Phone, Camera, Check, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

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

interface UserData {
    id: string;
    name: string | null;
    nameRu: string | null;
    email: string;
    image: string | null;
    university: string | null;
    city: string | null;
    bio: string | null;
    phone: string | null;
    telegram: string | null;
}

export default function ProfileSettingsClient({ user }: { user: UserData }) {
    const router = useRouter();
    const locale = useLocale();
    const isRTL = locale === "ar";

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.image || "");

    const [formData, setFormData] = useState({
        name: user.name || "",
        nameRu: user.nameRu || "",
        university: user.university || "",
        city: user.city || "",
        bio: user.bio || "",
        phone: user.phone || "",
        telegram: user.telegram || "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, image: avatarUrl }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || isRTL ? "فشل في الحفظ" : "Ошибка сохранения");
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                router.refresh();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleAvatarUpload = (result: any) => {
        if (result?.info?.secure_url) {
            setAvatarUrl(result.info.secure_url);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[150px] -translate-y-1/2" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                            {isRTL ? "إعدادات الملف الشخصي" : "Настройки профиля"}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {isRTL ? "تعديل معلوماتك الشخصية" : "Редактирование личной информации"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="pb-20">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                        {/* Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3"
                                >
                                    <X size={20} />
                                    <span className="font-bold">{error}</span>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3"
                                >
                                    <Check size={20} />
                                    <span className="font-bold">{isRTL ? "تم الحفظ بنجاح!" : "Сохранено успешно!"}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Avatar */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                                {formData.name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>

                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ysm_uploads"}
                                        onSuccess={handleAvatarUpload}
                                        options={{
                                            maxFiles: 1,
                                            cropping: true,
                                            croppingAspectRatio: 1,
                                            folder: "avatars",
                                        }}
                                    >
                                        {({ open }) => (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 hover:bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg transition-all"
                                            >
                                                <Camera size={18} className="text-black" />
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {isRTL ? "صورة الملف الشخصي" : "Фото профиля"}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {isRTL ? "انقر على الكاميرا لتغيير الصورة" : "Нажмите на камеру, чтобы изменить"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
                            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <User size={20} className="text-yellow-500" />
                                {isRTL ? "المعلومات الأساسية" : "Основная информация"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {isRTL ? "الاسم (بالعربية)" : "Имя (на арабском)"}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {isRTL ? "الاسم (بالروسية)" : "Имя (на русском)"}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nameRu}
                                        onChange={(e) => handleChange("nameRu", e.target.value)}
                                        dir="ltr"
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Study Info */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
                            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <GraduationCap size={20} className="text-blue-500" />
                                {isRTL ? "معلومات الدراسة" : "Информация об учебе"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {isRTL ? "الجامعة" : "Университет"}
                                    </label>
                                    <select
                                        value={formData.university}
                                        onChange={(e) => handleChange("university", e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                    >
                                        <option value="">{isRTL ? "اختر الجامعة" : "Выберите университет"}</option>
                                        {UNIVERSITIES.map((uni) => (
                                            <option key={uni.id} value={uni.id}>
                                                {isRTL ? uni.name : uni.nameRu}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {isRTL ? "المدينة" : "Город"}
                                    </label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                    >
                                        <option value="">{isRTL ? "اختر المدينة" : "Выберите город"}</option>
                                        {CITIES.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {isRTL ? city.name : city.nameRu}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
                            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Phone size={20} className="text-emerald-500" />
                                {isRTL ? "معلومات الاتصال" : "Контактная информация"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {isRTL ? "رقم الهاتف" : "Телефон"}
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        dir="ltr"
                                        placeholder="+7 999 123 45 67"
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Telegram</label>
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

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    {isRTL ? "نبذة تعريفية" : "О себе"}
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleChange("bio", e.target.value)}
                                    rows={4}
                                    placeholder={isRTL ? "اكتب نبذة قصيرة عنك..." : "Расскажите о себе..."}
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:from-slate-300 disabled:to-slate-400 text-black rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>{isRTL ? "جاري الحفظ..." : "Сохранение..."}</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>{isRTL ? "حفظ التغييرات" : "Сохранить изменения"}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
