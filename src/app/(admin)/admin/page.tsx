import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";
import { getTranslations } from "next-intl/server";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decodeSession(sessionToken);
  const userRole = session?.role || "MEMBER";
  const t = await getTranslations("Admin");

  // جلب البيانات بأقل عدد استعلامات
  const [usersCount, publishedCount, draftsCount, studentsCount, coursesCount, eventsCount, latestPosts, latestUsers] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { isDraft: false } }),
    prisma.post.count({ where: { isDraft: true } }),
    prisma.courseEnrollment.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.event.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, isDraft: true, createdAt: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  return (
    <AdminDashboardClient
      userName={session?.name || undefined}
      userRole={userRole}
      stats={{ usersCount, publishedCount, draftsCount, studentsCount, coursesCount, eventsCount }}
      latestPosts={latestPosts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() }))}
      latestUsers={latestUsers.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))}
    />
  );
}
