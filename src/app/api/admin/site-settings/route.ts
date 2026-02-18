import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { COOKIE_NAME, decodeSession } from "@/lib/session-core";
import { revalidateTag } from "next/cache";

const DEFAULT_SETTINGS = {
    phone: "",
    email: "",
    whatsapp: "",
    telegram: "",
    facebook: "",
    youtube: "",
    instagram: "",
};

// جلب إعدادات الموقع (للأدمن)
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
        const data = row ? JSON.parse(row.data) : DEFAULT_SETTINGS;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Get Site Settings Error:", error);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

// تحديث إعدادات الموقع
export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();

        await prisma.siteSettings.upsert({
            where: { id: "main" },
            update: { data: JSON.stringify(body) },
            create: { id: "main", data: JSON.stringify(body) },
        });

        revalidateTag("site-settings");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update Site Settings Error:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}
