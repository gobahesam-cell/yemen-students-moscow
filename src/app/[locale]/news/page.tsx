// src/app/[locale]/news/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import NewsGrid from "@/components/NewsGrid";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ru" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });
  return buildMetadata({ locale, path: "/news", title: t("newsTitle"), description: t("newsDesc") });
}

export const dynamic = "force-dynamic";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const posts = await prisma.post.findMany({
    where: { isDraft: false },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      titleRu: true,
      contentRu: true,
      category: true,
      categoryRu: true,
      image: true,
      isPinned: true,
      createdAt: true,
    },
  });

  // Serialize and select localized content
  const serializedPosts = posts.map(p => ({
    id: p.id,
    title: locale === "ru" && p.titleRu ? p.titleRu : p.title,
    content: locale === "ru" && p.contentRu ? p.contentRu : p.content,
    category: locale === "ru" && p.categoryRu ? p.categoryRu : p.category,
    image: p.image,
    isPinned: p.isPinned,
    createdAt: p.createdAt.toISOString()
  }));

  return (
    <main>
      <PageHeader
        title={locale === "ar" ? "أخبار الجالية" : "Новости сообщества"}
        description={locale === "ar" ? "آخر أخبار الجالية، الإعلانات، والتحديثات الرسمية." : "Последние новости сообщества, объявления и официальные обновления."}
        badge={locale === "ar" ? "الأرشيف" : "Архив"}
      />

      <NewsGrid posts={serializedPosts} locale={locale} />
    </main>
  );
}
