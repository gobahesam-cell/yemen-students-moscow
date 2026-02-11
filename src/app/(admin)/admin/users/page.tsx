"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Users, Plus, Trash2, Edit2, Shield, Search, X, Loader2, UserPlus, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "INSTRUCTOR" | "MEMBER";
  createdAt: string;
};

export default function UsersPage() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(t("users.confirmDelete"))) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(t("users.deleteFailed"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";

      const method = editingUser ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Operation failed");
      }

      await fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setFormData({ name: user.name || "", email: user.email, password: "", role: user.role });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({ name: "", email: "", password: "", role: "MEMBER" });
    setEditingUser(null);
  }

  const roleConfig = {
    ADMIN: { color: "bg-gradient-to-r from-rose-500 to-pink-500", text: "text-white", icon: "👑" },
    EDITOR: { color: "bg-gradient-to-r from-blue-500 to-cyan-500", text: "text-white", icon: "✏️" },
    INSTRUCTOR: { color: "bg-gradient-to-r from-violet-500 to-purple-500", text: "text-white", icon: "🎓" },
    MEMBER: { color: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", icon: "👤" },
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-blue-500/25">
              <Users size={24} />
            </div>
            {t("users.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {t("users.description")}
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
          <UserPlus size={18} />
          <span>{t("users.addNew")}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t("nav.roles.ADMIN"), count: users.filter(u => u.role === "ADMIN").length, color: "from-rose-500 to-pink-500", icon: "👑" },
          { label: t("nav.roles.EDITOR"), count: users.filter(u => u.role === "EDITOR").length, color: "from-blue-500 to-cyan-500", icon: "✏️" },
          { label: t("nav.roles.INSTRUCTOR"), count: users.filter(u => u.role === "INSTRUCTOR").length, color: "from-violet-500 to-purple-500", icon: "🎓" },
          { label: t("nav.roles.MEMBER"), count: users.filter(u => u.role === "MEMBER").length, color: "from-slate-500 to-slate-600", icon: "👤" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.count}</div>
                <div className="text-xs font-medium text-slate-500">{stat.label}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
        <input
          type="text"
          placeholder={t("members.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className={`px-6 py-4 font-bold text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t("users.name")}</th>
                <th className={`px-6 py-4 font-bold text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t("users.email")}</th>
                <th className={`px-6 py-4 font-bold text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t("users.role")}</th>
                <th className={`px-6 py-4 font-bold text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}>{t("users.joinDate")}</th>
                <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 text-center">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="animate-spin" size={20} />
                      <span>{t("users.loading")}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Users className="mx-auto mb-2 text-slate-300 dark:text-slate-700" size={40} />
                    {t("users.empty")}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleConfig[user.role].color} flex items-center justify-center text-sm font-bold ${roleConfig[user.role].text}`}>
                          {user.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {user.name || t("users.noName")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${roleConfig[user.role].color} ${roleConfig[user.role].text}`}>
                        <span>{roleConfig[user.role].icon}</span>
                        {t(`nav.roles.${user.role}` as any)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "ru-RU")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title={t("users.edit")}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          title={t("users.delete")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white">
                      {editingUser ? <Edit2 size={20} /> : <UserPlus size={20} />}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {editingUser ? t("users.editUser") : t("users.addUser")}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("users.name")}</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("users.email")}</label>
                  <input
                    type="email"
                    required
                    disabled={!!editingUser}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {t("users.password")} {editingUser && <span className="text-slate-400 font-normal">({t("users.passwordHint")})</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("users.role")}</label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="MEMBER">{t("nav.roles.MEMBER")}</option>
                      <option value="EDITOR">{t("nav.roles.EDITOR")}</option>
                      <option value="INSTRUCTOR">{t("nav.roles.INSTRUCTOR")}</option>
                      <option value="ADMIN">{t("nav.roles.ADMIN")}</option>
                    </select>
                    <ChevronDown className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} size={18} />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>{t("users.saving")}</span>
                      </>
                    ) : (
                      <span>{t("users.save")}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
                  >
                    {t("users.cancel")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
