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

        // تحديث lastSeenAt و isOnline
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                lastSeenAt: new Date(),
                isOnline: true,
            },
        });

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

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                isOnline: true,
                lastSeenAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        // التحقق مما إذا كان المستخدم متصلاً فعلياً
        // إذا مر أكثر من دقيقتين بدون heartbeat، يعتبر غير متصل
        const isActuallyOnline =
            user.isOnline &&
            user.lastSeenAt &&
            Date.now() - new Date(user.lastSeenAt).getTime() < 2 * 60 * 1000;

        return NextResponse.json({
            isOnline: isActuallyOnline,
            lastSeenAt: user.lastSeenAt,
        });
    } catch (error) {
        console.error("Get Online Status Error:", error);
        return NextResponse.json({ error: "خطأ" }, { status: 500 });
    }
}
