import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_SETTINGS = {
    phone: "",
    email: "",
    whatsapp: "",
    telegram: "",
    facebook: "",
    youtube: "",
    instagram: "",
};

// جلب إعدادات الموقع (عام - مُكاش)
export async function GET() {
    try {
        const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
        const data = row ? JSON.parse(row.data) : DEFAULT_SETTINGS;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}
