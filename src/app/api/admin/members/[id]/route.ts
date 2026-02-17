import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session";

// جلب بيانات عضو
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

        const member = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                nameRu: true,
                email: true,
                image: true,
                role: true,
                university: true,
                city: true,
                bio: true,
                phone: true,
                telegram: true,
                isOnline: true,
                lastSeenAt: true,
                createdAt: true,
                agreedToTerms: false,
                agreedToPrivacy: false,
                dataConsentDate: false,
            },
        });

        if (!member) {
            return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error("Get Member Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// تحديث بيانات عضو
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

        // التحقق من وجود العضو
        const existingMember = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingMember) {
            return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
        }

        // التحقق من البريد الإلكتروني إذا تم تغييره
        if (email && email !== existingMember.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email },
            });

            if (emailExists) {
                return NextResponse.json({ error: "البريد الإلكتروني مستخدم مسبقاً" }, { status: 400 });
            }
        }

        // تحديث البيانات
        const updatedMember = await prisma.user.update({
            where: { id },
            data: {
                name: name !== undefined ? (name || null) : existingMember.name,
                nameRu: nameRu !== undefined ? (nameRu || null) : existingMember.nameRu,
                email: email || existingMember.email,
                role: (role as any) || existingMember.role,
                university: university !== undefined ? (university || null) : existingMember.university,
                city: city !== undefined ? (city || null) : existingMember.city,
                bio: bio !== undefined ? (bio || null) : existingMember.bio,
                phone: phone !== undefined ? (phone || null) : existingMember.phone,
                telegram: telegram !== undefined ? (telegram || null) : existingMember.telegram,
                // ضمان بقاء القيم القديمة أو الافتراضية إذا كانت null
                isOnline: existingMember.isOnline ?? false,
                agreedToTerms: existingMember.agreedToTerms ?? false,
                agreedToPrivacy: existingMember.agreedToPrivacy ?? false,
            },
        });

        return NextResponse.json({ success: true, member: updatedMember });
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
