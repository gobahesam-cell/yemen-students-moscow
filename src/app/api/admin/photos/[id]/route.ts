import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";
import cloudinary from "@/lib/cloudinary";

// استخراج public_id من رابط Cloudinary
function getCloudinaryPublicId(url: string): string | null {
    if (!url.includes("cloudinary.com")) return null;

    // مثال: https://res.cloudinary.com/xxx/image/upload/v123456789/yemen_students/gallery/abc123.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
}

// تعديل صورة (الموافقة، التعليق)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !["ADMIN", "EDITOR"].includes(session.role)) {
            return NextResponse.json(
                { error: "غير مصرح" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { caption, isApproved, albumId } = body;

        const updateData: Record<string, unknown> = {};

        if (caption !== undefined) updateData.caption = caption;
        if (isApproved !== undefined) updateData.isApproved = isApproved;
        if (albumId !== undefined) updateData.albumId = albumId;

        const photo = await prisma.photo.update({
            where: { id },
            data: updateData,
            include: {
                album: {
                    select: {
                        id: true,
                        titleAr: true,
                    },
                },
                uploader: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(photo);
    } catch (error) {
        console.error("Error updating photo:", error);
        return NextResponse.json(
            { error: "فشل في تعديل الصورة" },
            { status: 500 }
        );
    }
}

// حذف صورة
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !["ADMIN", "EDITOR"].includes(session.role)) {
            return NextResponse.json(
                { error: "غير مصرح" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // جلب الصورة لمعرفة رابطها
        const photo = await prisma.photo.findUnique({
            where: { id },
        });

        if (!photo) {
            return NextResponse.json(
                { error: "الصورة غير موجودة" },
                { status: 404 }
            );
        }

        // حذف من Cloudinary
        const publicId = getCloudinaryPublicId(photo.url);
        if (publicId) {
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.log("Cloudinary delete error (continuing anyway):", err);
            }
        }

        // حذف السجل من قاعدة البيانات
        await prisma.photo.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting photo:", error);
        return NextResponse.json(
            { error: "فشل في حذف الصورة" },
            { status: 500 }
        );
    }
}
