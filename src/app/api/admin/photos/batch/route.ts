import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";
import cloudinary from "@/lib/cloudinary";

// استخراج public_id من رابط Cloudinary
function getCloudinaryPublicId(url: string): string | null {
    if (!url.includes("cloudinary.com")) return null;

    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
}

// عمليات جماعية على الصور
export async function PATCH(request: Request) {
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

        const body = await request.json();
        const { ids, action } = body; // action: "approve" | "reject" | "delete"

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "يجب تحديد صور" },
                { status: 400 }
            );
        }

        if (action === "approve") {
            await prisma.photo.updateMany({
                where: { id: { in: ids } },
                data: { isApproved: true },
            });
        } else if (action === "reject" || action === "delete") {
            // جلب الصور لحذفها من Cloudinary
            const photos = await prisma.photo.findMany({
                where: { id: { in: ids } },
            });

            // حذف من Cloudinary
            for (const photo of photos) {
                const publicId = getCloudinaryPublicId(photo.url);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.log("Cloudinary delete error:", err);
                    }
                }
            }

            // حذف السجلات
            await prisma.photo.deleteMany({
                where: { id: { in: ids } },
            });
        }

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        console.error("Error batch action:", error);
        return NextResponse.json(
            { error: "فشل في تنفيذ العملية" },
            { status: 500 }
        );
    }
}
