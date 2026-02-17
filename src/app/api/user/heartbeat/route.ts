import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// Heartbeat API - تحديث حالة الاتصال
export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        // محاولة تحديث lastSeenAt و isOnline
        try {
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    lastSeenAt: new Date(),
                    isOnline: true,
                },
                select: { id: true },
            });
        } catch {
            // تجاهل - الأعمدة قد لا تكون موجودة
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Heartbeat Error:", error);
        return NextResponse.json({ error: "خطأ" }, { status: 500 });
    }
}

// جلب حالة الاتصال للمستخدم
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
        }

        let lastSeenAt = null;
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    lastSeenAt: true,
                },
            });

            if (!user) {
                return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
            }

            lastSeenAt = user.lastSeenAt;
        } catch {
            // تجاهل - عمود lastSeenAt قد لا يكون موجوداً
        }

        const isActuallyOnline =
            lastSeenAt &&
            Date.now() - new Date(lastSeenAt).getTime() < 2 * 60 * 1000;

        return NextResponse.json({
            isOnline: isActuallyOnline || false,
            lastSeenAt,
        });
    } catch (error) {
        console.error("Get Online Status Error:", error);
        return NextResponse.json({ error: "خطأ" }, { status: 500 });
    }
}
