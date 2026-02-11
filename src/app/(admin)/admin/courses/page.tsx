import { GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CourseCard } from "@/components/admin/CourseCard";
import { getTranslations, getLocale } from "next-intl/server";

export default async function AdminCoursesPage() {
  const locale = await getLocale();
  const t = await getTranslations("Admin.courses");
  const isRTL = locale === "ar";

  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: {
          _count: {
            select: { lessons: true }
          }
        }
      },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);
  const totalLessons = courses.reduce((acc, c) =>
    acc + c.units.reduce((uAcc, u) => uAcc + u._count.lessons, 0), 0
  );

  return (
    <div className="space-y-8 pb-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-3xl p-8 lg:p-10 border border-slate-700/50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] translate-y-1/3" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-amber-500/20 backdrop-blur rounded-full text-xs font-bold text-amber-400">
                {t("badge")}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">
              {t("title")}
            </h1>
            <p className="text-slate-400 text-base">
              {t("description")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-center min-w-[90px]">
              <div className="text-2xl font-black text-white">{courses.length}</div>
              <div className="text-xs text-slate-400 font-medium">{t("course")}</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-center min-w-[90px]">
              <div className="text-2xl font-black text-amber-400">{totalLessons}</div>
              <div className="text-xs text-slate-400 font-medium">{t("lessons")}</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-center min-w-[90px]">
              <div className="text-2xl font-black text-emerald-400">{totalStudents}</div>
              <div className="text-xs text-slate-400 font-medium">{t("students")}</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 hover:shadow-xl hover:bg-amber-400 active:scale-95"
          >
            <Plus size={20} />
            <span>{t("addNew")}</span>
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center py-20">
          <div className="inline-flex p-8 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
            <GraduationCap size={64} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">{t("empty")}</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">{t("emptyDesc")}</p>
          <Link
            href="/admin/courses/new"
            className="text-amber-500 font-bold hover:underline"
          >
            {t("clickToAdd")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
