import CourseForm from "@/components/admin/CourseForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getTranslations } from "next-intl/server";

export default async function NewCoursePage() {
    const t = await getTranslations("Admin.courseForm");
    return (
        <div className="space-y-8">
            <AdminPageHeader
                title={t("newCourseTitle")}
                description={t("newCourseDesc")}
            />
            <CourseForm />
        </div>
    );
}
