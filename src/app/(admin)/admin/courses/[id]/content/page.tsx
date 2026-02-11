import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseContentManager from "./CourseContentManager";
import { getTranslations } from "next-intl/server";

interface ContentPageProps {
    params: Promise<{ id: string }>;
}

export default async function CourseContentPage({ params }: ContentPageProps) {
    const { id } = await params;
    const t = await getTranslations("Admin.courseContent");

    const course = await prisma.course.findUnique({
        where: { id },
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
        },
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/courses"
                    className="p-3 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-colors text-slate-500"
                >
                    <ArrowRight size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                        {t("pageTitle", { name: course.title })}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {t("pageDesc")}
                    </p>
                </div>
            </div>

            <CourseContentManager course={course} />
        </div>
    );
}
