// src/app/[locale]/news/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import NewsDetailsClient from "./NewsDetailsClient";

export const dynamic = "force-dynamic";

export default async function NewsDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
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
      isDraft: true,
      createdAt: true,
    },
  });

  if (!post || post.isDraft) notFound();

  // Get related posts (same category or recent)
  const relatedPosts = await prisma.post.findMany({
    where: {
      isDraft: false,
      id: { not: post.id },
      ...(post.category ? { category: post.category } : {})
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      titleRu: true,
      createdAt: true,
    }
  });

  // Localized Main Post
  const localizedPost = {
    id: post.id,
    title: locale === "ru" && post.titleRu ? post.titleRu : post.title,
    content: locale === "ru" && post.contentRu ? post.contentRu : post.content,
    category: locale === "ru" && post.categoryRu ? post.categoryRu : post.category,
    image: post.image,
    isPinned: post.isPinned,
    createdAt: post.createdAt.toISOString()
  };

  // Localized Related
  const localizedRelated = relatedPosts.map(p => ({
    id: p.id,
    title: locale === "ru" && p.titleRu ? p.titleRu : p.title,
    createdAt: p.createdAt.toISOString()
  }));

  return (
    <NewsDetailsClient
      post={localizedPost}
      relatedPosts={localizedRelated}
      locale={locale}
    />
  );
}
