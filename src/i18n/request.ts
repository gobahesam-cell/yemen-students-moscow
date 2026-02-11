import { getRequestConfig } from "next-intl/server";
import { locales } from "./routing";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // للـ admin routes: requestLocale قد يكون undefined لأن الـ middleware يتخطاها
  // في هذه الحالة نقرأ اللغة من الـ cookie مباشرة
  if (!locale) {
    try {
      const cookieStore = await cookies();
      locale = cookieStore.get("NEXT_LOCALE")?.value;
    } catch {
      // في حالة عدم توفر cookies (build time مثلاً)
    }
  }

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    return {
      locale: "ar",
      messages: (await import("../messages/ar.json")).default,
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

