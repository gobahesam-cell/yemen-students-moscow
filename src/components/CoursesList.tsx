"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, Clock, Users, Play, GraduationCap,
  Star, Sparkles, ChevronRight, Filter, Grid, List,
  TrendingUp, Award, Zap, ArrowUpRight
} from "lucide-react";

type CourseItem = {
  slug: string;
  title: string;
  desc: string;
  thumbnail?: string | null;
  lessons: number;
  duration?: number;
  students?: number;
};

export default function CoursesList({ items }: { items: CourseItem[] }) {
  const t = useTranslations("Courses");
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let result = query
      ? items.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.desc.toLowerCase().includes(query)
      )
      : items;

    // Sort
    if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.students || 0) - (a.students || 0));
    }

    return result;
  }, [q, items, sortBy]);

  const isRTL = locale === "ar";

  const stats = [
    {
      icon: BookOpen,
      value: items.length,
      label: locale === "ar" ? "دورة متاحة" : "курсов",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      value: items.reduce((acc, c) => acc + (c.students || 0), 0),
      label: locale === "ar" ? "طالب مسجل" : "студентов",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Award,
      value: "100%",
      label: locale === "ar" ? "مجانية" : "бесплатно",
      color: "from-amber-500 to-orange-500"
    },
  ];

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#d4af37]/10 to-amber-500/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-purple-500/5 rounded-full blur-[120px]"
        />
      </div>

      <div className="space-y-10">
        {/* Mini Stats Strip */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search & Filters Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3">
              <Search size={20} className="text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent text-base font-medium outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "popular")}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="newest">{locale === "ar" ? "الأحدث" : "Новые"}</option>
                <option value="popular">{locale === "ar" ? "الأكثر شعبية" : "Популярные"}</option>
              </select>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                      ? "bg-[#d4af37] text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === "list"
                      ? "bg-[#d4af37] text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Results Count */}
              <div className="px-4 py-3 bg-[#d4af37]/10 rounded-xl">
                <span className="text-sm font-black text-[#d4af37]">
                  {filtered.length} {locale === "ar" ? "دورة" : "курсов"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6"
              >
                <GraduationCap size={48} className="text-slate-400 dark:text-slate-500" />
              </motion.div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                {locale === "ar" ? "لا توجد نتائج" : "Ничего не найдено"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {locale === "ar"
                  ? "جرب البحث بكلمات مختلفة"
                  : "Попробуйте изменить параметры поиска"}
              </p>
              <button
                onClick={() => setQ("")}
                className="px-6 py-3 bg-[#d4af37] text-slate-900 font-bold rounded-xl hover:bg-[#c9a430] transition-colors"
              >
                {locale === "ar" ? "عرض جميع الدورات" : "Показать все курсы"}
              </button>
            </motion.div>
          ) : (
            /* Courses Grid/List */
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === "grid"
                  ? "grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-6"
              }
            >
              {filtered.map((course, idx) => (
                <motion.div
                  key={course.slug}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  layout
                >
                  {viewMode === "grid" ? (
                    /* Grid Card */
                    <Link
                      href={`/${locale}/courses/${course.slug}`}
                      className="group block h-full"
                    >
                      <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-slate-900/50 transition-all duration-500 hover:-translate-y-2 hover:border-[#d4af37]/50">
                        {/* Thumbnail */}
                        <div className="relative h-52 bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                  className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-[#d4af37]/40 to-amber-500/20 rounded-full blur-2xl"
                                />
                                <GraduationCap size={64} className="text-[#d4af37] relative z-10" />
                              </div>
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center shadow-2xl shadow-[#d4af37]/50"
                            >
                              <Play size={24} className="text-slate-900 ml-1" fill="currentColor" />
                            </motion.div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37] rounded-full text-xs font-black text-slate-900">
                              <Sparkles size={12} />
                              {locale === "ar" ? "مميز" : "ТОП"}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900">
                              <BookOpen size={12} className="text-[#d4af37]" />
                              {course.lessons} {locale === "ar" ? "درس" : "уроков"}
                            </div>
                          </div>

                          {/* Bottom Info */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between">
                              {course.students !== undefined && (
                                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                                  <Users size={14} />
                                  <span className="font-bold">{course.students}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-[#d4af37]">
                                <Star size={14} fill="currentColor" />
                                <span className="font-bold text-white">4.9</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="font-black text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 leading-relaxed">
                            {course.desc}
                          </p>

                          {/* CTA */}
                          <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full">
                              <Zap size={12} />
                              {locale === "ar" ? "مجاني" : "Бесплатно"}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-bold text-[#d4af37] group-hover:gap-3 transition-all">
                              {locale === "ar" ? "ابدأ الآن" : "Начать"}
                              <ArrowUpRight size={18} className={isRTL ? "rotate-[-90deg]" : ""} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    /* List Card */
                    <Link
                      href={`/${locale}/courses/${course.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl hover:border-[#d4af37]/50 transition-all duration-300 p-4">
                        {/* Thumbnail */}
                        <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                              <GraduationCap size={40} className="text-[#d4af37]" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded">
                              {locale === "ar" ? "مميز" : "ТОП"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {course.lessons} {locale === "ar" ? "درس" : "уроков"}
                            </span>
                          </div>
                          <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                            {course.desc}
                          </p>
                        </div>

                        {/* Action */}
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center group-hover:bg-[#d4af37] transition-colors">
                            <ChevronRight size={20} className={`text-[#d4af37] group-hover:text-slate-900 ${isRTL ? "rotate-180" : ""}`} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured CTA */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#d4af37]/10 to-amber-500/10 rounded-full border border-[#d4af37]/20">
              <TrendingUp size={18} className="text-[#d4af37]" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {locale === "ar"
                  ? "انضم لأكثر من " + items.reduce((acc, c) => acc + (c.students || 0), 0) + " طالب يتعلمون معنا"
                  : "Присоединяйтесь к " + items.reduce((acc, c) => acc + (c.students || 0), 0) + " студентам"}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}