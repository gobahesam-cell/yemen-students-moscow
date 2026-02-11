import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("System");

  return (
    <div className="space-y-4 py-10">
      <div className="h-7 w-64 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-4 w-96 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-4 w-80 animate-pulse rounded-xl bg-slate-200" />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="h-36 animate-pulse rounded-2xl border bg-slate-50" />
        <div className="h-36 animate-pulse rounded-2xl border bg-slate-50" />
        <div className="h-36 animate-pulse rounded-2xl border bg-slate-50" />
        <div className="h-36 animate-pulse rounded-2xl border bg-slate-50" />
      </div>

      <p className="pt-2 text-sm text-slate-600">{t("loading")}</p>
    </div>
  );
}