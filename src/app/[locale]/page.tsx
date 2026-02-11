import { getLocale, getTranslations } from "next-intl/server";
import HomeSections from "@/components/HomeSections";
import Hero from "@/components/Hero";
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
    path: "/",
    title: t("homeTitle"),
    description: t("homeDesc"),
  });
}

export default async function HomePage() {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}