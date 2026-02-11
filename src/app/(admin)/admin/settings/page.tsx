"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Settings, Palette, Globe, Shield, Bell, Database,
  Moon, Sun, Save, Loader2, Check, Eye, EyeOff,
  Download, Mail, Smartphone, MessageSquare, Lock,
  ChevronDown, ChevronUp, AlertTriangle, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────
interface NotificationPrefs {
  emailNotifications: boolean;
  newRegistration: boolean;
  newEventRsvp: boolean;
  newPostComment: boolean;
  weeklyReport: boolean;
}

// ─── Toggle Switch Component ─────────────────────────────
function Toggle({ checked, onChange, label, desc }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <div className="flex-1 min-w-0 ltr:pr-4 rtl:pl-4">
        <p className="font-bold text-sm text-slate-900 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
      </label>
    </div>
  );
}

// ─── Section Card ───────────────────────────────────────
function SectionCard({ title, desc, icon: Icon, color, open, onToggle, children }: {
  title: string; desc: string; icon: any; color: string;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-gradient-to-br ${color} rounded-xl text-white shadow-lg`}>
            <Icon size={22} />
          </div>
          <div className="text-start">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
        {open ? <ChevronUp className="text-slate-400" size={20} /> : <ChevronDown className="text-slate-400" size={20} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-0 space-y-4">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Settings Page ─────────────────────────────────
export default function AdminSettingsPage() {
  const t = useTranslations("Admin.settings");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Notification prefs (localStorage)
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    emailNotifications: true,
    newRegistration: true,
    newEventRsvp: true,
    newPostComment: false,
    weeklyReport: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // Data export
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Load notification prefs from localStorage
    const saved = localStorage.getItem("admin_notification_prefs");
    if (saved) {
      try { setNotifPrefs(JSON.parse(saved)); } catch { }
    }
  }, []);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Password Change Handler ──────────────────────────
  const handlePasswordChange = async () => {
    setPwMessage(null);

    if (!currentPassword || !newPassword) {
      setPwMessage({ type: "error", text: t("security.fillAllFields") });
      return;
    }
    if (newPassword.length < 6) {
      setPwMessage({ type: "error", text: t("security.minLength") });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: t("security.mismatch") });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPwMessage({ type: "success", text: t("security.success") });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwMessage({ type: "error", text: data.error || t("security.failed") });
      }
    } catch {
      setPwMessage({ type: "error", text: t("security.failed") });
    } finally {
      setPwLoading(false);
    }
  };

  // ─── Save Notification Prefs ──────────────────────────
  const saveNotifPrefs = useCallback(() => {
    localStorage.setItem("admin_notification_prefs", JSON.stringify(notifPrefs));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  }, [notifPrefs]);

  // ─── Data Export Handlers ─────────────────────────────
  const exportData = async (type: string) => {
    setExportLoading(type);
    try {
      let url = "";
      if (type === "posts") url = "/api/admin/posts";
      else if (type === "events") url = "/api/admin/events";
      else if (type === "users") url = "/api/admin/users";

      const res = await fetch(url);
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${type}_export_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExportLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-5 max-w-3xl mx-auto pb-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl text-white shadow-lg">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t("description")}
          </p>
        </div>
      </div>

      {/* ═══════════════════ APPEARANCE ═══════════════════ */}
      <SectionCard
        title={t("groups.appearance.title")}
        desc={t("groups.appearance.desc")}
        icon={Palette}
        color="from-violet-500 to-purple-500"
        open={openSections.appearance ?? true}
        onToggle={() => toggleSection("appearance")}
      >
        <div className="space-y-4">
          {/* Theme Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{t("darkMode")}</p>
                <p className="text-xs text-slate-500">{t("themeToggleDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setTheme("light")}
                className={`p-2.5 rounded-lg transition-all ${theme === "light" ? "bg-white dark:bg-slate-600 shadow text-amber-500" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Sun size={16} />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2.5 rounded-lg transition-all ${theme === "dark" ? "bg-white dark:bg-slate-600 shadow text-blue-500" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Moon size={16} />
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ═══════════════════ NOTIFICATIONS ═══════════════════ */}
      <SectionCard
        title={t("groups.notifications.title")}
        desc={t("groups.notifications.desc")}
        icon={Bell}
        color="from-amber-500 to-orange-500"
        open={openSections.notifications ?? false}
        onToggle={() => toggleSection("notifications")}
      >
        <div className="space-y-3">
          <Toggle
            checked={notifPrefs.emailNotifications}
            onChange={(v) => setNotifPrefs({ ...notifPrefs, emailNotifications: v })}
            label={t("notifications.emailNotifications")}
            desc={t("notifications.emailNotificationsDesc")}
          />
          <Toggle
            checked={notifPrefs.newRegistration}
            onChange={(v) => setNotifPrefs({ ...notifPrefs, newRegistration: v })}
            label={t("notifications.newRegistration")}
            desc={t("notifications.newRegistrationDesc")}
          />
          <Toggle
            checked={notifPrefs.newEventRsvp}
            onChange={(v) => setNotifPrefs({ ...notifPrefs, newEventRsvp: v })}
            label={t("notifications.newEventRsvp")}
            desc={t("notifications.newEventRsvpDesc")}
          />
          <Toggle
            checked={notifPrefs.newPostComment}
            onChange={(v) => setNotifPrefs({ ...notifPrefs, newPostComment: v })}
            label={t("notifications.newPostComment")}
            desc={t("notifications.newPostCommentDesc")}
          />
          <Toggle
            checked={notifPrefs.weeklyReport}
            onChange={(v) => setNotifPrefs({ ...notifPrefs, weeklyReport: v })}
            label={t("notifications.weeklyReport")}
            desc={t("notifications.weeklyReportDesc")}
          />

          <button
            onClick={saveNotifPrefs}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all mt-2"
          >
            {notifSaved ? (
              <><Check size={18} /> {t("notifications.saved")}</>
            ) : (
              <><Save size={18} /> {t("notifications.savePrefs")}</>
            )}
          </button>
        </div>
      </SectionCard>

      {/* ═══════════════════ SECURITY ═══════════════════ */}
      <SectionCard
        title={t("groups.security.title")}
        desc={t("groups.security.desc")}
        icon={Shield}
        color="from-rose-500 to-pink-500"
        open={openSections.security ?? false}
        onToggle={() => toggleSection("security")}
      >
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock size={16} /> {t("security.changePassword")}
          </h4>

          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t("security.currentPassword")}
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-12 px-4 ltr:pr-12 rtl:pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t("security.newPassword")}
            </label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 px-4 ltr:pr-12 rtl:pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-slate-400 hover:text-slate-600"
              >
                {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {t("security.confirmPassword")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${newPassword.length < 6 ? "w-1/4 bg-red-500" :
                    newPassword.length < 10 ? "w-2/4 bg-yellow-500" :
                      newPassword.length < 14 ? "w-3/4 bg-blue-500" : "w-full bg-green-500"
                    }`}
                />
              </div>
              <span className={`text-xs font-bold ${newPassword.length < 6 ? "text-red-500" :
                newPassword.length < 10 ? "text-yellow-500" :
                  newPassword.length < 14 ? "text-blue-500" : "text-green-500"
                }`}>
                {newPassword.length < 6 ? t("security.weak") :
                  newPassword.length < 10 ? t("security.medium") :
                    newPassword.length < 14 ? t("security.strong") : t("security.veryStrong")}
              </span>
            </div>
          )}

          {/* Message */}
          {pwMessage && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-bold ${pwMessage.type === "success"
              ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
              }`}>
              {pwMessage.type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
              {pwMessage.text}
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={pwLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all"
          >
            {pwLoading ? (
              <><Loader2 className="animate-spin" size={18} /> {t("security.changing")}</>
            ) : (
              <><Lock size={18} /> {t("security.changeBtn")}</>
            )}
          </button>
        </div>
      </SectionCard>

      {/* ═══════════════════ DATA EXPORT ═══════════════════ */}
      <SectionCard
        title={t("groups.backup.title")}
        desc={t("groups.backup.desc")}
        icon={Database}
        color="from-slate-500 to-slate-600"
        open={openSections.backup ?? false}
        onToggle={() => toggleSection("backup")}
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("backup.exportDesc")}
          </p>

          {[
            { key: "posts", icon: "📰", label: t("backup.exportPosts") },
            { key: "events", icon: "📅", label: t("backup.exportEvents") },
            { key: "users", icon: "👥", label: t("backup.exportUsers") },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => exportData(item.key)}
              disabled={exportLoading === item.key}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span className="flex items-center gap-3 font-bold text-sm text-slate-900 dark:text-white">
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </span>
              {exportLoading === item.key ? (
                <Loader2 size={18} className="animate-spin text-slate-400" />
              ) : (
                <Download size={18} className="text-slate-400" />
              )}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
