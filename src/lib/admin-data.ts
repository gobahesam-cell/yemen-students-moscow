import { prisma } from "@/lib/db";

export async function getAdminStats() {
    const [usersCount, publishedCount, draftsCount, pinnedCount, studentsCount, coursesCount] = await Promise.all([
        prisma.user.count(),
        prisma.post.count({ where: { isDraft: false } }),
        prisma.post.count({ where: { isDraft: true } }),
        prisma.post.count({ where: { isPinned: true } }),
        prisma.courseEnrollment.count(), // عدد الطلاب المسجلين
        prisma.course.count({ where: { isPublished: true } }), // عدد الدورات المنشورة
    ]);

    return {
        usersCount,
        publishedCount,
        draftsCount,
        pinnedCount,
        studentsCount,
        coursesCount,
    };
}


export async function getRecentActivity() {
    const [latestPosts, latestUsers] = await Promise.all([
        prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                title: true,
                isDraft: true,
                isPinned: true,
                createdAt: true,
            },
        }),
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
    ]);

    return { latestPosts, latestUsers };
}
