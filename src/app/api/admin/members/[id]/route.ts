import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// جلب بيانات عضو - نسخة آمنة تعمل مع أي حالة لقاعدة البيانات
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { id } = await params;

        // محاولة جلب كل الحقول أولاً
        try {
            const member = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    nameRu: true,
                    role: true,
                    createdAt: true,
                    image: true,
                    university: true,
                    city: true,
                    bio: true,
                    phone: true,
                    telegram: true,
                    lastSeenAt: true,
                    _count: {
                        select: {
                            rsvps: true,
                            enrollments: true,
                            photos: true,
                        }
                    },
                },
            });

            if (!member) {
                return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
            }

            return NextResponse.json(member);
        } catch {
            // إذا فشل (أعمدة مفقودة)، جلب الحقول الأساسية فقط
            console.log("Falling back to basic fields for member:", id);
            const member = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            });

            if (!member) {
                return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
            }

            // إرجاع البيانات مع قيم افتراضية للحقول المفقودة
            return NextResponse.json({
                ...member,
                nameRu: null,
                image: null,
                university: null,
                city: null,
                bio: null,
                phone: null,
                telegram: null,
                lastSeenAt: null,
                _count: { rsvps: 0, enrollments: 0, photos: 0 },
            });
        }
    } catch (error) {
        console.error("Get Member Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// تحديث بيانات عضو - نسخة آمنة
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, nameRu, email, role, university, city, bio, phone, telegram } = body;

        // التحقق من وجود العضو باستخدام select آمن
        const existingMember = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!existingMember) {
            return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
        }

        // التحقق من البريد الإلكتروني إذا تم تغييره
        if (email && email !== existingMember.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });

            if (emailExists) {
                return NextResponse.json({ error: "البريد الإلكتروني مستخدم مسبقاً" }, { status: 400 });
            }
        }

        // محاولة التحديث مع كل الحقول
        try {
            const updatedMember = await prisma.user.update({
                where: { id },
                data: {
                    name: name || null,
                    nameRu: nameRu || null,
                    email: email || existingMember.email,
                    role: (role as any) || existingMember.role,
                    university: university || null,
                    city: city || null,
                    bio: bio || null,
                    phone: phone || null,
                    telegram: telegram || null,
                },
                select: { id: true, name: true, email: true, role: true },
            });

            return NextResponse.json({ success: true, member: updatedMember });
        } catch {
            // إذا فشل (أعمدة مفقودة)، تحديث الحقول الأساسية فقط
            console.log("Falling back to basic update for member:", id);
            const updatedMember = await prisma.user.update({
                where: { id },
                data: {
                    name: name || null,
                    email: email || existingMember.email,
                    role: (role as any) || existingMember.role,
                },
                select: { id: true, name: true, email: true, role: true },
            });

            return NextResponse.json({ success: true, member: updatedMember });
        }
    } catch (error) {
        console.error("Update Member Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// حذف عضو
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { id } = await params;

        // لا يمكن حذف نفسك
        if (id === session.userId) {
            return NextResponse.json({ error: "لا يمكنك حذف حسابك" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Member Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
