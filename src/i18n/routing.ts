export const locales = ["ar", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";
