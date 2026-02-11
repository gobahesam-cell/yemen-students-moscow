"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  const InputField = ({ label, type = "text", placeholder = "" }: { label: string, type?: string, placeholder?: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
      <input
        type={type}
        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-yellow-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
        <span className="text-lg">💡</span>
        <p className="leading-relaxed">{t("hint")}</p>
      </div>

      {sent ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700 text-center animate-pulse">
          ✅ {t("success")}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <InputField label={t("name")} />
        <InputField label={t("email")} type="email" />
      </div>

      <InputField label={t("subject")} />

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("message")}</label>
        <textarea
          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-yellow-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-slate-400 min-h-[150px] resize-y"
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3.5 text-sm font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {t("send")}
      </button>
    </form>
  );
}