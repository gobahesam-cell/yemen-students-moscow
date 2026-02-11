import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";
import { getCourseProgressAction } from "@/app/actions/enrollment";
import CoursePageClient from "./CoursePageClient";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("Courses");

  // جلب الدورة مع الوحدات والدروس
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
          quiz: {
            include: {
              questions: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      enrollments: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // التحقق من تسجيل الدخول
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await decodeSession(token);
  const isLoggedIn = !!session?.userId;

  // جلب حالة التسجيل والتقدم
  let enrollmentStatus = {
    isEnrolled: false,
    progress: 0,
    currentLessonId: null as string | null,
    completedLessons: [] as string[],
  };

  if (isLoggedIn) {
    const progressData = await getCourseProgressAction(course.id);
    enrollmentStatus = {
      isEnrolled: progressData.isEnrolled,
      progress: progressData.progress,
      currentLessonId: progressData.currentLessonId || null,
      completedLessons: progressData.completedLessons || [],
    };
  }

  // حساب إحصائيات الدورة
  const totalLessons = course.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const totalDuration = course.units.reduce(
    (acc, unit) => acc + unit.lessons.reduce((lAcc, l) => lAcc + (l.duration || 0), 0),
    0
  );
  const studentCount = course.enrollments.length;

  return (
    <CoursePageClient
      course={{
        id: course.id,
        slug: course.slug,
        title: course.title,
        titleRu: course.titleRu,
        description: course.description,
        descriptionRu: course.descriptionRu,
        thumbnail: course.thumbnail,
        units: course.units.map((unit) => ({
          id: unit.id,
          title: unit.title,
          titleRu: unit.titleRu,
          order: unit.order,
          hasQuiz: !!unit.quiz,
          quiz: unit.quiz ? {
            id: unit.quiz.id,
            title: unit.quiz.title,
            titleRu: unit.quiz.titleRu,
            passingScore: unit.quiz.passingScore,
            questions: unit.quiz.questions.map((q) => ({
              id: q.id,
              question: q.question,
              questionRu: q.questionRu,
              options: q.options,
              optionsRu: q.optionsRu,
              correctIndex: q.correctIndex,
            })),
          } : null,
          lessons: unit.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            titleRu: lesson.titleRu,
            description: lesson.description,
            descriptionRu: lesson.descriptionRu,
            type: lesson.type,
            videoUrl: lesson.videoUrl,
            pdfUrl: lesson.pdfUrl,
            content: lesson.content,
            duration: lesson.duration,
            isFree: lesson.isFree,
            completed: enrollmentStatus.completedLessons.includes(lesson.id),
          })),
        })),
      }}
      stats={{
        totalLessons,
        totalDuration,
        studentCount,
      }}
      enrollment={{
        isLoggedIn,
        isEnrolled: enrollmentStatus.isEnrolled,
        progress: enrollmentStatus.progress,
        currentLessonId: enrollmentStatus.currentLessonId,
      }}
      locale={locale}
    />
  );
}