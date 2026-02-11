import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import MaterialsListClient from "./MaterialsListClient";
import { getTranslations } from "next-intl/server";

interface MaterialsPageProps {
    params: Promise<{ id: string }>;
}

export default async function CourseMaterialsPage({ params }: MaterialsPageProps) {
    const { id } = await params;
    const t = await getTranslations("Admin.courseMaterials");

    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            materials: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!course) {
        notFound();
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/courses"
                        className="p-3 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-colors text-slate-500"
                    >
                        <ArrowRight size={24} />
                    </Link>
                    <AdminPageHeader
                        title={t("pageTitle", { name: course.title })}
                        description={t("pageDesc")}
                    />
                </div>
            </div>

            <MaterialsListClient courseId={id} initialMaterials={course.materials} />
        </div>
    );
}
