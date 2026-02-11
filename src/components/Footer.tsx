import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { navItems } from "@/components/navItems";

export default async function Footer() {
  const locale = (await getLocale()) as "ar" | "ru";

  const tNav = await getTranslations("Nav");
  let tFooter: (key: string) => string;
  try {
    tFooter = await getTranslations("Footer");
  } catch {
    tFooter = tNav;
  }

  const links = navItems.map((it) => ({
    href: `/${locale}${it.path === "" ? "/" : it.path}`,
    label: tNav(it.key),
  }));

  const year = new Date().getFullYear();
  const isRTL = locale === "ar";

  const title = locale === "ar" ? "الجالية اليمنية - موسكو" : "Йеменская община — Москва";
  const desc = locale === "ar"
    ? "منصة الجالية: أخبار، فعاليات، معرض، ودورات تعليمية للطلاب."
    : "Платформа сообщества: новости, события, галерея и обучающие курсы.";

  return (
    <footer dir={isRTL ? "rtl" : "ltr"} className="mt-20 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-xs">{desc}</p>
            </div>

            {/* Social placeholders */}
            <div className="flex flex-wrap gap-2">
              {["Telegram", "WhatsApp", "Email"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
                  aria-label={label}
                >
                  <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="md:justify-self-center">
            <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {tFooter("linksTitle")}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:justify-self-end">
            <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {tFooter("contactTitle")}
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-white/5 text-yellow-600 dark:text-yellow-500">
                  📧
                </span>
                <span>placeholder@email.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-white/5 text-yellow-600 dark:text-yellow-500">
                  📞
                </span>
                <span dir="ltr">+7 000 000 00 00</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-white/5 text-yellow-600 dark:text-yellow-500">
                  📍
                </span>
                <span>
                  {tFooter("location")}: {locale === "ar" ? "موسكو - روسيا" : "Москва, Россия"}
                </span>
              </div>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex mt-6 items-center justify-center rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 transition w-full md:w-auto"
              >
                {tFooter("contactCta")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 dark:border-white/5 pt-8 text-xs text-slate-500 dark:text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            © {year} {title}.
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/about`} className="hover:text-slate-900 dark:hover:text-white transition">
              {locale === "ar" ? "من نحن" : "О нас"}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-slate-900 dark:hover:text-white transition">
              {locale === "ar" ? "تواصل" : "Контакты"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
