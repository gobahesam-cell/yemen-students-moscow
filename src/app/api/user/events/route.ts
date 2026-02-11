import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
        }

        const userEvents = await prisma.rsvp.findMany({
            where: {
                userId: session.userId
            },
            include: {
                event: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // تحويل البيانات لتناسب الواجهة
        const formattedEvents = userEvents.map(rsvp => ({
            ...rsvp.event,
            rsvpId: rsvp.id,
            rsvpCreatedAt: rsvp.createdAt
        }));

        return NextResponse.json(formattedEvents);
    } catch (error: any) {
        console.error("GET /api/user/events error:", error.message || error);
        return NextResponse.json({ error: "تعذر جلب الفعاليات" }, { status: 500 });
    }
}
