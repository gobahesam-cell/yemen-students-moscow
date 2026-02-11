import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
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
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDesc"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("Pages");

  return (
    <>
      <PageHeader
        title={t("contactTitle")}
        description={t("contactDesc")}
        badge={t("contactBadge", { default: "تواصل معنا" })}
      />
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 shadow-sm max-w-2xl mx-auto">
        <ContactForm />
      </div>
    </>
  );
}