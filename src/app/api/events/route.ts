import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: "desc" },
            include: {
                _count: {
                    select: { rsvps: true }
                }
            }
        });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "تعذر جلب الفعاليات" }, { status: 500 });
    }
}
