"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowLeft, ArrowRight, Loader2, GraduationCap, MapPin, Phone, Send, CheckCircle2, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

// قوائم الجامعات والمدن
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

export default function RegisterPage() {
    const router = useRouter();
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        nameRu: "",
        email: "",
        password: "",
        university: "",
        city: "",
        phone: "",
        telegram: "",
        agreedToTerms: false,
        agreedToPrivacy: false,
    });

    const canProceedStep1 = formData.name && formData.email && formData.password.length >= 6;
    const canProceedStep2 = formData.university && formData.city;
    const canSubmit = formData.agreedToTerms && formData.agreedToPrivacy;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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

    const getUniDisplayName = (uni: typeof UNIVERSITIES[0]) => {
        return isRTL ? `${uni.name} (${uni.nameRu})` : `${uni.nameRu} (${uni.name})`;
    };

    const getCityDisplayName = (city: typeof CITIES[0]) => {
        return isRTL ? `${city.name} (${city.nameRu})` : `${city.nameRu} (${city.name})`;
    };

    return (
        <div className="relative py-8 md:py-16 flex items-center justify-center px-4 overflow-hidden min-h-screen">
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 group font-bold text-sm"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                    <span>{t("backToSite")}</span>
                </Link>

                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative mx-auto mb-4 h-16 w-16"
                    >
                        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl animate-pulse" />
                        <div className="relative h-16 w-16 flex items-center justify-center">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
                        </div>
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">{t("registerTitle")}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t("stepOf", { step: step.toString() })}</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-yellow-500" : "bg-slate-200 dark:bg-slate-800"
                                }`}
                        />
                    ))}
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-2xl text-center font-bold mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <User className="text-yellow-600" size={24} />
                                        </div>
                                        <h2 className="font-bold text-slate-900 dark:text-white">{t("basicInfo")}</h2>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("fullNameAr")}</label>
                                        <div className="relative group">
                                            <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                            <input
                                                type="text"
                                                required
                                                placeholder={t("fullNameArPlaceholder")}
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("nameRuOptional")}</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Мухаммад Ахмед"
                                                value={formData.nameRu}
                                                onChange={(e) => handleChange("nameRu", e.target.value)}
                                                dir="ltr"
                                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("emailRequired")}</label>
                                        <div className="relative group">
                                            <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                            <input
                                                type="email"
                                                required
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("passwordRequired")}</label>
                                        <div className="relative group">
                                            <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors`} size={20} />
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => handleChange("password", e.target.value)}
                                                className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium`}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        disabled={!canProceedStep1}
                                        className="w-full h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:from-slate-300 disabled:to-slate-400 text-black rounded-2xl font-bold transition-all shadow-xl shadow-yellow-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                                    >
                                        <span>{t("next")}</span>
                                        <ArrowRight size={18} className="rtl:rotate-180" />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Study Info */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <GraduationCap className="text-blue-600" size={24} />
                                        </div>
                                        <h2 className="font-bold text-slate-900 dark:text-white">{t("studyInfo")}</h2>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("university")}</label>
                                        <div className="relative group">
                                            <Building2 className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                                            <select
                                                required
                                                value={formData.university}
                                                onChange={(e) => handleChange("university", e.target.value)}
                                                className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium appearance-none`}
                                            >
                                                <option value="">{t("selectUniversity")}</option>
                                                {UNIVERSITIES.map((uni) => (
                                                    <option key={uni.id} value={uni.id}>
                                                        {getUniDisplayName(uni)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("city")}</label>
                                        <div className="relative group">
                                            <MapPin className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                                            <select
                                                required
                                                value={formData.city}
                                                onChange={(e) => handleChange("city", e.target.value)}
                                                className={`w-full h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium appearance-none`}
                                            >
                                                <option value="">{t("selectCity")}</option>
                                                {CITIES.map((city) => (
                                                    <option key={city.id} value={city.id}>
                                                        {getCityDisplayName(city)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("phoneOptional")}</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="tel"
                                                placeholder="+7 999 123 45 67"
                                                value={formData.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                dir="ltr"
                                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("telegramOptional")}</label>
                                        <div className="relative group">
                                            <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder="@username"
                                                value={formData.telegram}
                                                onChange={(e) => handleChange("telegram", e.target.value)}
                                                dir="ltr"
                                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft size={18} className="rtl:rotate-180" />
                                            <span>{t("previous")}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            disabled={!canProceedStep2}
                                            className="flex-1 h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:from-slate-300 disabled:to-slate-400 text-black rounded-2xl font-bold transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2"
                                        >
                                            <span>{t("next")}</span>
                                            <ArrowRight size={18} className="rtl:rotate-180" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Legal Consent */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle2 className="text-emerald-600" size={24} />
                                        </div>
                                        <h2 className="font-bold text-slate-900 dark:text-white">{t("legalConsent")}</h2>
                                        <p className="text-xs text-slate-500 mt-1">{t("legalNote")}</p>
                                    </div>

                                    {/* Terms Agreement */}
                                    <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-yellow-500 cursor-pointer transition-all group">
                                        <div className="relative mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedToTerms}
                                                onChange={(e) => handleChange("agreedToTerms", e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.agreedToTerms
                                                ? "bg-yellow-500 border-yellow-500"
                                                : "border-slate-300 dark:border-slate-600 group-hover:border-yellow-500"
                                                }`}>
                                                {formData.agreedToTerms && <CheckCircle2 className="text-black" size={16} />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{t("agreeTerms")}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {t.rich("agreeTermsDesc", {
                                                    terms: (chunks) => <Link href="/terms" className="text-yellow-600 hover:underline">{t("termsLink")}</Link>
                                                })}
                                            </p>
                                        </div>
                                    </label>

                                    {/* Privacy Agreement */}
                                    <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-yellow-500 cursor-pointer transition-all group">
                                        <div className="relative mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedToPrivacy}
                                                onChange={(e) => handleChange("agreedToPrivacy", e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.agreedToPrivacy
                                                ? "bg-yellow-500 border-yellow-500"
                                                : "border-slate-300 dark:border-slate-600 group-hover:border-yellow-500"
                                                }`}>
                                                {formData.agreedToPrivacy && <CheckCircle2 className="text-black" size={16} />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{t("agreePrivacy")}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {t.rich("agreePrivacyDesc", {
                                                    privacy: (chunks) => <Link href="/privacy" className="text-yellow-600 hover:underline">{t("privacyLink")}</Link>
                                                })}
                                            </p>
                                        </div>
                                    </label>

                                    {/* Info Box */}
                                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-200 dark:border-blue-500/20">
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            {t("dataProtectionNote")}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft size={18} className="rtl:rotate-180" />
                                            <span>{t("previous")}</span>
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !canSubmit}
                                            className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    <span>{t("creating")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 size={20} />
                                                    <span>{t("createAccountBtn")}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            {t("hasAccount")}{" "}
                            <Link href="/login" className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline">
                                {t("loginLink")}
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <p className="mt-6 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-bold">
                    {t("copyright", { year: new Date().getFullYear().toString() })}
                </p>
            </div>
        </div>
    );
}
