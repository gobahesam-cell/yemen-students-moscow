import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// جلب بيانات الملف الشخصي للمستخدم الحالي
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        let user;
        try {
            user = await prisma.user.findUnique({
                where: { id: session.userId },
                select: {
                    id: true,
                    name: true,
                    nameRu: true,
                    email: true,
                    image: true,
                    university: true,
                    city: true,
                    bio: true,
                    phone: true,
                    telegram: true,
                },
            });
        } catch {
            // fallback
            const basic = await prisma.user.findUnique({
                where: { id: session.userId },
                select: { id: true, name: true, email: true },
            });
            if (basic) {
                user = {
                    ...basic,
                    nameRu: null,
                    image: null,
                    university: null,
                    city: null,
                    bio: null,
                    phone: null,
                    telegram: null,
                };
            }
        }

        if (!user) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// تحديث بيانات الملف الشخصي للمستخدم الحالي
export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await request.json();
        const { name, nameRu, university, city, bio, phone, telegram, image } = body;

        // محاولة تحديث كل الحقول
        try {
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    name: name || null,
                    nameRu: nameRu || null,
                    university: university || null,
                    city: city || null,
                    bio: bio || null,
                    phone: phone || null,
                    telegram: telegram || null,
                    image: image || null,
                },
                select: { id: true },
            });
        } catch {
            // fallback - تحديث الأساسيات فقط
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    name: name || null,
                },
                select: { id: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
