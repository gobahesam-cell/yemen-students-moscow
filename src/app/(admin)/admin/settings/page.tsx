"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Settings, Palette, Shield, Database, Moon, Sun, Save, Loader2, Check,
  Eye, EyeOff, Download, Upload, Mail, Lock, AlertTriangle,
  Phone, Send, Facebook, Youtube, Instagram, Share2, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";

// ─── Toggle ────────────────────────────────
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
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
      </label>
    </div>
  );
}

// ─── Main ──────────────────────────────────
export default function AdminSettingsPage() {
  const t = useTranslations("Admin.settings");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "security" | "system">("general");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifications: true, newRegistration: true, newEventRsvp: true,
    newPostComment: false, weeklyReport: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // Contact & Social
  const [contactData, setContactData] = useState({
    phone: "", email: "", whatsapp: "", telegram: "",
    facebook: "", youtube: "", instagram: "", mapUrl: "", showMap: true,
  });
  const [contactLoading, setContactLoading] = useState(true);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  // Backup & Restore
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [restoreLoading, setRestoreLoading] = useState<string | null>(null);
  const [restoreResult, setRestoreResult] = useState<{ type: string; restored: number; skipped: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreType, setRestoreType] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_notification_prefs");
    if (saved) { try { setNotifPrefs(JSON.parse(saved)); } catch { } }
    fetch("/api/admin/site-settings")
      .then(r => r.json())
      .then(d => { if (d && !d.error) setContactData(prev => ({ ...prev, ...d })); })
      .catch(() => { })
      .finally(() => setContactLoading(false));
  }, []);

  // ─── Handlers ────────────────────────────
  const handlePasswordChange = async () => {
    setPwMessage(null);
    if (!currentPassword || !newPassword) { setPwMessage({ type: "error", text: t("security.fillAllFields") }); return; }
    if (newPassword.length < 6) { setPwMessage({ type: "error", text: t("security.minLength") }); return; }
    if (newPassword !== confirmPassword) { setPwMessage({ type: "error", text: t("security.mismatch") }); return; }
    setPwLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMessage({ type: "success", text: t("security.success") });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else { setPwMessage({ type: "error", text: data.error || t("security.failed") }); }
    } catch { setPwMessage({ type: "error", text: t("security.failed") }); }
    finally { setPwLoading(false); }
  };

  const saveNotifPrefs = () => {
    localStorage.setItem("admin_notification_prefs", JSON.stringify(notifPrefs));
    setNotifSaved(true); setTimeout(() => setNotifSaved(false), 2000);
  };

  const saveContact = async () => {
    setContactSaving(true);
    try {
      await fetch("/api/admin/site-settings", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      setContactSaved(true); setTimeout(() => setContactSaved(false), 2000);
    } catch { }
    setContactSaving(false);
  };

  const exportData = async (type: string) => {
    setExportLoading(type);
    try {
      let url = "";
      if (type === "all") url = "/api/admin/backup";
      else if (type === "posts") url = "/api/admin/posts";
      else if (type === "events") url = "/api/admin/events";
      else if (type === "users") url = "/api/admin/users";
      else if (type === "courses") url = "/api/admin/courses";

      const res = await fetch(url);
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${type}_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) { console.error("Export error:", e); }
    finally { setExportLoading(null); }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !restoreType) return;
    setRestoreLoading(restoreType);
    setRestoreResult(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // If it's a full backup file, extract the right type
      let dataArray = json;
      if (json.data && json.version) {
        // Full backup format
        dataArray = json.data[restoreType] || [];
      }
      if (!Array.isArray(dataArray)) { dataArray = [dataArray]; }

      const res = await fetch("/api/admin/restore", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: restoreType, data: dataArray }),
      });
      const result = await res.json();
      if (result.success) {
        setRestoreResult({ type: restoreType, restored: result.restored, skipped: result.skipped });
      }
    } catch (err) { console.error("Restore error:", err); }
    finally {
      setRestoreLoading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerRestore = (type: string) => {
    setRestoreType(type);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  if (!mounted) return null;

  const tabs = [
    { id: "general" as const, label: isRTL ? "⚙️ عام" : "⚙️ Общие" },
    { id: "security" as const, label: isRTL ? "🔒 الأمان" : "🔒 Безопасность" },
    { id: "system" as const, label: isRTL ? "💾 النظام" : "💾 Система" },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hidden file input for restore */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl text-white">
          <Settings size={22} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{t("title")}</h1>
          <p className="text-slate-500 text-xs">{t("description")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === tab.id
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════ TAB: GENERAL ═══════════ */}
      {activeTab === "general" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Theme */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Palette size={16} className="text-violet-500" />
              {t("groups.appearance.title")}
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                {theme === "dark" ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("darkMode")}</span>
              </div>
              <div className="flex gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
                <button onClick={() => setTheme("light")}
                  className={`p-2 rounded-md transition-all ${theme === "light" ? "bg-white dark:bg-slate-600 shadow text-amber-500" : "text-slate-400"}`}>
                  <Sun size={14} />
                </button>
                <button onClick={() => setTheme("dark")}
                  className={`p-2 rounded-md transition-all ${theme === "dark" ? "bg-white dark:bg-slate-600 shadow text-blue-500" : "text-slate-400"}`}>
                  <Moon size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Share2 size={16} className="text-cyan-500" />
              {isRTL ? "بيانات التواصل" : "Контактные данные"}
            </h3>
            {contactLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-slate-400" size={20} /></div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: "phone", icon: Phone, label: isRTL ? "الهاتف" : "Телефон", ph: "+7 999 123 45 67" },
                  { key: "email", icon: Mail, label: isRTL ? "البريد" : "Почта", ph: "info@example.com" },
                  { key: "whatsapp", icon: Phone, label: "WhatsApp", ph: "+7 999 123 45 67" },
                  { key: "telegram", icon: Send, label: "Telegram", ph: "@username" },
                  { key: "facebook", icon: Facebook, label: "Facebook", ph: "https://facebook.com/..." },
                  { key: "youtube", icon: Youtube, label: "YouTube", ph: "https://youtube.com/@..." },
                  { key: "instagram", icon: Instagram, label: "Instagram", ph: "@username" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                      <f.icon size={12} /> {f.label}
                    </label>
                    <input
                      dir="ltr" type="text"
                      value={(contactData as any)[f.key] || ""}
                      onChange={e => setContactData({ ...contactData, [f.key]: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm"
                      placeholder={f.ph}
                    />
                  </div>
                ))}

                {/* Map */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <MapPin size={12} /> {isRTL ? "الخريطة" : "Карта"}
                    </label>
                    <button type="button" onClick={() => setContactData({ ...contactData, showMap: !contactData.showMap })}
                      className={`relative w-10 h-5 rounded-full transition-colors ${contactData.showMap ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${contactData.showMap ? (isRTL ? "left-0.5" : "right-0.5") : (isRTL ? "right-0.5" : "left-0.5")
                        }`} />
                    </button>
                  </div>
                  {contactData.showMap && (
                    <input dir="ltr" type="text"
                      value={contactData.mapUrl || ""}
                      onChange={e => setContactData({ ...contactData, mapUrl: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                  )}
                </div>

                <button onClick={saveContact} disabled={contactSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg font-bold text-sm transition-all">
                  {contactSaving ? <><Loader2 className="animate-spin" size={16} /> {isRTL ? "حفظ..." : "Сохранение..."}</>
                    : contactSaved ? <><Check size={16} /> {isRTL ? "تم" : "Сохранено"}</>
                      : <><Save size={16} /> {isRTL ? "حفظ" : "Сохранить"}</>}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ═══════════ TAB: SECURITY ═══════════ */}
      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock size={16} className="text-rose-500" />
              {t("security.changePassword")}
            </h3>
            <div className="space-y-3">
              {/* Current */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">{t("security.currentPassword")}</label>
                <div className="relative">
                  <input type={showCurrentPw ? "text" : "password"} value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full h-10 px-3 ltr:pr-10 rtl:pl-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-slate-400 hover:text-slate-600">
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {/* New */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">{t("security.newPassword")}</label>
                <div className="relative">
                  <input type={showNewPw ? "text" : "password"} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full h-10 px-3 ltr:pr-10 rtl:pl-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-slate-400 hover:text-slate-600">
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {/* Confirm */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">{t("security.confirmPassword")}</label>
                <input type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
                  placeholder="••••••••" />
              </div>
              {/* Strength */}
              {newPassword && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${newPassword.length < 6 ? "w-1/4 bg-red-500" :
                        newPassword.length < 10 ? "w-2/4 bg-yellow-500" :
                          newPassword.length < 14 ? "w-3/4 bg-blue-500" : "w-full bg-green-500"
                      }`} />
                  </div>
                  <span className={`text-[10px] font-bold ${newPassword.length < 6 ? "text-red-500" :
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
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold ${pwMessage.type === "success"
                    ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                  {pwMessage.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
                  {pwMessage.text}
                </div>
              )}
              <button onClick={handlePasswordChange} disabled={pwLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white rounded-lg font-bold text-sm transition-all">
                {pwLoading ? <><Loader2 className="animate-spin" size={16} /> {t("security.changing")}</>
                  : <><Lock size={16} /> {t("security.changeBtn")}</>}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════ TAB: SYSTEM ═══════════ */}
      {activeTab === "system" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Notifications */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              🔔 {isRTL ? "تفضيلات الإشعارات" : "Настройки уведомлений"}
            </h3>
            <div className="space-y-2">
              <Toggle checked={notifPrefs.emailNotifications}
                onChange={v => setNotifPrefs({ ...notifPrefs, emailNotifications: v })}
                label={t("notifications.emailNotifications")} desc={t("notifications.emailNotificationsDesc")} />
              <Toggle checked={notifPrefs.newRegistration}
                onChange={v => setNotifPrefs({ ...notifPrefs, newRegistration: v })}
                label={t("notifications.newRegistration")} desc={t("notifications.newRegistrationDesc")} />
              <Toggle checked={notifPrefs.newEventRsvp}
                onChange={v => setNotifPrefs({ ...notifPrefs, newEventRsvp: v })}
                label={t("notifications.newEventRsvp")} desc={t("notifications.newEventRsvpDesc")} />
              <Toggle checked={notifPrefs.newPostComment}
                onChange={v => setNotifPrefs({ ...notifPrefs, newPostComment: v })}
                label={t("notifications.newPostComment")} desc={t("notifications.newPostCommentDesc")} />
              <Toggle checked={notifPrefs.weeklyReport}
                onChange={v => setNotifPrefs({ ...notifPrefs, weeklyReport: v })}
                label={t("notifications.weeklyReport")} desc={t("notifications.weeklyReportDesc")} />
              <button onClick={saveNotifPrefs}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-sm transition-all mt-1">
                {notifSaved ? <><Check size={16} /> {t("notifications.saved")}</>
                  : <><Save size={16} /> {t("notifications.savePrefs")}</>}
              </button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Database size={16} className="text-slate-500" />
              {t("groups.backup.title")}
            </h3>

            {/* Export */}
            <p className="text-xs text-slate-500 mb-3">{isRTL ? "تصدير البيانات كملف JSON" : "Экспорт данных в JSON"}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { key: "posts", label: isRTL ? "📰 الأخبار" : "📰 Новости" },
                { key: "events", label: isRTL ? "📅 الفعاليات" : "📅 События" },
                { key: "users", label: isRTL ? "👥 الأعضاء" : "👥 Пользователи" },
                { key: "courses", label: isRTL ? "🎓 الدورات" : "🎓 Курсы" },
              ].map(item => (
                <button key={item.key} onClick={() => exportData(item.key)} disabled={exportLoading === item.key}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">
                  <span>{item.label}</span>
                  {exportLoading === item.key ? <Loader2 size={14} className="animate-spin text-slate-400" /> : <Download size={14} className="text-slate-400" />}
                </button>
              ))}
            </div>
            <button onClick={() => exportData("all")} disabled={exportLoading === "all"}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-bold text-sm transition-all mb-5">
              {exportLoading === "all" ? <><Loader2 className="animate-spin" size={16} /> {isRTL ? "جارِ التصدير..." : "Экспорт..."}</>
                : <><Download size={16} /> {isRTL ? "📦 تصدير الكل" : "📦 Экспорт всего"}</>}
            </button>

            {/* Restore */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-xs text-slate-500 mb-1 font-bold">{isRTL ? "⬆️ استعادة البيانات" : "⬆️ Восстановление данных"}</p>
              <p className="text-[11px] text-slate-400 mb-3">
                {isRTL
                  ? "ارفع ملف JSON مُصدَّر مسبقاً. البيانات المكررة سيتم تخطّيها تلقائياً."
                  : "Загрузите ранее экспортированный JSON. Дубликаты будут пропущены."}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "posts", label: isRTL ? "📰 الأخبار" : "📰 Новости" },
                  { key: "events", label: isRTL ? "📅 الفعاليات" : "📅 События" },
                  { key: "users", label: isRTL ? "👥 الأعضاء" : "👥 Пользователи" },
                  { key: "courses", label: isRTL ? "🎓 الدورات" : "🎓 Курсы" },
                ].map(item => (
                  <button key={item.key} onClick={() => triggerRestore(item.key)} disabled={restoreLoading === item.key}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-500/5 hover:bg-amber-100 dark:hover:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm font-bold text-amber-700 dark:text-amber-400 transition-colors">
                    <span>{item.label}</span>
                    {restoreLoading === item.key ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  </button>
                ))}
              </div>

              {/* Restore Result */}
              {restoreResult && (
                <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">
                    ✅ {isRTL ? "تم الاستعادة" : "Восстановлено"}: {restoreResult.restored} {isRTL ? "سجل" : "записей"}
                    {restoreResult.skipped > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 mx-1">
                        | {isRTL ? "تم تخطّي" : "Пропущено"}: {restoreResult.skipped} {isRTL ? "(مكرر)" : "(дубликаты)"}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
