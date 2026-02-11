"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

type PostRow = {
  id: string;
  title: string;
  category: string;
  isDraft: boolean;
  isPinned: boolean;
  createdAt: string; // ISO
};

export default function PostsTableClient({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const t = useTranslations("Admin.posts");
  const locale = useLocale();
  const [busyId, setBusyId] = useState<string | null>(null);

  // ✅ Fix Hydration mismatch (locale time on client only)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const del = async (id: string) => {
    if (!confirm(t("table.confirmDelete"))) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const text = await res.text();
      if (!res.ok) {
        alert(`${t("table.deleteFailed")} (${res.status}): ${text.slice(0, 200)}`);
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <th className="p-4 font-bold text-slate-900 dark:text-white">{t("table.title")}</th>
            <th className="p-4 font-bold text-slate-900 dark:text-white">{t("table.category")}</th>
            <th className="p-4 font-bold text-slate-900 dark:text-white">{t("table.status")}</th>
            <th className="p-4 font-bold text-slate-900 dark:text-white">{t("table.important")}</th>
            <th className="p-4 font-bold text-slate-900 dark:text-white text-left">{t("table.date")}</th>
            <th className="p-4 font-bold text-slate-900 dark:text-white text-center">{t("table.actions")}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {posts.map((p) => (
            <tr
              key={p.id}
              className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              {/* Title */}
              <td className="p-4">
                <Link
                  href={`/admin/posts/${p.id}`}
                  className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors block max-w-md truncate"
                >
                  {p.title}
                </Link>
              </td>

              {/* Category */}
              <td className="p-4">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {p.category || t("general")}
                </span>
              </td>

              {/* Status */}
              <td className="p-4">
                {p.isDraft ? (
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
                    {t("draft")}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-xs font-bold text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                    {t("published")}
                  </span>
                )}
              </td>

              {/* Pinned */}
              <td className="p-4">
                {p.isPinned ? (
                  <span className="text-purple-500 font-bold bg-purple-50 dark:bg-purple-500/10 px-2 py-1 rounded-lg text-xs border border-purple-100 dark:border-purple-500/20">
                    {t("pinned")}
                  </span>
                ) : (
                  <span className="text-slate-300 dark:text-slate-600">—</span>
                )}
              </td>

              {/* Date */}
              <td className="p-4 text-left font-medium text-slate-500 dark:text-slate-400">
                {mounted ? new Date(p.createdAt).toLocaleDateString(locale, { day: '2-digit', month: 'short' }) : "—"}
              </td>

              {/* Actions */}
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-blue-600 dark:text-blue-400 shadow-sm hover:shadow"
                    title={t("table.edit")}
                  >
                    ✏️
                  </Link>

                  {!p.isDraft && (
                    <Link
                      href={`/news/${p.id}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-cyan-600 dark:text-cyan-400 shadow-sm hover:shadow"
                      title={t("table.view")}
                    >
                      👁️
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => del(p.id)}
                    disabled={busyId === p.id}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 transition-all text-red-600 dark:text-red-400 shadow-sm hover:shadow disabled:opacity-50"
                    title={t("table.delete")}
                  >
                    {busyId === p.id ? "⏳" : "🗑️"}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {posts.length === 0 && (
            <tr>
              <td className="p-12 text-center" colSpan={6}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📂</span>
                  <p className="text-slate-400 font-medium italic">{t("table.empty")}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

