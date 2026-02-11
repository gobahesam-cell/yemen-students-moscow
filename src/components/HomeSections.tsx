"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Newspaper, Calendar, GraduationCap, ArrowLeft, ArrowRight, Sparkles, Heart } from "lucide-react";

export default function HomeSections() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const features = [
    {
      title: t("f1Title"),
      desc: t("f1Desc"),
      href: `/${locale}/news`,
      actionLabel: locale === "ar" ? "تصفح الأخبار" : "Читать новости",
      icon: Newspaper,
      color: "blue"
    },
    {
      title: t("f2Title"),
      desc: t("f2Desc"),
      href: `/${locale}/events`,
      actionLabel: locale === "ar" ? "انضم للفعاليات" : "Присоединиться",
      icon: Calendar,
      color: "purple"
    },
    {
      title: t("f3Title"),
      desc: t("f3Desc"),
      href: `/${locale}/courses`,
      actionLabel: locale === "ar" ? "ابدأ التعلم" : "Начать обучение",
      icon: GraduationCap,
      color: "green"
    },
  ];

  const stats = [
    { value: "500+", label: locale === "ar" ? "عضو مسجل" : "Участников" },
    { value: "50+", label: locale === "ar" ? "فعالية سنوية" : "Событий в год" },
    { value: "20+", label: locale === "ar" ? "شراكة" : "Партнеров" },
    { value: "10", label: locale === "ar" ? "سنوات عطاء" : "Лет работы" },
  ];

  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20",
    purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20",
    green: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-500/20",
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-24 py-10 container mx-auto px-4 max-w-7xl">

      {/* Features Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            {locale === "ar" ? "خدماتنا" : "Сервисы"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t("featuresTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {locale === "ar"
              ? "نقدم مجموعة من الخدمات والأنشطة لدعم الطلاب اليمنيين في موسكو"
              : "Мы предлагаем ряд услуг и мероприятий для поддержки йеменских студентов"
            }
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -8 }}
                className="group bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-yellow-300 dark:hover:border-yellow-500/30 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorClasses[f.color as keyof typeof colorClasses]}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {f.desc}
                </p>
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:gap-3 transition-all"
                >
                  {f.actionLabel}
                  <Arrow size={16} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden px-8 py-20 md:px-16"
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <div className={`text-center lg:${isRTL ? "text-right" : "text-left"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-yellow-300 text-sm font-medium mb-6">
              <Sparkles size={14} />
              {locale === "ar" ? "إنجازاتنا" : "Наши достижения"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t("statsTitle")}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md mb-8">
              {locale === "ar"
                ? "نفتخر بما حققناه خلال السنوات الماضية من إنجازات وتوسع في خدمة المجتمع الطلابي"
                : "Мы гордимся нашими достижениями за прошедшие годы в служении студенческому сообществу"
              }
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition-colors shadow-lg shadow-yellow-500/20"
              >
                {locale === "ar" ? "اقرأ المزيد" : "Подробнее"}
                <Arrow size={18} />
              </Link>
              <Link
                href={`/${locale}/donate`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors border border-white/10"
              >
                <Heart size={18} className="text-red-400" />
                {locale === "ar" ? "ادعم الجالية" : "Поддержать"}
              </Link>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</div>
                <div className="text-sm font-medium text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-16 px-8 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-500/5 dark:via-amber-500/5 dark:to-orange-500/5 rounded-3xl border border-yellow-100 dark:border-yellow-500/10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {locale === "ar" ? "هل لديك استفسار؟" : "Есть вопросы?"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
          {locale === "ar"
            ? "تواصل معنا وسنرد عليك في أقرب وقت ممكن"
            : "Свяжитесь с нами, и мы ответим как можно скорее"
          }
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-xl"
        >
          {locale === "ar" ? "تواصل معنا" : "Связаться с нами"}
          <Arrow size={18} />
        </Link>
      </motion.section>
    </div>
  );
}