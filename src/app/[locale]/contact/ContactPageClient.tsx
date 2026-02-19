"use client";

import { motion } from "framer-motion";
import {
    Phone, Mail, MapPin, MessageCircle, Send,
    Sparkles, ArrowRight, Clock, Globe
} from "lucide-react";
import { useState } from "react";

interface ContactSettings {
    phone?: string;
    email?: string;
    whatsapp?: string;
    telegram?: string;
}

const fadeUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function ContactPageClient({
    locale,
    contact,
}: {
    locale: "ar" | "ru";
    contact: ContactSettings;
}) {
    const isRTL = locale === "ar";

    const [form, setForm] = useState({
        name: "",
        subject: "",
        message: "",
    });

    const buildMessage = () => {
        const lines = [
            locale === "ar" ? `📩 رسالة من: ${form.name}` : `📩 Сообщение от: ${form.name}`,
            locale === "ar" ? `📌 الموضوع: ${form.subject}` : `📌 Тема: ${form.subject}`,
            "",
            form.message,
        ];
        return lines.join("\n");
    };

    const isFormValid = form.name.trim() && form.subject.trim() && form.message.trim();

    const sendViaWhatsApp = () => {
        if (!isFormValid) return;
        const phone = (contact.whatsapp || contact.phone || "").replace(/[^0-9]/g, "");
        const text = encodeURIComponent(buildMessage());
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    };

    const sendViaTelegram = () => {
        if (!isFormValid) return;
        const username = (contact.telegram || "").replace("@", "").replace("https://t.me/", "");
        const text = encodeURIComponent(buildMessage());
        window.open(`https://t.me/${username}?text=${text}`, "_blank");
    };

    const contactCards = [
        contact.whatsapp && {
            icon: MessageCircle,
            label: "WhatsApp",
            value: contact.whatsapp,
            href: `https://wa.me/${(contact.whatsapp).replace(/[^0-9]/g, "")}`,
            color: "from-green-500 to-emerald-500",
            bg: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20",
        },
        contact.telegram && {
            icon: Send,
            label: "Telegram",
            value: contact.telegram,
            href: contact.telegram.startsWith("http") ? contact.telegram : `https://t.me/${contact.telegram.replace("@", "")}`,
            color: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
        },
        contact.phone && {
            icon: Phone,
            label: locale === "ar" ? "هاتف" : "Телефон",
            value: contact.phone,
            href: `tel:${contact.phone}`,
            color: "from-violet-500 to-purple-500",
            bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
        },
        contact.email && {
            icon: Mail,
            label: locale === "ar" ? "بريد إلكتروني" : "Эл. почта",
            value: contact.email,
            href: `mailto:${contact.email}`,
            color: "from-amber-500 to-orange-500",
            bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
        },
    ].filter(Boolean) as any[];

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            {/* ═══════════════════ HERO ═══════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative container mx-auto px-4 max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/10"
                    >
                        <Sparkles size={16} className="text-yellow-300" />
                        {locale === "ar" ? "نحن هنا لمساعدتك" : "Мы здесь, чтобы помочь"}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
                    >
                        {locale === "ar" ? "تواصل معنا" : "Свяжитесь с нами"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/80 max-w-2xl mx-auto"
                    >
                        {locale === "ar"
                            ? "لأي استفسار أو اقتراح، لا تتردد في التواصل معنا. نسعد بخدمتكم."
                            : "По любым вопросам или предложениям не стесняйтесь обращаться к нам."
                        }
                    </motion.p>
                </div>
            </section>

            {/* ═══════════════════ CONTACT CARDS ═══════════════════ */}
            {contactCards.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className={`grid gap-4 ${contactCards.length >= 4 ? "md:grid-cols-4" : contactCards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                            {contactCards.map((card: any, i: number) => (
                                <motion.a
                                    key={i}
                                    href={card.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`p-5 rounded-2xl border ${card.bg} hover:shadow-lg transition-all group`}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                                        <card.icon size={22} />
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{card.label}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1" dir="ltr">{card.value}</div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════ FORM + INFO ═══════════════════ */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid lg:grid-cols-5 gap-10">

                        {/* Form — 3 cols */}
                        <motion.div {...fadeUp} className="lg:col-span-3">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                    {locale === "ar" ? "أرسل رسالتك" : "Отправить сообщение"}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                                    {locale === "ar"
                                        ? "اكتب رسالتك وأرسلها مباشرة عبر واتساب أو تلغرام"
                                        : "Напишите сообщение и отправьте через WhatsApp или Telegram"
                                    }
                                </p>

                                <div className="space-y-5">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {locale === "ar" ? "الاسم" : "Имя"}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            placeholder={locale === "ar" ? "اكتب اسمك" : "Введите ваше имя"}
                                        />
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {locale === "ar" ? "الموضوع" : "Тема"}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            placeholder={locale === "ar" ? "موضوع الرسالة" : "Тема сообщения"}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {locale === "ar" ? "الرسالة" : "Сообщение"}
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y"
                                            placeholder={locale === "ar" ? "اكتب رسالتك هنا..." : "Введите ваше сообщение..."}
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        {contact.whatsapp && (
                                            <button
                                                onClick={sendViaWhatsApp}
                                                disabled={!isFormValid}
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                                            >
                                                <MessageCircle size={20} />
                                                {locale === "ar" ? "إرسال عبر واتساب" : "Отправить через WhatsApp"}
                                            </button>
                                        )}
                                        {contact.telegram && (
                                            <button
                                                onClick={sendViaTelegram}
                                                disabled={!isFormValid}
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                                            >
                                                <Send size={20} />
                                                {locale === "ar" ? "إرسال عبر تلغرام" : "Отправить через Telegram"}
                                            </button>
                                        )}
                                    </div>

                                    {!isFormValid && (form.name || form.subject || form.message) && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400">
                                            {locale === "ar" ? "⚠️ يرجى ملء جميع الحقول" : "⚠️ Пожалуйста, заполните все поля"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Info — 2 cols */}
                        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-5">
                            {/* Location Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-rose-100 dark:bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {locale === "ar" ? "الموقع" : "Местоположение"}
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    {locale === "ar" ? "موسكو، روسيا الاتحادية" : "Москва, Российская Федерация"}
                                </p>
                                {/* Map */}
                                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-44">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.2!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCBNb3Njb3c!5e0!3m2!1sen!2sru!4v1"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                                        <Clock size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {locale === "ar" ? "أوقات الاستجابة" : "Время ответа"}
                                    </h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-600 dark:text-slate-400">{locale === "ar" ? "واتساب" : "WhatsApp"}</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{locale === "ar" ? "فوري" : "Мгновенно"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-600 dark:text-slate-400">{locale === "ar" ? "تلغرام" : "Telegram"}</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{locale === "ar" ? "فوري" : "Мгновенно"}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-600 dark:text-slate-400">{locale === "ar" ? "البريد" : "Почта"}</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">{locale === "ar" ? "خلال 24 ساعة" : "В течение 24 часов"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <Globe size={20} className="text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {locale === "ar" ? "روابط سريعة" : "Быстрые ссылки"}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: locale === "ar" ? "الأسئلة الشائعة" : "Часто задаваемые вопросы", href: `/${locale}/about` },
                                        { label: locale === "ar" ? "ادعم الجالية" : "Поддержать", href: `/${locale}/donate` },
                                    ].map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.href}
                                            className="flex items-center justify-between p-3 bg-white/70 dark:bg-slate-900/50 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                                        >
                                            {link.label}
                                            <ArrowRight size={16} className={`text-slate-400 group-hover:text-emerald-500 transition-colors ${isRTL ? "rotate-180" : ""}`} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
