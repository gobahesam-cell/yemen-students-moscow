import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OnlineStatusWrapper } from "@/components/OnlineStatusWrapper";

// ✅ ثابت: يمنع مشاكل Turbopack مع dynamic import
import ar from "../../messages/ar.json";
import ru from "../../messages/ru.json";

const messagesMap = { ar, ru } as const;
type Locale = keyof typeof messagesMap;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  // مهم للـ SSG مع next-intl
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const messages = messagesMap[typedLocale];

  const isRTL = locale === "ar";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <OnlineStatusWrapper>
          <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen ${isRTL ? "font-ar" : "font-latin"} bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300`}>
            <Header />
            <NewsTicker />
            <main>{children}</main>
            <Footer />
          </div>
        </OnlineStatusWrapper>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

