import { cookies } from "next/headers";
import { decodeSession, COOKIE_NAME } from "@/lib/session-core";
import { redirect } from "next/navigation";
import AccountPageClient from "./AccountPageClient";
import { prisma } from "@/lib/db";
import { setRequestLocale } from "next-intl/server";

export default async function AccountPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // ✅ مهم للـ static rendering والمجاميع المسارة مع next-intl
    setRequestLocale(locale);

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = await decodeSession(token);

    if (!session) {
        redirect(`/${locale}/login`);
    }

    // جلب البيانات مع fallback آمن
    let user: any;
    try {
        user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                name: true,
                nameRu: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                university: true,
                city: true,
                bio: true,
                telegram: true,
            },
        });
    } catch {
        // إذا فشل (أعمدة مفقودة)، جلب الأساسيات
        const basicUser = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (basicUser) {
            user = {
                ...basicUser,
                nameRu: null,
                image: null,
                university: null,
                city: null,
                bio: null,
                telegram: null,
            };
        }
    }

    if (!user) {
        redirect(`/${locale}/login`);
    }

    return (
        <AccountPageClient
            user={{
                name: user.name || "عضو",
                nameRu: user.nameRu || null,
                email: user.email,
                role: user.role,
                image: user.image,
                createdAt: user.createdAt.toISOString(),
                university: user.university,
                city: user.city,
                bio: user.bio,
                telegram: user.telegram,
            }}
        />
    );
}
