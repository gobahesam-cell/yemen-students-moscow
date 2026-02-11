"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RootNotFound() {
  const [locale, setLocale] = useState<"ar" | "ru">("ar");

  useEffect(() => {
    const first = window.location.pathname.split("/")[1];
    setLocale(first === "ru" ? "ru" : "ar");
  }, []);

  const isAr = locale === "ar";

  return (
    <div className="py-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-50 text-xl">
          404
        </div>

        <h1 className="text-2xl font-bold">
          {isAr ? "الصفحة غير موجودة" : "Страница не найдена"}
        </h1>

        <p className="mt-2 text-sm text-slate-700">
          {isAr
            ? "عذرًا، لا يمكننا العثور على الصفحة المطلوبة."
            : "К сожалению, мы не смогли найти запрошенную страницу."}
        </p>

        <div className="mt-6">
          <Link
            href={`/${locale}`}
            className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            {isAr ? "العودة للرئيسية" : "На главную"}
          </Link>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          <Link className="hover:underline" href="/ar">
            AR
          </Link>{" "}
          ·{" "}
          <Link className="hover:underline" href="/ru">
            RU
          </Link>
        </div>
      </div>
    </div>
  );
}
