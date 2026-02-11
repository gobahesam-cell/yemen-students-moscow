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

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const session = await decodeSession(token);

        if (!session) {
            redirect(`/${locale}/login`);
        }

        // جلب أحدث البيانات من DB مع اختيار الحقول اللازمة فقط لتحسين الأداء
        const user = await prisma.user.findUnique({
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
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Account Page Error:", error.message || error);
        // في حالة الخطأ، نفضل التوجيه للرئيسية أو إظهار خطأ بسيط
        redirect(`/${locale}/?error=account_load_failed`);
    }
}
