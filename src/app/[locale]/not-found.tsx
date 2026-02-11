import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("System");

  return (
    <div className="py-16">
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border bg-slate-50 text-xl">
          404
        </div>
        <h1 className="text-2xl font-bold">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-sm text-slate-700">{t("notFoundDesc")}</p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}