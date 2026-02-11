import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// تفاصيل ألبوم
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const album = await prisma.album.findUnique({
            where: { id },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        titleRu: true,
                    },
                },
                photos: {
                    include: {
                        uploader: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!album) {
            return NextResponse.json(
                { error: "الألبوم غير موجود" },
                { status: 404 }
            );
        }

        return NextResponse.json(album);
    } catch (error) {
        console.error("Error fetching album:", error);
        return NextResponse.json(
            { error: "فشل في جلب الألبوم" },
            { status: 500 }
        );
    }
}

// تعديل ألبوم
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
        const { titleAr, titleRu, description, coverImage, eventId, isPublic } = body;

        const album = await prisma.album.update({
            where: { id },
            data: {
                titleAr,
                titleRu,
                description,
                coverImage,
                eventId: eventId || null,
                isPublic,
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
        console.error("Error updating album:", error);
        return NextResponse.json(
            { error: "فشل في تعديل الألبوم" },
            { status: 500 }
        );
    }
}

// حذف ألبوم
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

        // حذف الألبوم (الصور ستُحذف تلقائياً بسبب onDelete: Cascade)
        await prisma.album.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting album:", error);
        return NextResponse.json(
            { error: "فشل في حذف الألبوم" },
            { status: 500 }
        );
    }
}
