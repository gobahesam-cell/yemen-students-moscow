import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";

// تحديث وسيلة دفع
export async function PUT(
    req: Request,
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
        const body = await req.json();
        const { name, nameRu, accountNumber, holderName, holderNameRu, qrCodeImage, isActive, sortOrder } = body;

        const method = await prisma.paymentMethod.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(nameRu !== undefined && { nameRu: nameRu || null }),
                ...(accountNumber !== undefined && { accountNumber }),
                ...(holderName !== undefined && { holderName: holderName || null }),
                ...(holderNameRu !== undefined && { holderNameRu: holderNameRu || null }),
                ...(qrCodeImage !== undefined && { qrCodeImage: qrCodeImage || null }),
                ...(isActive !== undefined && { isActive }),
                ...(sortOrder !== undefined && { sortOrder }),
            },
        });

        return NextResponse.json(method);
    } catch (error) {
        console.error("Update Payment Method Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// حذف وسيلة دفع
export async function DELETE(
    req: Request,
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

        await prisma.paymentMethod.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Payment Method Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
