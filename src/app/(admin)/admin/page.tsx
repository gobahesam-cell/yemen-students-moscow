import { getAdminStats, getRecentActivity } from "@/lib/admin-data";
import { WelcomeBanner } from "@/components/admin/WelcomeBanner";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { ChartsSection } from "@/components/admin/ChartsSection";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decodeSession(sessionToken);
  const userRole = session?.role || "MEMBER";
  const t = await getTranslations("Admin");

  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getRecentActivity()
  ]);

  // فلترة الإحصائيات حسب الدور
  const filteredStats = { ...stats };

  // EDITOR يرى فقط الأخبار والفعاليات
  if (userRole === "EDITOR") {
    filteredStats.usersCount = 0;
    filteredStats.studentsCount = 0;
    filteredStats.coursesCount = 0;
  }

  // INSTRUCTOR يرى فقط الكورسات والطلاب
  if (userRole === "INSTRUCTOR") {
    filteredStats.publishedCount = 0;
    filteredStats.draftsCount = 0;
    filteredStats.pinnedCount = 0;
    filteredStats.usersCount = 0;
  }

  // فلترة النشاط الأخير حسب الدور
  const filteredActivity = { ...activity };

  if (userRole === "EDITOR") {
    filteredActivity.latestUsers = []; // لا يرى المستخدمين الجدد
  }

  if (userRole === "INSTRUCTOR") {
    filteredActivity.latestPosts = []; // لا يرى الأخبار
    filteredActivity.latestUsers = []; // لا يرى المستخدمين
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner
        draftsCount={userRole === "INSTRUCTOR" ? 0 : stats.draftsCount}
        userName={session?.name || undefined}
        role={session?.role}
      />

      <StatsGrid stats={filteredStats} userRole={userRole} />

      {/* الرسوم البيانية فقط للأدمن والمحرر */}
      {(userRole === "ADMIN" || userRole === "EDITOR") && (
        <ChartsSection stats={filteredStats} />
      )}

      {/* النشاط الأخير حسب الدور */}
      {(userRole === "ADMIN" || userRole === "EDITOR") && (
        <RecentActivity
          latestPosts={filteredActivity.latestPosts}
          latestUsers={userRole === "ADMIN" ? filteredActivity.latestUsers : []}
        />
      )}

      {/* رسالة للـ INSTRUCTOR */}
      {userRole === "INSTRUCTOR" && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            {t("instructor.welcomeTitle")}
          </h3>
          <p className="text-emerald-600 dark:text-emerald-300 text-sm">
            {t("instructor.welcomeDesc")}
          </p>
        </div>
      )}
    </div>
  );
}

