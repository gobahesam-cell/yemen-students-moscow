import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";

// POST upload file - تم التحويل إلى Cloudinary ليعمل على Vercel
export async function POST(request: Request) {
    try {
        // التحقق من وجود مفاتيح Cloudinary أولاً
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Missing Cloudinary configuration for public upload");
            return NextResponse.json({ error: "إعدادات الرفع ناقصة (Environment Variables missing)" }, { status: 500 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "yemen_students/uploads";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `File type ${file.type} not allowed. Allowed: images` },
                { status: 400 }
            );
        }

        // Max file size check for Vercel compliance (4.5MB)
        if (file.size > 4.5 * 1024 * 1024) {
            return NextResponse.json({ error: "حجم الملف كبير جداً بالنسبة لـ Vercel. الحد الأقصى 4.5MB" }, { status: 400 });
        }

        // تحويل الملف إلى data URI للرفع لـ Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        const cloudinaryRes = await uploadToCloudinary(dataUri, folder);

        return NextResponse.json({
            success: true,
            url: cloudinaryRes.secure_url,
            fileName: cloudinaryRes.public_id,
            originalName: file.name,
            size: file.size,
            type: file.type,
        });
    } catch (error: any) {
        console.error("General upload error:", error);
        return NextResponse.json({
            error: "Failed to upload file to storage",
            detail: error.message || "Unknown error"
        }, { status: 500 });
    }
}

// Configure max body size
export const config = {
    api: {
        bodyParser: false,
    },
};
