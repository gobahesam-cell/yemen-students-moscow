import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import StudentsManagementClient from "./StudentsManagementClient";
import { getTranslations } from "next-intl/server";

export default async function CourseStudentsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: courseId } = await params;
    const t = await getTranslations("Admin.courseStudents");

    // جلب الدورة مع الطلاب المسجلين
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            enrollments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
                orderBy: { enrolledAt: "desc" },
            },
            units: {
                include: {
                    lessons: true,
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    const totalLessons = course.units.reduce((acc, unit) => acc + unit.lessons.length, 0);

    return (
        <StudentsManagementClient
            course={{
                id: course.id,
                title: course.title,
                titleRu: course.titleRu,
                totalLessons,
            }}
            enrollments={course.enrollments.map((e) => ({
                id: e.id,
                progress: e.progress,
                enrolledAt: e.enrolledAt.toISOString(),
                lastAccessedAt: e.lastAccessedAt.toISOString(),
                completedAt: e.completedAt?.toISOString() || null,
                user: {
                    id: e.user.id,
                    name: e.user.name || t("noName"),
                    email: e.user.email,
                    image: e.user.image,
                },
            }))}
        />
    );
}
