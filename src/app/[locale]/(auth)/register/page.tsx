"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Lock, ArrowLeft, Loader2,
    MapPin, Calendar, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

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

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        city: "",
        agreedToData: false,
    });

    const isFormValid =
        formData.name &&
        formData.email &&
        formData.password.length >= 6 &&
        formData.city &&
        formData.agreedToData;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    agreedToTerms: true, // Auto-agree for simplification
                    agreedToPrivacy: true,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || t("registerFailed"));
            }

            router.refresh();
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: string, value: string | boolean) => {
        setFormData({ ...formData, [field]: value });
    };

    const getCityDisplayName = (city: typeof CITIES[0]) => {
        return isRTL ? `${city.name} (${city.nameRu})` : `${city.nameRu} (${city.name})`;
    };

    return (
        <div className="relative py-8 md:py-20 flex items-center justify-center px-4 overflow-hidden min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[140px] translate-y-1/2" />
            </div>

            <div className="w-full max-w-xl relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all mb-8 group font-bold text-sm"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors shadow-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                    </div>
                    <span>{t("backToSite")}</span>
                </Link>

                {/* Header */}
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative mx-auto mb-6 h-20 w-20"
                    >
                        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl animate-pulse" />
                        <div className="relative h-20 w-20 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-3">
                            <Image src="/logo.png" alt="Logo" width={60} height={60} className="object-contain" priority />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
                        {t("registerTitle")} <Sparkles className="inline-block text-yellow-500 ml-1" size={24} />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-sm mx-auto">
                        انضم إلى مجتمع الطلاب اليمنيين في موسكو بلمسة واحدة
                    </p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-2xl"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-2xl text-center font-bold mb-8"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("fullNameAr")}</label>
                                <div className="relative group">
                                    <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder={t("fullNameArPlaceholder")}
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all font-medium`}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("emailRequired")}</label>
                                <div className="relative group">
                                    <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all font-medium`}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("passwordRequired")}</label>
                                <div className="relative group">
                                    <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all font-medium`}
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("city")}</label>
                                <div className="relative group">
                                    <MapPin className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                    <select
                                        required
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        className={`w-full h-14 ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all font-medium appearance-none`}
                                    >
                                        <option value="">{t("selectCity")}</option>
                                        {CITIES.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {getCityDisplayName(city)}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-slate-400`}>
                                        <ArrowLeft size={16} className="rotate-[270deg]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Consent */}
                        <div className="mt-4">
                            <label className="flex items-start gap-4 p-5 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-yellow-500/50 cursor-pointer transition-all group bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="relative mt-1">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreedToData}
                                        onChange={(e) => handleChange("agreedToData", e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${formData.agreedToData
                                        ? "bg-yellow-500 border-yellow-500"
                                        : "border-slate-300 dark:border-slate-600 group-hover:border-yellow-500"
                                        }`}>
                                        {formData.agreedToData && <CheckCircle2 className="text-black" size={18} />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ShieldCheck className="text-emerald-500" size={18} />
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">أوافق على معالجة بياناتي الشخصية</p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        بالتسجيل، أنت توافق على قوانين معالجة البيانات في روسيا الاتحادية وضوابط الخصوصية للمجتمع.
                                    </p>
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full h-16 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-slate-300 disabled:to-slate-400 text-black rounded-3xl font-black text-lg transition-all shadow-2xl shadow-yellow-500/20 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>جاري إنشاء حسابك...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={24} />
                                    <span>إنشاء الحساب الآن</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            {t("hasAccount")}{" "}
                            <Link href="/login" className="text-yellow-600 dark:text-yellow-500 font-black hover:underline underline-offset-4 decoration-2">
                                {t("loginLink")}
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <p className="mt-10 text-center text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] font-black">
                    Yemen Students Community in Moscow © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
