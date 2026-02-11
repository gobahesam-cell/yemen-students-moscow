import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";

// قائمة الصور مع فلترة
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const albumId = searchParams.get("albumId");
        const isApproved = searchParams.get("approved");
        const pending = searchParams.get("pending");

        const where: Record<string, unknown> = {};

        if (albumId) {
            where.albumId = albumId;
        }

        if (isApproved !== null) {
            where.isApproved = isApproved === "true";
        }

        if (pending === "true") {
            where.isApproved = false;
        }

        const photos = await prisma.photo.findMany({
            where,
            include: {
                album: {
                    select: {
                        id: true,
                        titleAr: true,
                        titleRu: true,
                    },
                },
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(photos);
    } catch (error) {
        console.error("Error fetching photos:", error);
        return NextResponse.json(
            { error: "فشل في جلب الصور" },
            { status: 500 }
        );
    }
}

// رفع صورة جديدة إلى Cloudinary
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json(
                { error: "غير مصرح" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const albumId = formData.get("albumId") as string;
        const caption = formData.get("caption") as string;

        if (!file || !albumId) {
            return NextResponse.json(
                { error: "الملف والألبوم مطلوبان" },
                { status: 400 }
            );
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

        // التحقق من وجود الألبوم
        const album = await prisma.album.findUnique({
            where: { id: albumId },
        });

        if (!album) {
            return NextResponse.json(
                { error: "الألبوم غير موجود" },
                { status: 404 }
            );
        }

        // تحويل الملف إلى base64 data URI
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        // رفع إلى Cloudinary
        const cloudinaryRes = await uploadToCloudinary(dataUri, "yemen_students/gallery");

        const fileUrl = cloudinaryRes.secure_url;

        // تحديد إذا كانت الصورة معتمدة تلقائياً (للمشرفين)
        const isAdmin = ["ADMIN", "EDITOR"].includes(session.role);

        // إنشاء سجل الصورة
        const photo = await prisma.photo.create({
            data: {
                url: fileUrl,
                thumbnail: cloudinaryRes.secure_url.replace("/upload/", "/upload/c_thumb,w_300,h_300/"),
                caption: caption || null,
                albumId,
                uploaderId: session.userId,
                isApproved: isAdmin, // تلقائي للمشرفين
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(photo);
    } catch (error) {
        console.error("Error uploading photo:", error);
        return NextResponse.json(
            { error: "فشل في رفع الصورة" },
            { status: 500 }
        );
    }
}
