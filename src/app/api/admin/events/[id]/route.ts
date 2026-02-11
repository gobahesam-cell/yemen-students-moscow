import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);
    return session && ["ADMIN", "EDITOR"].includes(session.role);
}

// 1. جلب فعالية محددة مع تفاصيل الحاضرين
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                rsvps: {
                    include: {
                        user: {
                            select: { name: true, email: true, role: true }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!event) return NextResponse.json({ error: "الفعالية غير موجودة" }, { status: 404 });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
    }
}

// 2. تحديث فعالية
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAdmin()) return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    const { id } = await params;

    try {
        const body = await req.json();
        console.log(`PATCH /api/admin/events/${id}: Received body:`, body);

        const event = await prisma.event.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                location: body.location,
                titleRu: body.titleRu || null,
                descriptionRu: body.descriptionRu || null,
                locationRu: body.locationRu || null,
                date: body.date ? new Date(body.date) : undefined,
                image: body.image,
                capacity: body.capacity !== undefined ? parseInt(body.capacity) : undefined
            }
        });

        console.log(`PATCH /api/admin/events/${id}: Event updated successfully`);
        return NextResponse.json(event);
    } catch (error: any) {
        console.error(`PATCH /api/admin/events/${id} CRITICAL ERROR:`, error);
        return NextResponse.json({
            error: "فشل تحديث الفعالية",
            details: error.message
        }, { status: 500 });
    }
}

// 3. حذف فعالية
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await isAdmin()) return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    const { id } = await params;

    try {
        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "فشل حذف الفعالية" }, { status: 500 });
    }
}
