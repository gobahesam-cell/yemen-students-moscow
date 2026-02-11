import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Certificate from "@/components/course/Certificate";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";

interface Props {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function CertificatePage({ params }: Props) {
    const { locale, slug } = await params;

    // Get session
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);

    if (!session?.userId) {
        redirect(`/${locale}/login?redirect=/${locale}/courses/${slug}/certificate`);
    }

    // Get user info
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true },
    });

    if (!user) {
        redirect(`/${locale}/login?redirect=/${locale}/courses/${slug}/certificate`);
    }

    // Get course with quizzes
    const course = await prisma.course.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            titleRu: true,
            units: {
                include: {
                    quiz: true,
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id,
            },
        },
    });

    // Check if course is completed (100% progress)
    if (!enrollment || enrollment.progress < 100) {
        redirect(`/${locale}/courses/${slug}?error=not_completed`);
    }

    // Check all quizzes are passed (if any)
    const quizIds = course.units.filter(u => u.quiz).map(u => u.quiz!.id);

    if (quizIds.length > 0) {
        const passedQuizzes = await prisma.quizAttempt.count({
            where: {
                userId: user.id,
                quizId: { in: quizIds },
                passed: true,
            },
        });

        if (passedQuizzes < quizIds.length) {
            redirect(`/${locale}/courses/${slug}?error=quizzes_not_passed`);
        }
    }

    const courseName = locale === "ar" ? course.title : (course.titleRu || course.title);
    const studentName = user.name || user.email.split("@")[0];
    const completedAt = enrollment.completedAt || new Date();

    return (
        <Certificate
            studentName={studentName}
            courseName={courseName}
            completedAt={completedAt}
            locale={locale as "ar" | "ru"}
        />
    );
}
