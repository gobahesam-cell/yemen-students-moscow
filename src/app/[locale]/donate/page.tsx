"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Heart, CreditCard, Wallet, Building2, Copy, CheckCircle2, Sparkles, Users, GraduationCap, Stethoscope } from "lucide-react";
import { useState } from "react";

export default function DonatePage() {
    const locale = useLocale() as "ar" | "ru";
    const isRTL = locale === "ar";
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const causes = [
        {
            icon: GraduationCap,
            title: locale === "ar" ? "دعم الطلاب" : "Помощь студентам",
            desc: locale === "ar" ? "مساعدة الطلاب المحتाجين في الرسوم والسكن" : "Помощь нуждающимся студентам с оплатой и проживанием",
            color: "blue"
        },
        {
            icon: Stethoscope,
            title: locale === "ar" ? "الدعم الصحي" : "Медицинская помощь",
            desc: locale === "ar" ? "تغطية تكاليف العلاج للحالات الطارئة" : "Покрытие расходов на лечение в экстренных случаях",
            color: "green"
        },
        {
            icon: Users,
            title: locale === "ar" ? "الفعاليات المجتمعية" : "Общественные мероприятия",
            desc: locale === "ar" ? "تنظيم الفعاليات والمناسبات للجالية" : "Организация мероприятий для сообщества",
            color: "purple"
        },
    ];

    const paymentMethods = [
        {
            id: "sberbank",
            icon: Building2,
            name: locale === "ar" ? "سبيربانك" : "Сбербанк",
            details: "4276 3800 1234 5678",
            holder: locale === "ar" ? "اسم صاحب الحساب" : "Имя владельца"
        },
        {
            id: "tinkoff",
            icon: CreditCard,
            name: locale === "ar" ? "تينكوف" : "Тинькофф",
            details: "5536 9137 8765 4321",
            holder: locale === "ar" ? "اسم صاحب الحساب" : "Имя владельца"
        },
        {
            id: "qiwi",
            icon: Wallet,
            name: "QIWI / YooMoney",
            details: "+7 (XXX) XXX-XX-XX",
            holder: ""
        },
    ];

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-red-600 to-orange-500 text-white py-24">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
                    <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="relative container mx-auto px-4 max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6"
                    >
                        <Sparkles size={16} />
                        {locale === "ar" ? "ساهم في دعم الجالية" : "Поддержите сообщество"}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
                    >
                        {locale === "ar" ? "تبرع لدعم الجالية" : "Пожертвуйте на поддержку"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-2xl mx-auto mb-10"
                    >
                        {locale === "ar"
                            ? "تبرعاتكم تساهم في دعم الطلاب المحتاجين وتنظيم الفعاليات المجتمعية وتقديم المساعدات الطارئة."
                            : "Ваши пожертвования помогают поддерживать нуждающихся студентов, организовывать мероприятия и оказывать экстренную помощь."
                        }
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-rose-600 rounded-2xl font-bold text-lg shadow-2xl"
                    >
                        <Heart className="animate-pulse" fill="currentColor" />
                        {locale === "ar" ? "كل مساهمة تصنع الفرق" : "Каждый вклад имеет значение"}
                    </motion.div>
                </div>
            </section>

            {/* Causes Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            {locale === "ar" ? "أين تذهب تبرعاتكم؟" : "Куда идут ваши пожертвования?"}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {locale === "ar" ? "نحرص على صرف التبرعات في المجالات الأكثر احتياجاً" : "Мы направляем пожертвования туда, где они больше всего нужны"}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {causes.map((cause, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${cause.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                                        cause.color === 'green' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                                            'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                    }`}>
                                    <cause.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cause.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{cause.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            {locale === "ar" ? "طرق التبرع" : "Способы пожертвования"}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {locale === "ar" ? "اختر الطريقة المناسبة لك للتبرع" : "Выберите удобный для вас способ пожертвования"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {paymentMethods.map((method, i) => (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4 hover:border-rose-300 dark:hover:border-rose-500/30 transition-colors"
                            >
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                                    <method.icon size={24} className="text-slate-700 dark:text-slate-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-900 dark:text-white">{method.name}</div>
                                    <div className="text-lg font-mono text-slate-600 dark:text-slate-400 truncate">
                                        {method.details}
                                    </div>
                                    {method.holder && (
                                        <div className="text-sm text-slate-400">{method.holder}</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(method.details, method.id)}
                                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-colors shrink-0"
                                >
                                    {copied === method.id ? (
                                        <CheckCircle2 size={20} className="text-green-600" />
                                    ) : (
                                        <Copy size={20} className="text-slate-500" />
                                    )}
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-12 p-6 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 text-center"
                    >
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                            {locale === "ar"
                                ? "للتبرعات الكبيرة أو الاستفسارات، تواصل معنا مباشرة:"
                                : "Для крупных пожертвований или вопросов свяжитесь с нами:"
                            }
                        </p>
                        <Link
                            href={`/${locale}/contact`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors"
                        >
                            {locale === "ar" ? "تواصل معنا" : "Связаться с нами"}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Thank You Bottom */}
            <section className="py-16 bg-slate-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <Heart className="mx-auto mb-4 text-rose-500" size={40} fill="currentColor" />
                    <h3 className="text-2xl font-bold mb-2">
                        {locale === "ar" ? "شكراً لدعمكم" : "Спасибо за вашу поддержку"}
                    </h3>
                    <p className="text-slate-400">
                        {locale === "ar" ? "جزاكم الله خيراً على مساهمتكم في دعم الجالية" : "Благодарим вас за вклад в поддержку сообщества"}
                    </p>
                </div>
            </section>
        </main>
    );
}
