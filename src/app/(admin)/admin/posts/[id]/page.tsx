import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import EditPostForm from "./EditPostForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminEditPostPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("Admin.forms");

  if (!id) return notFound();

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      titleRu: true,
      contentRu: true,
      categoryRu: true,
      image: true,
      isDraft: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post) return notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title={t("editPostPageTitle")}
        description={post.title.slice(0, 50) + (post.title.length > 50 ? "..." : "")}
      />

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{t("lastUpdated", { date: new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(post.updatedAt) })}</span>
        </div>
      </div>

      <EditPostForm
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category || "عام",
          titleRu: post.titleRu,
          contentRu: post.contentRu,
          categoryRu: post.categoryRu,
          image: post.image,
          isDraft: post.isDraft,
          isPinned: post.isPinned,
        }}
      />
    </div>
  );
}
