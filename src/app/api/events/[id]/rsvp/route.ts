import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: eventId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);

    if (!session) {
        return NextResponse.json({ error: "يجب تسجيل الدخول لتأكيد الحضور" }, { status: 401 });
    }

    try {
        // 1. تحقق من وجود الفعالية والسعة
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { _count: { select: { rsvps: true } } }
        });

        if (!event) return NextResponse.json({ error: "الفعالية غير موجودة" }, { status: 404 });

        // التحقق من تاريخ الفعالية
        if (new Date(event.date) < new Date()) {
            return NextResponse.json({ error: "عذراً، انتهت الفعالية" }, { status: 400 });
        }

        // التحقق من السعة
        if (event.capacity && event.capacity > 0 && event._count.rsvps >= event.capacity) {
            return NextResponse.json({ error: "عذراً، اكتملت المقاعد" }, { status: 400 });
        }

        // 2. تسجيل الحضور (سيتحقق Prisma تلقائياً من الـ unique constraint)
        const rsvp = await prisma.rsvp.create({
            data: {
                userId: session.userId,
                eventId: eventId,
            }
        });

        return NextResponse.json(rsvp);
    } catch (error: any) {
        console.error("RSVP POST Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "لقد قمت بتأكيد حضورك مسبقاً" }, { status: 400 });
        }
        if (error.code === 'P2003') {
            return NextResponse.json({ error: "بيانات الجلسة غير صالحة. يرجى تسجيل الخروج والدخول مجدداً." }, { status: 401 });
        }
        return NextResponse.json({ error: `فشل تأكيد الحضور: ${error.message || 'خطأ غير معروف'}` }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: eventId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);

    if (!session) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

    try {
        await prisma.rsvp.delete({
            where: {
                userId_eventId: {
                    userId: session.userId,
                    eventId: eventId
                }
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "فشل إلغاء الحضور" }, { status: 500 });
    }
}
