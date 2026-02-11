"use client";

import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("System");

  return (
    <div className="py-16">
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-50 text-xl">
          !
        </div>
        <h1 className="text-2xl font-bold">{t("errorTitle")}</h1>
        <p className="mt-2 text-sm text-slate-700">{t("errorDesc")}</p>

        <div className="mt-6">
          <button
            onClick={() => reset()}
            className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    </div>
  );
}