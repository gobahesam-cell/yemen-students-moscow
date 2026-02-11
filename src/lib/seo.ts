import type { Metadata } from "next";

export function buildMetadata(args: {
  title: string;
  description: string;
  locale: "ar" | "ru";
  path: string;
}) {
  const { title, description, locale, path } = args;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const url = `${baseUrl}/${locale}${path === "/" ? "" : path}`;

  const siteName =
    locale === "ar" ? "طلاب اليمن - موسكو" : "Йеменские студенты — Москва";

  const ogLocale = locale === "ar" ? "ar_AR" : "ru_RU";

  const metadata: Metadata = {
    title: {
      default: `${siteName}`,
      template: `%s | ${siteName}`,
    },
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${baseUrl}/ar${path === "/" ? "" : path}`,
        ru: `${baseUrl}/ru${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName,
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  return metadata;
}