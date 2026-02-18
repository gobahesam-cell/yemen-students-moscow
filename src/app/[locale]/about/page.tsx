import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import AboutPageClient from "./AboutPageClient";

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "ru" }>;
}) {
  const { locale } = await params;
  return <AboutPageClient locale={locale} />;
}