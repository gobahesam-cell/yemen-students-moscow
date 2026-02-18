import { prisma } from "@/lib/db";
import DonatePageClient from "./DonatePageClient";

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
