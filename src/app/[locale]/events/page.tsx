import { getLocale, getTranslations } from "next-intl/server";
import PageHeader from "@/components/PageHeader";
import EventsList from "@/components/EventsList";
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
    path: "/events",
    title: t("eventsTitle"),
    description: t("eventsDesc"),
  });
}

export default async function EventsPage() {
  const t = await getTranslations("Pages");

  return (
    <>
      <PageHeader title={t("eventsTitle")} description={t("eventsDesc")} />
      <EventsList />
    </>
  );
}