"use client";

import { motion } from "framer-motion";
import {
    Target, Star, Users, GraduationCap, Heart,
    BookOpen, Globe, Sparkles, ArrowRight, Handshake,
    HeadphonesIcon, CalendarDays, Lightbulb, Building2,
    Trophy, TrendingUp, Award, Network
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
            { icon: Handshake, text: "تعزيز الروابط الاجتماعية بين أبناء الجالية.", color: "blue" },
            { icon: Users, text: "دعم الطلاب والمقيمين وتسهيل شؤونهم.", color: "green" },
            { icon: BookOpen, text: "الحفاظ على الهوية اليمنية واللغة العربية.", color: "purple" },
            { icon: Globe, text: "بناء علاقات إيجابية مع المجتمع الروسي.", color: "orange" },
            { icon: Building2, text: "التعاون مع الجهات الرسمية لخدمة أبناء الجالية.", color: "rose" },
            { icon: Lightbulb, text: "نشر الوعي بالقوانين واللوائح المحلية.", color: "cyan" },
        ]
        : [
            { icon: Handshake, text: "Укрепление социальных связей между членами общины.", color: "blue" },
            { icon: Users, text: "Поддержка студентов и резидентов, содействие в их делах.", color: "green" },
            { icon: BookOpen, text: "Сохранение йеменской идентичности и арабского языка.", color: "purple" },
            { icon: Globe, text: "Построение позитивных отношений с российским обществом.", color: "orange" },
            { icon: Building2, text: "Сотрудничество с официальными органами для обслуживания общины.", color: "rose" },
            { icon: Lightbulb, text: "Повышение осведомлённости о местных законах и правилах.", color: "cyan" },
        ];

    const services = locale === "ar"
        ? [
            {
                icon: HeadphonesIcon,
                title: "الإرشاد والدعم",
                desc: "المساعدة في تذليل الصعوبات التي تواجه أفراد الجالية. تقديم التوجيه والدعم ضمن الإمكانيات المتاحة.",
                btn: "اطلب المساعدة",
                href: "/ar/contact",
                color: "from-rose-500 to-pink-500",
                bg: "bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20",
            },
            {
                icon: CalendarDays,
                title: "الأنشطة الثقافية والاجتماعية",
                desc: "تنظيم فعاليات ثقافية وفنية واجتماعية ورياضية. تعزيز روح الانتماء والتواصل بين أبناء الجالية.",
                btn: "عرض الفعاليات",
                href: "/ar/events",
                color: "from-violet-500 to-purple-500",
                bg: "bg-violet-50 dark:bg-violet-500/5 border-violet-200 dark:border-violet-500/20",
            },
            {
                icon: GraduationCap,
                title: "التعليم والتطوير",
                desc: "دورات تدريبية وورش عمل متنوعة. دعم تعليم اللغة العربية والحفاظ على الهوية الثقافية.",
                btn: "ابدأ التعلم",
                href: "/ar/courses",
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20",
            },
            {
                icon: Network,
                title: "العلاقات والتواصل",
                desc: "بناء جسور تواصل مع المجتمع الروسي والجاليات الأخرى. التنسيق مع الجهات الرسمية والدبلوماسية لخدمة أبناء الجالية.",
                btn: "تواصل معنا",
                href: "/ar/contact",
                color: "from-emerald-500 to-green-500",
                bg: "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20",
            },
        ]
        : [
            {
                icon: HeadphonesIcon,
                title: "Консультации и поддержка",
                desc: "Помощь в преодолении трудностей, с которыми сталкиваются члены общины. Консультации и поддержка в рамках имеющихся возможностей.",
                btn: "Обратиться за помощью",
                href: "/ru/contact",
                color: "from-rose-500 to-pink-500",
                bg: "bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20",
            },
            {
                icon: CalendarDays,
                title: "Культурные и социальные мероприятия",
                desc: "Организация культурных, художественных, социальных и спортивных мероприятий. Укрепление духа единства среди членов общины.",
                btn: "Посмотреть мероприятия",
                href: "/ru/events",
                color: "from-violet-500 to-purple-500",
                bg: "bg-violet-50 dark:bg-violet-500/5 border-violet-200 dark:border-violet-500/20",
            },
            {
                icon: GraduationCap,
                title: "Образование и развитие",
                desc: "Тренинги и разнообразные мастер-классы. Поддержка обучения арабскому языку и сохранения культурной идентичности.",
                btn: "Начать обучение",
                href: "/ru/courses",
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20",
            },
            {
                icon: Network,
                title: "Связи и коммуникация",
                desc: "Построение мостов сотрудничества с российским обществом и другими общинами. Координация с официальными и дипломатическими органами.",
                btn: "Связаться с нами",
                href: "/ru/contact",
                color: "from-emerald-500 to-green-500",
                bg: "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20",
            },
        ];

    const achievements = locale === "ar"
        ? [
            { icon: Users, text: "مجتمع متنامٍ من الأعضاء المسجلين." },
            { icon: CalendarDays, text: "تنظيم فعاليات ثقافية واجتماعية ورياضية بشكل مستمر." },
            { icon: GraduationCap, text: "تنفيذ برامج تدريبية وتوعوية تخدم أبناء الجالية." },
            { icon: Network, text: "توسيع شبكة العلاقات والتعاون مع مؤسسات مختلفة." },
        ]
        : [
            { icon: Users, text: "Растущее сообщество зарегистрированных членов." },
            { icon: CalendarDays, text: "Регулярная организация культурных, социальных и спортивных мероприятий." },
            { icon: GraduationCap, text: "Реализация обучающих и просветительских программ для членов общины." },
            { icon: Network, text: "Расширение сети связей и сотрудничества с различными организациями." },
        ];

    const stats = [
        { value: "2019", label: locale === "ar" ? "سنة التأسيس" : "Год основания" },
        { value: "500+", label: locale === "ar" ? "عضو مسجل" : "Участников" },
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
                            ? "تسعى الجالية اليمنية في موسكو إلى خدمة أبنائها وتعزيز روابط الأخوة بينهم، من خلال برامج اجتماعية وثقافية وتعليمية تسهم في دعمهم وحماية مصالحهم."
                            : "Йеменская община в Москве стремится служить своим членам и укреплять братские связи через социальные, культурные и образовательные программы."
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

            {/* ═══════════════════ GOALS ═══════════════════ */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div {...fadeUp} className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-4 border border-blue-200 dark:border-blue-500/20">
                            <Target size={14} />
                            {locale === "ar" ? "أهداف الجالية" : "Цели общины"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                            {locale === "ar" ? "نعمل من أجل مجتمع متماسك وهوية راسخة" : "Работаем ради сплочённого общества и крепкой идентичности"}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            {locale === "ar"
                                ? "تسعى الجالية اليمنية في موسكو إلى خدمة أبناء الجالية وتعزيز روابط الأخوة بينهم، من خلال برامج اجتماعية وثقافية وتعليمية تسهم في دعمهم، وحماية مصالحهم، وتعزيز اندماجهم الإيجابي في المجتمع الروسي مع الحفاظ على الهوية اليمنية."
                                : "Йеменская община в Москве стремится служить членам общины и укреплять братские связи через социальные, культурные и образовательные программы, которые способствуют их поддержке, защите их интересов и позитивной интеграции в российское общество при сохранении йеменской идентичности."
                            }
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
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

            {/* ═══════════════════ SERVICES ═══════════════════ */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div {...fadeUp} className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 rounded-full text-sm font-bold mb-4 border border-violet-200 dark:border-violet-500/20">
                            <Star size={14} />
                            {locale === "ar" ? "خدماتنا" : "Наши услуги"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                            {locale === "ar" ? "خدمات عملية تخدم أفراد الجالية" : "Практические услуги для членов общины"}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            {locale === "ar"
                                ? "تعمل الجالية على تقديم خدمات متنوعة تغطي الجوانب الاجتماعية والثقافية والتعليمية والإرشادية، بما يساعد أبناء الجالية على الاستقرار والنجاح في بيئة الدراسة والعمل داخل روسيا."
                                : "Община предоставляет разнообразные услуги, охватывающие социальные, культурные, образовательные и консультационные аспекты, помогая членам общины в стабильности и успехе в учебной и рабочей среде в России."
                            }
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        {services.map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`p-6 rounded-3xl border ${service.bg} hover:shadow-lg transition-all`}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4`}>
                                    <service.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-sm">
                                    {service.desc}
                                </p>
                                <Link
                                    href={service.href}
                                    className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                                >
                                    {service.btn}
                                    <ArrowRight size={14} className={`text-current ${isRTL ? "rotate-180" : ""}`} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════ ACHIEVEMENTS ═══════════════════ */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <motion.div {...fadeUp} className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full text-sm font-bold mb-4 border border-amber-200 dark:border-amber-500/20">
                            <Trophy size={14} />
                            {locale === "ar" ? "إنجازاتنا" : "Наши достижения"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                            {locale === "ar" ? "محطات نفخر بها" : "Вехи, которыми мы гордимся"}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            {locale === "ar"
                                ? "تمكنت الجالية اليمنية في موسكو من تحقيق إنجازات ملموسة عبر العمل الجماعي والمشاركة الفاعلة، من خلال تنظيم الأنشطة، دعم الطلاب، وتطوير المبادرات التي تعزز حضور المجتمع اليمني وتخدم أفراده."
                                : "Йеменская община в Москве смогла добиться ощутимых достижений благодаря коллективной работе и активному участию: организация мероприятий, поддержка студентов и развитие инициатив, укрепляющих присутствие йеменского сообщества."
                            }
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-5 mt-10">
                        {achievements.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-4 p-5 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-200/50 dark:border-amber-500/10"
                            >
                                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                                    <item.icon size={22} />
                                </div>
                                <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed pt-1">
                                    {item.text}
                                </p>
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
                                ? "كن جزءاً من مجتمعنا وساهم في بناء مستقبل أفضل للجالية اليمنية في موسكو."
                                : "Станьте частью нашего сообщества и помогите строить лучшее будущее для йеменской общины в Москве."
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href={`/${locale}/about`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-colors shadow-lg shadow-yellow-500/20"
                            >
                                {locale === "ar" ? "اكتشف المزيد" : "Узнать больше"}
                                <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                            </Link>
                            <Link
                                href={`/${locale}/donate`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-yellow-400 transition-colors"
                            >
                                <Heart size={18} className="text-rose-500" />
                                {locale === "ar" ? "ادعم أنشطتنا" : "Поддержать"}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
