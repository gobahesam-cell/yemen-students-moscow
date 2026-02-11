import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { cookies } from "next/headers";

// التحقق من صلاحية المسؤول
async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);
    return session && ["ADMIN", "EDITOR"].includes(session.role);
}

// 1. جلب قائمة الفعاليات
export async function GET() {
    try {
        console.log("ADMIN GET /api/admin/events: Fetching all events.");
        const events = await prisma.event.findMany({
            orderBy: { date: "desc" },
            include: {
                _count: {
                    select: { rsvps: true }
                }
            }
        });
        return NextResponse.json(events);
    } catch (error: any) {
        console.error("ADMIN GET /api/admin/events error:", error.message || error);
        return NextResponse.json({ error: "تعذر جلب الفعاليات" }, { status: 500 });
    }
}

// 2. إضافة فعالية جديدة
export async function POST(req: Request) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    try {
        const body = await req.json();
        console.log("POST /api/admin/events: Received body:", body);

        const { title, description, date, location, image, capacity } = body;

        if (!title || !date || !location) {
            console.warn("POST /api/admin/events: Missing required fields:", { title, date, location });
            return NextResponse.json({ error: "البيانات ناقصة: يجب تعبئة العنوان والتاريخ والموقع بالعربية على الأقل" }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                title,
                description,
                location,
                titleRu: body.titleRu || null,
                descriptionRu: body.descriptionRu || null,
                locationRu: body.locationRu || null,
                date: new Date(date),
                image,
                capacity: parseInt(capacity) || 0,
            }
        });

        console.log("POST /api/admin/events: Event created successfully:", event.id);
        return NextResponse.json(event);
    } catch (error: any) {
        console.error("POST /api/admin/events CRITICAL ERROR:", error);
        return NextResponse.json({
            error: "حدث خطأ أثناء إضافة الفعالية",
            details: error.message
        }, { status: 500 });
    }
}
