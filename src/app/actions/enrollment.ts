"use server";

import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// التسجيل في الدورة
export async function enrollInCourseAction(courseId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { error: "يجب تسجيل الدخول أولاً", requiresLogin: true };
        }

        // التحقق من عدم التسجيل مسبقاً
        const existing = await prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.userId,
                    courseId,
                },
            },
        });

        if (existing) {
            return { success: true, alreadyEnrolled: true };
        }

        // إنشاء تسجيل جديد
        await prisma.courseEnrollment.create({
            data: {
                userId: session.userId,
                courseId,
            },
        });

        revalidatePath("/[locale]/courses/[slug]", "page");
        return { success: true };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: "فشل التسجيل في الدورة" };
    }
}

// تحديث التقدم في الدرس
export async function updateLessonProgressAction(
    lessonId: string,
    completed: boolean,
    watchTime?: number
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { error: "غير مصرح" };
        }

        // تحديث أو إنشاء تقدم الدرس
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.userId,
                    lessonId,
                },
            },
            update: {
                completed,
                watchTime: watchTime || undefined,
                completedAt: completed ? new Date() : null,
            },
            create: {
                userId: session.userId,
                lessonId,
                completed,
                watchTime: watchTime || null,
                completedAt: completed ? new Date() : null,
            },
        });

        // جلب الدرس لمعرفة الدورة وحساب التقدم الكلي
        const lesson = await prisma.courseLesson.findUnique({
            where: { id: lessonId },
            include: {
                unit: {
                    include: {
                        course: {
                            include: {
                                units: {
                                    include: {
                                        lessons: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (lesson) {
            const courseId = lesson.unit.courseId;
            const allLessons = lesson.unit.course.units.flatMap((u) => u.lessons);
            const totalLessons = allLessons.length;

            // حساب الدروس المكتملة
            const completedLessons = await prisma.lessonProgress.count({
                where: {
                    userId: session.userId,
                    lessonId: { in: allLessons.map((l) => l.id) },
                    completed: true,
                },
            });

            // جلب جميع الاختبارات في الدورة
            const courseWithQuizzes = await prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    units: {
                        include: {
                            quiz: true,
                        },
                    },
                },
            });

            const quizzes = courseWithQuizzes?.units.filter(u => u.quiz).map(u => u.quiz!) || [];
            const totalQuizzes = quizzes.length;

            // حساب الاختبارات المجتازة
            let passedQuizzes = 0;
            if (totalQuizzes > 0) {
                passedQuizzes = await prisma.quizAttempt.count({
                    where: {
                        userId: session.userId,
                        quizId: { in: quizzes.map(q => q.id) },
                        passed: true,
                    },
                });
            }

            // احتساب التقدم الإجمالي: الدروس + الاختبارات
            const totalItems = totalLessons + totalQuizzes;
            const completedItems = completedLessons + passedQuizzes;
            const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            // تحديث تسجيل الدورة
            await prisma.courseEnrollment.update({
                where: {
                    userId_courseId: {
                        userId: session.userId,
                        courseId,
                    },
                },
                data: {
                    progress,
                    currentLessonId: lessonId,
                    lastAccessedAt: new Date(),
                    completedAt: progress === 100 ? new Date() : null,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Update progress error:", error);
        return { error: "فشل تحديث التقدم" };
    }
}

// جلب الدورات المسجل فيها المستخدم
export async function getMyCoursesAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { error: "غير مصرح", courses: [] };
        }

        const enrollments = await prisma.courseEnrollment.findMany({
            where: { userId: session.userId },
            include: {
                course: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        titleRu: true,
                        thumbnail: true,
                        units: {
                            select: {
                                _count: {
                                    select: { lessons: true },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { lastAccessedAt: "desc" },
        });

        const courses = enrollments.map((e) => ({
            id: e.course.id,
            slug: e.course.slug,
            title: e.course.title,
            titleRu: e.course.titleRu,
            thumbnail: e.course.thumbnail,
            progress: e.progress,
            currentLessonId: e.currentLessonId,
            enrolledAt: e.enrolledAt.toISOString(),
            totalLessons: e.course.units.reduce((acc, u) => acc + u._count.lessons, 0),
        }));

        return { success: true, courses };
    } catch (error) {
        console.error("Get my courses error:", error);
        return { error: "فشل جلب الدورات", courses: [] };
    }
}

// جلب حالة التسجيل والتقدم
export async function getCourseProgressAction(courseId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { isEnrolled: false, progress: 0, completedLessons: [] };
        }

        const enrollment = await prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.userId,
                    courseId,
                },
            },
        });

        if (!enrollment) {
            return { isEnrolled: false, progress: 0, completedLessons: [] };
        }

        // جلب الدروس المكتملة
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                units: {
                    include: {
                        lessons: true,
                    },
                },
            },
        });

        if (!course) {
            return { isEnrolled: true, progress: enrollment.progress, completedLessons: [] };
        }

        const allLessonIds = course.units.flatMap((u) => u.lessons.map((l) => l.id));

        const completedProgress = await prisma.lessonProgress.findMany({
            where: {
                userId: session.userId,
                lessonId: { in: allLessonIds },
                completed: true,
            },
            select: { lessonId: true },
        });

        return {
            isEnrolled: true,
            progress: enrollment.progress,
            currentLessonId: enrollment.currentLessonId,
            completedLessons: completedProgress.map((p) => p.lessonId),
        };
    } catch (error) {
        console.error("Get course progress error:", error);
        return { isEnrolled: false, progress: 0, completedLessons: [] };
    }
}

// إعادة حساب تقدم الدورة (تُستدعى بعد اجتياز الاختبار)
export async function recalculateCourseProgress(courseId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { error: "غير مصرح" };
        }

        // جلب بيانات الدورة
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                units: {
                    include: {
                        lessons: true,
                        quiz: true,
                    },
                },
            },
        });

        if (!course) {
            return { error: "الدورة غير موجودة" };
        }

        const allLessons = course.units.flatMap((u) => u.lessons);
        const totalLessons = allLessons.length;

        // حساب الدروس المكتملة
        const completedLessons = await prisma.lessonProgress.count({
            where: {
                userId: session.userId,
                lessonId: { in: allLessons.map((l) => l.id) },
                completed: true,
            },
        });

        // جلب وحساب الاختبارات
        const quizzes = course.units.filter(u => u.quiz).map(u => u.quiz!);
        const totalQuizzes = quizzes.length;

        let passedQuizzes = 0;
        if (totalQuizzes > 0) {
            passedQuizzes = await prisma.quizAttempt.count({
                where: {
                    userId: session.userId,
                    quizId: { in: quizzes.map(q => q.id) },
                    passed: true,
                },
            });
        }

        // احتساب التقدم الإجمالي: الدروس + الاختبارات
        const totalItems = totalLessons + totalQuizzes;
        const completedItems = completedLessons + passedQuizzes;
        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        // تحديث تسجيل الدورة
        await prisma.courseEnrollment.update({
            where: {
                userId_courseId: {
                    userId: session.userId,
                    courseId,
                },
            },
            data: {
                progress,
                completedAt: progress === 100 ? new Date() : null,
            },
        });

        revalidatePath("/[locale]/courses/[slug]", "page");
        return { success: true, progress, completed: progress === 100 };
    } catch (error) {
        console.error("Recalculate progress error:", error);
        return { error: "فشل إعادة حساب التقدم" };
    }
}

// حفظ محاولة الاختبار وإعادة حساب التقدم
export async function saveQuizAttemptAction(
    quizId: string,
    courseId: string,
    score: number,
    passed: boolean
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !session.userId) {
            return { error: "غير مصرح" };
        }

        // حفظ محاولة الاختبار
        await prisma.quizAttempt.create({
            data: {
                userId: session.userId,
                quizId,
                score,
                passed,
            },
        });

        // إعادة حساب تقدم الدورة
        const result = await recalculateCourseProgress(courseId);

        revalidatePath("/[locale]/courses/[slug]", "page");

        return {
            success: true,
            progress: result.success ? result.progress : undefined,
            courseCompleted: result.success ? result.completed : false
        };
    } catch (error) {
        console.error("Save quiz attempt error:", error);
        return { error: "فشل حفظ نتيجة الاختبار" };
    }
}


