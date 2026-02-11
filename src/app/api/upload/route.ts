import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST upload file - تم التحويل إلى Cloudinary ليعمل على Vercel
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "yemen_students/uploads";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/webm",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "File type not allowed. Allowed: PDF, images, videos" },
                { status: 400 }
            );
        }

        // Max file size check (50MB check remains, but Cloudinary free tier has its own limits)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Max 50MB" }, { status: 400 });
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
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
    }
}

// Configure max body size
export const config = {
    api: {
        bodyParser: false,
    },
};
