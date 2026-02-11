// src/app/[locale]/news/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import NewsGrid from "@/components/NewsGrid";

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
