import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";

// جلب كل وسائل الدفع (للأدمن)
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const methods = await prisma.paymentMethod.findMany({
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(methods);
    } catch (error) {
        console.error("Get Payment Methods Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}

// إضافة وسيلة دفع جديدة
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const { name, nameRu, accountNumber, holderName, holderNameRu, qrCodeImage } = body;

        if (!name || !accountNumber) {
            return NextResponse.json({ error: "الاسم ورقم الحساب مطلوبان" }, { status: 400 });
        }

        // حساب الترتيب التلقائي
        const maxOrder = await prisma.paymentMethod.aggregate({
            _max: { sortOrder: true },
        });

        const method = await prisma.paymentMethod.create({
            data: {
                name,
                nameRu: nameRu || null,
                accountNumber,
                holderName: holderName || null,
                holderNameRu: holderNameRu || null,
                qrCodeImage: qrCodeImage || null,
                sortOrder: (maxOrder._max.sortOrder || 0) + 1,
            },
        });

        return NextResponse.json(method);
    } catch (error) {
        console.error("Create Payment Method Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
