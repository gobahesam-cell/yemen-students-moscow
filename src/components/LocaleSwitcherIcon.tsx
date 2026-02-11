"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 22a10 10 0 1 0-10-10 10.01 10.01 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 2c2.7 2.7 4.2 6.3 4.2 10S14.7 19.3 12 22c-2.7-2.7-4.2-6.3-4.2-10S9.3 4.7 12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function LocaleSwitcherIcon() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "ar" ? "ru" : "ar";
  const label = nextLocale.toUpperCase();

  // تحديد نوع المسار وبناء الرابط الصحيح
  const getNextHref = () => {
    // مسارات Admin (بدون locale في المسار)
    if (pathname.startsWith("/admin")) {
      return pathname; // نفس المسار
    }

    // مسارات عادية (مع locale في المسار)
    const parts = pathname.split("/");
    if (parts[1] === "ar" || parts[1] === "ru") {
      parts[1] = nextLocale;
      return parts.join("/") || `/${nextLocale}`;
    }

    // إذا لم يكن هناك locale، أضفه
    return `/${nextLocale}${pathname}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    // للـ admin نستخدم cookie لتغيير اللغة
    if (pathname.startsWith("/admin")) {
      e.preventDefault();

      // تعيين cookie للغة الجديدة
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;

      // إعادة تحميل الصفحة بالكامل لتطبيق اللغة الجديدة
      window.location.reload();
    }
  };

  const href = getNextHref();

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-sm font-semibold shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 ${isPending ? "opacity-50" : ""}`}
      aria-label={`Switch language to ${label}`}
      title={`Switch to ${label}`}
    >
      <GlobeIcon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition group-hover:text-slate-900 dark:group-hover:text-white" />
      <span className="tracking-wide text-slate-700 dark:text-slate-300">{label}</span>
    </Link>
  );
}