import PageHeader from "@/components/PageHeader";
import CoursesList from "@/components/CoursesList";
import { getLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ru" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });

  return buildMetadata({
    locale,
    path: "/courses",
    title: t("coursesTitle"),
    description: t("coursesDesc"),
  });
}

import { prisma } from "@/lib/db";

export default async function CoursesPage() {
  const tPages = await getTranslations("Pages");
  const locale = await getLocale();

  // جلب الدورات مع الوحدات والدروس وعدد الطلاب
  const coursesRaw = await prisma.course.findMany({
    include: {
      units: {
        include: {
          _count: {
            select: { lessons: true }
          }
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const items = coursesRaw.map(c => {
    const totalLessons = c.units.reduce((acc, u) => acc + u._count.lessons, 0);
    return {
      slug: c.slug,
      title: locale === "ar" ? c.title : (c.titleRu || c.title),
      desc: locale === "ar" ? c.description : (c.descriptionRu || c.description),
      thumbnail: c.thumbnail,
      lessons: totalLessons,
      students: c._count.enrollments
    };
  });

  return (
    <>
      <PageHeader title={tPages("coursesTitle")} description={tPages("coursesDesc")} />
      <CoursesList items={items} />
    </>
  );
}