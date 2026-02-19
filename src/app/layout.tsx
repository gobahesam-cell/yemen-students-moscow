import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "الجالية اليمنية - موسكو",
  description: "منصة الجالية اليمنية في موسكو: أخبار، فعاليات، معرض، ودورات تعليمية.",
};

const RTL_LOCALES = new Set(["ar"]);

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-ar",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-latin",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const locale = h.get("x-intl-locale") ?? "ar";
  const dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${inter.variable} ${locale === "ar" ? "font-ar" : "font-latin"
          } min-h-screen bg-white text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
