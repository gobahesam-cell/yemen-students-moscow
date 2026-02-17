import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// تحديث حالة المستخدم إلى غير متصل
export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ success: true });
        }

        try {
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    isOnline: false,
                },
                select: { id: true },
            });
        } catch {
            // تجاهل - عمود isOnline قد لا يكون موجوداً
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "خطأ" }, { status: 500 });
    }
}
