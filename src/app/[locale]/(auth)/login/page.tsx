"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type MsgType = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<MsgType>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsgType("loading");
    setMsg(t("loggingIn"));

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsgType("error");
        setMsg(data?.error || t("loginFailed"));
        return;
      }

      setMsgType("success");
      setMsg(t("loginSuccess"));

      router.refresh();

      setTimeout(() => {
        if (searchParams.get("callbackUrl")) {
          router.push(searchParams.get("callbackUrl")!);
        } else {
          router.push(data.role === "MEMBER" ? "/account" : "/admin");
        }
      }, 1000);
    } catch {
      setMsgType("error");
      setMsg(t("connectionError"));
    }
  }

  return (
    <div className="relative py-12 md:py-24 flex items-center justify-center px-4 overflow-hidden">
      {/* Background Orbs (Hero Style) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with Logo */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mx-auto mb-6 h-24 w-24"
          >
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl animate-pulse" />
            <div className="relative h-24 w-24 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </motion.div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {t("loginTitle")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {t("loginSubtitle")}
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">
                {t("email")}
              </label>
              <input
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">
                {t("password")}
              </label>
              <div className="relative group">
                <input
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPass ? t("hidePassword") : t("showPassword")}
                </button>
              </div>
            </div>

            <button
              disabled={msgType === "loading"}
              className="w-full h-14 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-2xl transition-all shadow-xl shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center text-lg"
            >
              {msgType === "loading" ? t("enteringButton") : t("enterButton")}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("orVia")}</span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-[0.98]"
            onClick={() => alert(t("googleSoon"))}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>

          {/* Message */}
          {msgType !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={[
                "mt-6 rounded-2xl px-4 py-4 text-sm text-center font-bold",
                msgType === "success" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                msgType === "error" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
                msgType === "loading" && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
              ].join(" ")}
            >
              {msg}
            </motion.div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {t("noAccount")}{" "}
              <Link href="/register" className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline transition-all">
                {t("createAccount")}
              </Link>
            </p>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-bold">
          {t("copyright", { year: new Date().getFullYear().toString() })}
        </p>
      </div>
    </div>
  );
}
