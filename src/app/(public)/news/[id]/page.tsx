import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewsDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      content: true,
      isDraft: true,
      isPinned: true,
      createdAt: true,
    },
  });

  if (!post || post.isDraft) return notFound();

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">
          {post.isPinned ? "📌 " : ""}
          {post.title}
        </h1>
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString("ar")}
        </p>
      </header>

      <article className="border rounded bg-white p-4 whitespace-pre-wrap leading-7">
        {post.content}
      </article>
    </div>
  );
}
