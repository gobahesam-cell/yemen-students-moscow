import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { prisma } from "@/lib/db";
import NewsTickerClient from "./NewsTickerClient";

export default async function NewsTicker() {
    const t = await getTranslations("Home");
    const locale = (await getLocale()) as "ar" | "ru";

    // Fetch latest news from database
    let news: { id: string; title: string; titleRu?: string | null }[] = [];
    try {
        const posts = await prisma.post.findMany({
            where: { isDraft: false },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                title: true,
                titleRu: true,
            },
        });
        news = posts;
    } catch (error) {
        // Fallback if database is not available
        news = [
            {
                id: "1",
                title: "مرحباً بكم في موقع الجالية اليمنية",
                titleRu: "Добро пожаловать на сайт йеменской общины"
            },
        ];
    }

    // Don't render if no news
    if (news.length === 0) return null;

    return (
        <NewsTickerClient
            news={news}
            locale={locale}
            label={t("newsTickerLabel", { default: locale === "ar" ? "عاجل" : "НОВОСТИ" })}
        />
    );
}
