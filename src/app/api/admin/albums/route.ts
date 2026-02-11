import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// قائمة الألبومات
export async function GET() {
    try {
        const albums = await prisma.album.findMany({
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        titleRu: true,
                    },
                },
                _count: {
                    select: { photos: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(albums);
    } catch (error) {
        console.error("Error fetching albums:", error);
        return NextResponse.json(
            { error: "فشل في جلب الألبومات" },
            { status: 500 }
        );
    }
}

// إنشاء ألبوم جديد
export async function POST(request: Request) {
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
        const { titleAr, titleRu, description, coverImage, eventId, isPublic } = body;

        if (!titleAr) {
            return NextResponse.json(
                { error: "العنوان بالعربية مطلوب" },
                { status: 400 }
            );
        }

        const album = await prisma.album.create({
            data: {
                titleAr,
                titleRu: titleRu || null,
                description: description || null,
                coverImage: coverImage || null,
                eventId: eventId || null,
                isPublic: isPublic ?? true,
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                _count: {
                    select: { photos: true },
                },
            },
        });

        return NextResponse.json(album);
    } catch (error) {
        console.error("Error creating album:", error);
        return NextResponse.json(
            { error: "فشل في إنشاء الألبوم" },
            { status: 500 }
        );
    }
}
