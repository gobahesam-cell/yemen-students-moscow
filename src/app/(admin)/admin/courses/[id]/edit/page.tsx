import CourseForm from "@/components/admin/CourseForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface EditCoursePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
    const { id } = await params;
    const t = await getTranslations("Admin.courseForm");

    const course = await prisma.course.findUnique({
        where: { id }
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title={t("editCourseTitle")}
                description={t("editCourseDesc", { name: course.title })}
            />
            <CourseForm initialData={course} />
        </div>
    );
}
