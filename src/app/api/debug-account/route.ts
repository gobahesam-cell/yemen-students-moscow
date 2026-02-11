import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { prisma } from "@/lib/db";

// ⚠️ أداة تشخيص مؤقتة - يجب حذفها بعد الانتهاء
export async function GET() {
    const diagnostics: Record<string, unknown> = {};

    try {
        // 1. فحص الكوكيز
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        diagnostics.hasCookie = !!token;
        diagnostics.cookieName = COOKIE_NAME;

        // 2. فحص الجلسة
        const session = await decodeSession(token);
        diagnostics.hasSession = !!session;
        diagnostics.sessionData = session ? {
            userId: session.userId,
            role: session.role,
            exp: session.exp,
            expired: session.exp ? session.exp < Math.floor(Date.now() / 1000) : "no exp",
        } : null;

        // 3. فحص قاعدة البيانات
        if (session?.userId) {
            const user = await prisma.user.findUnique({
                where: { id: session.userId },
                select: { id: true, name: true, email: true, role: true },
            });
            diagnostics.userExists = !!user;
            diagnostics.userData = user;
        }

        // 4. فحص متغيرات Cloudinary
        diagnostics.cloudinary = {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "❌ NOT SET",
            apiKey: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ NOT SET",
            apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ NOT SET",
        };

        // 5. فحص SESSION_SECRET
        diagnostics.sessionSecret = process.env.SESSION_SECRET ? "✅ Set" : "❌ NOT SET";

        // 6. فحص DATABASE_URL
        diagnostics.databaseUrl = process.env.DATABASE_URL ? "✅ Set (starts with: " + process.env.DATABASE_URL.substring(0, 20) + "...)" : "❌ NOT SET";

        // 7. عدد المستخدمين
        const userCount = await prisma.user.count();
        diagnostics.totalUsers = userCount;

        // 8. عدد الدورات
        const courseCount = await prisma.course.count();
        diagnostics.totalCourses = courseCount;

        return NextResponse.json({
            status: "OK",
            timestamp: new Date().toISOString(),
            diagnostics,
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "ERROR",
            error: error.message,
            diagnostics,
        }, { status: 500 });
    }
}
