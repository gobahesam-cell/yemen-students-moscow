"use client";

import { motion } from "framer-motion";
import {
    Target, Star, Users, GraduationCap, Heart,
    BookOpen, Globe, Sparkles, ArrowRight, Megaphone,
    HandHeart, Building2
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function AboutPageClient({ locale }: { locale: "ar" | "ru" }) {
    const isRTL = locale === "ar";

    const goals = locale === "ar"
        ? [
            { icon: Megaphone, text: "تنظيم الفعاليات والأنشطة الطلابية", color: "blue" },
            { icon: Users, text: "تسهيل التواصل بين الطلاب والإدارة", color: "green" },
            { icon: BookOpen, text: "تقديم محتوى تعليمي وإرشادي", color: "purple" },
            { icon: Globe, text: "نشر الأخبار والإعلانات الرسمية", color: "orange" },
            { icon: HandHeart, text: "دعم الطلاب المحتاجين ومساعدتهم", color: "rose" },
            { icon: Building2, text: "تمثيل الجالية لدى الجهات الرسمية", color: "cyan" },
        ]
        : [
            { icon: Megaphone, text: "Организация студенческих мероприятий", color: "blue" },
            { icon: Users, text: "Содействие общению между студентами и администрацией", color: "green" },
            { icon: BookOpen, text: "Предоставление образовательного контента", color: "purple" },
            { icon: Globe, text: "Публикация официальных новостей и объявлений", color: "orange" },
            { icon: HandHeart, text: "Поддержка нуждающихся студентов", color: "rose" },
            { icon: Building2, text: "Представление общины в официальных органах", color: "cyan" },
        ];

    const values = locale === "ar"
        ? [
            { icon: "🤝", label: "التعاون" },
            { icon: "🔍", label: "الشفافية" },
            { icon: "💎", label: "الاحترام" },
            { icon: "⚡", label: "المسؤولية" },
            { icon: "🌟", label: "التميّز" },
            { icon: "❤️", label: "الانتماء" },
        ]
        : [
            { icon: "🤝", label: "Сотрудничество" },
            { icon: "🔍", label: "Прозрачность" },
            { icon: "💎", label: "Уважение" },
            { icon: "⚡", label: "Ответственность" },
            { icon: "🌟", label: "Качество" },
            { icon: "❤️", label: "Принадлежность" },
        ];

    const stats = [
        { value: "2019", label: locale === "ar" ? "سنة التأسيس" : "Год основания" },
        { value: "500+", label: locale === "ar" ? "طالب وطالبة" : "Студентов" },
        { value: "50+", label: locale === "ar" ? "فعالية سنوية" : "Мероприятий в год" },
        { value: "10+", label: locale === "ar" ? "جامعة" : "Университетов" },
    ];

    const colorMap: Record<string, string> = {
        blue: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
        green: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
        purple: "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
        orange: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        rose: "bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
        cyan: "bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20",
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            {/* ═══════════════════ HERO ═══════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-28">
                {/* Decorative */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
                </div>

                <div className="relative container mx-auto px-4 max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/10"
                    >
                        <Sparkles size={16} className="text-yellow-400" />
                        {locale === "ar" ? "تعرّف علينا" : "Познакомьтесь с нами"}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
                    >
                        {locale === "ar" ? (
                            <>الجالية اليمنية <span className="text-yellow-400">في موسكو</span></>
                        ) : (
                            <>Йеменская община <span className="text-yellow-400">в Москве</span></>
                        )}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        {locale === "ar"
                            ? "نحن مجتمع طلابي يمني في موسكو، نعمل على تعزيز التواصل وتقديم الدعم والخدمات للطلاب اليمنيين في روسيا."
                            : "Мы — йеменское студенческое сообщество в Москве, содействующее общению и оказывающее поддержку йеменским студентам в России."
                        }
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                    >
                        {stats.map((s, i) => (
                            <div key={i} className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                <div className="text-2xl md:text-3xl font-black text-yellow-400">{s.value}</div>
                                <div className="text-sm text-blue-200/60 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════ MISSION ═══════════════════ */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div {...fadeUp}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-bold mb-4 border border-yellow-200 dark:border-yellow-500/20">
                                <Target size={14} />
                                {locale === "ar" ? "رسالتنا" : "Наша миссия"}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                {locale === "ar"
                                    ? "خدمة الطلاب اليمنيين وتمثيلهم"
                                    : "Служение йеменским студентам"
                                }
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                {locale === "ar"
                                    ? "نسعى لخدمة الطلاب اليمنيين في موسكو من خلال تنظيم الفعاليات، توفير المعلومات الموثوقة، وتسهيل التواصل مع الجهات الرسمية. هدفنا بناء مجتمع طلابي متماسك يدعم بعضه البعض."
                                    : "Мы стремимся служить йеменским студентам в Москве через организацию мероприятий, предоставление достоверной информации и содействие общению с официальными органами. Наша цель — построить сплочённое студенческое сообщество."
                                }
                            </p>
                        </motion.div>

                        <motion.div
                            {...fadeUp}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-yellow-50 to-blue-50 dark:from-yellow-500/5 dark:to-blue-500/5 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: GraduationCap, label: locale === "ar" ? "تعليم" : "Образование", color: "text-blue-500" },
                                        { icon: Heart, label: locale === "ar" ? "دعم" : "Поддержка", color: "text-rose-500" },
                                        { icon: Users, label: locale === "ar" ? "مجتمع" : "Сообщество", color: "text-green-500" },
                                        { icon: Star, label: locale === "ar" ? "تميّز" : "Качество", color: "text-amber-500" },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 text-center shadow-sm border border-slate-100 dark:border-slate-800">
                                            <item.icon className={`mx-auto ${item.color} mb-2`} size={32} />
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ GOALS ═══════════════════ */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-4 border border-blue-200 dark:border-blue-500/20">
                            <Target size={14} />
                            {locale === "ar" ? "أهدافنا" : "Наши цели"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                            {locale === "ar" ? "ماذا نسعى لتحقيقه؟" : "К чему мы стремимся?"}
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {goals.map((goal, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className={`p-5 rounded-2xl border ${colorMap[goal.color]} bg-opacity-50`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/10 shrink-0">
                                        <goal.icon size={22} />
                                    </div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed pt-1">
                                        {goal.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ VALUES ═══════════════════ */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-sm font-bold mb-4 border border-green-200 dark:border-green-500/20">
                            <Star size={14} />
                            {locale === "ar" ? "قيمنا" : "Наши ценности"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                            {locale === "ar" ? "المبادئ التي نؤمن بها" : "Принципы, в которые мы верим"}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.07 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800 hover:border-yellow-300 dark:hover:border-yellow-500/30 hover:shadow-lg transition-all group cursor-default"
                            >
                                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{v.icon}</span>
                                <span className="font-black text-slate-800 dark:text-white text-lg">{v.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ CTA ═══════════════════ */}
            <section className="py-20 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-500/5 dark:to-amber-500/5">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <motion.div {...fadeUp}>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                            {locale === "ar" ? "انضم إلينا اليوم" : "Присоединяйтесь к нам"}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            {locale === "ar"
                                ? "كن جزءاً من مجتمعنا وساهم في بناء مستقبل أفضل للطلاب اليمنيين في موسكو."
                                : "Станьте частью нашего сообщества и помогите строить лучшее будущее для йеменских студентов в Москве."
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href={`/${locale}/contact`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-colors shadow-lg shadow-yellow-500/20"
                            >
                                {locale === "ar" ? "تواصل معنا" : "Связаться с нами"}
                                <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                            </Link>
                            <Link
                                href={`/${locale}/donate`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-yellow-400 transition-colors"
                            >
                                <Heart size={18} className="text-rose-500" />
                                {locale === "ar" ? "ادعم الجالية" : "Поддержать"}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
