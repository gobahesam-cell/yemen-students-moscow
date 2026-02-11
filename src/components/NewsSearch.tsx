"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Card from "@/components/Card";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
};

export default function NewsSearch({ items }: { items: NewsItem[] }) {
  const t = useTranslations("News");
  const locale = useLocale();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.excerpt.toLowerCase().includes(query)
    );
  }, [q, items]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-700 shadow-sm">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((n) => (
            <Card
              key={n.id}
              title={n.title}
              desc={n.excerpt}
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{n.date}</span>
                  <Link
                    href={`/${locale}/news/${n.id}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {t("readMore")}
                  </Link>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}