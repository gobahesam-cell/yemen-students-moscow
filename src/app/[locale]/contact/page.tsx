import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import ContactPageClient from "./ContactPageClient";
import { prisma } from "@/lib/db";

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

async function getContactSettings() {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    return row ? JSON.parse(row.data) : {};
  } catch {
    return {};
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "ru" }>;
}) {
  const { locale } = await params;
  const contact = await getContactSettings();

  return <ContactPageClient locale={locale} contact={contact} />;
}