import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST — رفع صورة إلى Cloudinary (موحّد لجميع الصفحات)
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || !["ADMIN", "EDITOR"].includes(session.role)) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "yemen_students/general";

        if (!file) {
            return NextResponse.json({ error: "الملف مطلوب" }, { status: 400 });
        }

        // التحقق من نوع الملف
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "نوع الملف غير مدعوم. الصيغ المدعومة: JPEG, PNG, WebP, GIF" },
                { status: 400 }
            );
        }

        // التحقق من حجم الملف (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "حجم الملف يجب أن لا يتجاوز 10MB" },
                { status: 400 }
            );
        }

        // تحويل الملف إلى base64 data URI
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        // رفع إلى Cloudinary
        const cloudinaryRes = await uploadToCloudinary(dataUri, folder);

        return NextResponse.json({
            success: true,
            url: cloudinaryRes.secure_url,
            publicId: cloudinaryRes.public_id,
            width: cloudinaryRes.width,
            height: cloudinaryRes.height,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "فشل في رفع الصورة" }, { status: 500 });
    }
}
