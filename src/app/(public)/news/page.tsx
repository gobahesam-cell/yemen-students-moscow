import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { isDraft: false },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      content: true,
      isPinned: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">الأخبار</h1>
        <p className="text-gray-600">آخر أخبار الجالية</p>
      </header>

      {posts.length === 0 ? (
        <div className="border rounded p-4 bg-white">
          لا توجد أخبار منشورة بعد.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <article key={p.id} className="border rounded bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  {p.isPinned ? "📌 " : ""}
                  {p.title}
                </h2>

                <time className="text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString("ar")}
                </time>
              </div>

              <p className="mt-2 text-gray-700 line-clamp-3">{p.content}</p>

              <div className="mt-3">
                <Link
                  href={`/news/${p.id}`}
                  className="text-sm underline"
                >
                  اقرأ المزيد
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
