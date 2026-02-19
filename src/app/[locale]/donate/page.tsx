import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import DonatePageClient from "./DonatePageClient";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: "ar" | "ru" }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "SEO" });
    return buildMetadata({ locale, path: "/donate", title: t("donateTitle"), description: t("donateDesc") });
}

export default async function DonatePage() {
    let methods: any[] = [];
    try {
        methods = await prisma.paymentMethod.findMany({
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
    } catch {
        // الجدول قد لا يكون موجوداً بعد
        methods = [];
    }

    return <DonatePageClient methods={methods} />;
}
