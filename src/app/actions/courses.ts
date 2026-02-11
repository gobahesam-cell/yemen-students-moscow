"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function upsertCourseAction(data: {
    id?: string;
    slug: string;
    title: string;
    titleRu?: string;
    description: string;
    descriptionRu?: string;
    thumbnail?: string;
}) {
    try {
        if (data.id) {
            await prisma.course.update({
                where: { id: data.id },
                data: {
                    slug: data.slug,
                    title: data.title,
                    titleRu: data.titleRu,
                    description: data.description,
                    descriptionRu: data.descriptionRu,
                    thumbnail: data.thumbnail,
                },
            });
        } else {
            await prisma.course.create({
                data: {
                    slug: data.slug,
                    title: data.title,
                    titleRu: data.titleRu,
                    description: data.description,
                    descriptionRu: data.descriptionRu,
                    thumbnail: data.thumbnail,
                },
            });
        }

        revalidatePath("/admin/courses");
        revalidatePath("/[locale]/courses", "layout");
        return { success: true };
    } catch (error: any) {
        console.error("Course Action Error:", error);
        return { success: false, error: error.message || "خطأ في حفظ الدورة" };
    }
}

export async function deleteCourseAction(id: string) {
    try {
        await prisma.course.delete({
            where: { id },
        });

        revalidatePath("/admin/courses");
        revalidatePath("/[locale]/courses", "layout");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Course Error:", error);
        return { success: false, error: "خطأ في حذف الدورة" };
    }
}

export async function upsertMaterialAction(data: {
    id?: string;
    courseId: string;
    title: string;
    titleRu?: string;
    type: string;
    url: string;
}) {
    try {
        if (data.id) {
            await prisma.courseMaterial.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    titleRu: data.titleRu,
                    type: data.type,
                    url: data.url,
                }
            });
        } else {
            await prisma.courseMaterial.create({
                data: {
                    courseId: data.courseId,
                    title: data.title,
                    titleRu: data.titleRu,
                    type: data.type,
                    url: data.url,
                }
            });
        }

        revalidatePath(`/admin/courses/${data.courseId}/materials`);
        revalidatePath(`/[locale]/courses/${data.courseId}`, "page"); // Revalidate detail page
        return { success: true };
    } catch (error: any) {
        console.error("Material Action Error:", error);
        return { success: false, error: "خطأ في حفظ المادة التعليمية" };
    }
}

export async function deleteMaterialAction(id: string, courseId: string) {
    try {
        await prisma.courseMaterial.delete({
            where: { id }
        });

        revalidatePath(`/admin/courses/${courseId}/materials`);
        revalidatePath(`/[locale]/courses/${courseId}`, "page");
        return { success: true };
    } catch (error: any) {
        console.error("Delete Material Error:", error);
        return { success: false, error: "خطأ في حذف المادة" };
    }
}
