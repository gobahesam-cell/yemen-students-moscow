import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST — رفع صورة إلى Cloudinary (موحّد لجميع الصفحات)
export async function POST(request: Request) {
    try {
        // التحقق من وجود مفاتيح Cloudinary أولاً (للتشخيص على Vercel)
        const missing = [];
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) missing.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
        if (!process.env.CLOUDINARY_API_KEY) missing.push("CLOUDINARY_API_KEY");
        if (!process.env.CLOUDINARY_API_SECRET) missing.push("CLOUDINARY_API_SECRET");

        if (missing.length > 0) {
            console.error("Missing Cloudinary configuration", missing);
            return NextResponse.json({
                error: "إعدادات الرفع ناقصة (Environment Variables missing)",
                detail: `المتغيرات المفقودة: ${missing.join(", ")}`
            }, { status: 500 });
        }

        const session = await getSession();

        if (!session || !["ADMIN", "EDITOR"].includes(session.role)) {
            return NextResponse.json({ error: "غير مصرح للمستخدم بالرفع" }, { status: 401 });
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
                { error: `نوع الملف (${file.type}) غير مدعوم. الصيغ المدعومة: JPEG, PNG, WebP, GIF` },
                { status: 400 }
            );
        }

        // التحقق من حجم الملف - Vercel Serverless Function limit is 4.5MB
        // Using a safe limit of 4MB for images on Vercel
        if (file.size > 4.5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "حجم الملف كبير جداً بالنسبة لـ Vercel. الحد الأقصى هو 4.5MB" },
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
    } catch (error: any) {
        console.error("Upload error detail:", error);
        return NextResponse.json({
            error: "فشل في رفع الصورة للسيرفر",
            detail: error.message || "Unknown error"
        }, { status: 500 });
    }
}
