import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";
import bcrypt from "bcryptjs";

// تغيير كلمة المرور للمستخدم الحالي
export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "كلمة المرور الحالية والجديدة مطلوبتان" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
                { status: 400 }
            );
        }

        // جلب المستخدم الحالي
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
        });

        if (!user) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        // التحقق من كلمة المرور الحالية
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { error: "كلمة المرور الحالية غير صحيحة" },
                { status: 400 }
            );
        }

        // تشفير كلمة المرور الجديدة
        const newHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.userId },
            data: { passwordHash: newHash },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Change Password Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
