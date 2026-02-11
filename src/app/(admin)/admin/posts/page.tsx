import Link from "next/link";
import { prisma } from "@/lib/db";
import PostsTableClient from "./PostsTableClient";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { getTranslations } from "next-intl/server";

type SP = { [key: string]: string | string[] | undefined };

function getStr(sp: SP, key: string) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const t = await getTranslations("Admin.posts");

  const q = (getStr(sp, "q") ?? "").trim();
  const status = (getStr(sp, "status") ?? "all") as
    | "all"
    | "published"
    | "draft"
    | "pinned";
  const sort = (getStr(sp, "sort") ?? "new") as "new" | "old" | "title";
  const cat = (getStr(sp, "cat") ?? "all").trim();

  // ✅ categories list (للـ dropdown)
  const categoriesRaw = await prisma.post.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  const categories = categoriesRaw
    .map((x) => x.category || t("general"))
    .filter(Boolean);

  const where: any = {};
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (status === "published") where.isDraft = false;
  if (status === "draft") where.isDraft = true;
  if (status === "pinned") where.isPinned = true;
  if (cat !== "all" && cat !== t("general")) where.category = cat;

  const orderBy =
    sort === "old"
      ? { createdAt: "asc" as const }
      : sort === "title"
        ? { title: "asc" as const }
        : { createdAt: "desc" as const };

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      category: true,
      isDraft: true,
      isPinned: true,
      createdAt: true,
    },
  });

  // ✅ نحول التاريخ إلى string عشان يمر للـ Client safely
  const postsForClient = posts.map((p) => ({
    ...p,
    category: p.category || t("general"),
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8 pb-10">
      <AdminPageHeader
        title={t("title")}
        description={t("description", { count: posts.length })}
        action={{ label: t("addNew"), href: "/admin/posts/new" }}
      />

      {/* Controls Container */}
      <AdminCard delay={1}>
        <form className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Search */}
          <div className="md:col-span-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("searchLabel")}
            </label>
            <input
              name="q"
              defaultValue={q}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("statusLabel")}
            </label>
            <select
              name="status"
              defaultValue={status}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
            >
              <option value="all">{t("allStatuses")}</option>
              <option value="published">{t("published")}</option>
              <option value="draft">{t("draft")}</option>
              <option value="pinned">{t("pinned")}</option>
            </select>
          </div>

          {/* Category */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t("categoryLabel")}
            </label>
            <select
              name="cat"
              defaultValue={cat}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">{t("allCategories")}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-end gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {t("apply")}
            </button>
            <Link
              href="/admin/posts"
              className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 transition-all"
              title={t("clearFilters")}
            >
              🔄
            </Link>
          </div>
        </form>
      </AdminCard>

      {/* Results List */}
      <AdminCard delay={2} className="p-0 overflow-hidden">
        <PostsTableClient posts={postsForClient} />
      </AdminCard>
    </div>
  );
}

