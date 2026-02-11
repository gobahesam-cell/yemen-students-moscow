import PageHeader from "@/components/PageHeader";

import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "ar" | "ru" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });

  return buildMetadata({
    locale,
    path: "/about",
    title: t("aboutTitle"),
    description: t("aboutDesc"),
  });
}

export default async function AboutPage() {
  const tPages = await getTranslations("Pages");
  const t = await getTranslations("About");

  const goals = t.raw("goals") as string[];
  const values = t.raw("values") as string[];

  return (
    <>
      <PageHeader
        title={tPages("aboutTitle")}
        description={tPages("aboutDesc")}
        badge={tPages("aboutBadge", { default: "من نحن" })}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Mission */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-500">Target</span>
            {t("missionTitle")}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            {t("missionText")}
          </p>
        </div>

        {/* Goals */}
        <div className="row-span-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500">Goal</span>
            {t("goalsTitle")}
          </h3>
          <ul className="space-y-4">
            {goals.map((g, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Values */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500">Star</span>
            {t("valuesTitle")}
          </h3>
          <div className="flex flex-wrap gap-3">
            {values.map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}