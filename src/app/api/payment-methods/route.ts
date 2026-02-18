import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// جلب وسائل الدفع النشطة (API عام للصفحة العامة)
export async function GET() {
    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            select: {
                id: true,
                name: true,
                nameRu: true,
                accountNumber: true,
                holderName: true,
                holderNameRu: true,
                qrCodeImage: true,
            },
        });

        return NextResponse.json(methods);
    } catch (error) {
        console.error("Get Public Payment Methods Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
