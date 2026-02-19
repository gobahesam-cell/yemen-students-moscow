"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitcherIcon from "@/components/LocaleSwitcherIcon";
import {
    LayoutDashboard,
    Newspaper,
    Calendar,
    GraduationCap,
    Users,
    Image as ImageIcon,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Heart
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AdminSearch } from "./AdminSearch";

const NAV_ITEMS = [
    { href: "/admin", labelKey: "nav.home", icon: LayoutDashboard },
    { href: "/admin/posts", labelKey: "nav.news", icon: Newspaper },
    { href: "/admin/events", labelKey: "nav.events", icon: Calendar },
    { href: "/admin/courses", labelKey: "nav.courses", icon: GraduationCap },
    { href: "/admin/members", labelKey: "nav.members", icon: Users },
    { href: "/admin/media", labelKey: "nav.media", icon: ImageIcon },
    { href: "/admin/support", labelKey: "nav.support", icon: Heart },
    { href: "/admin/settings", labelKey: "nav.settings", icon: Settings },
];

export function AdminLayoutClient({
    children,
    user
}: {
    children: React.ReactNode,
    user?: { name: string, role: string }
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("Admin");
    const locale = useLocale();
    const isRTL = locale === "ar";

    useEffect(() => setMounted(true), []);
    useEffect(() => setSidebarOpen(false), [pathname]);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const filteredItems = NAV_ITEMS.filter(item => {
        if (user?.role === "ADMIN") return true;
        if (user?.role === "EDITOR") {
            return ["/admin", "/admin/posts", "/admin/events", "/admin/media"].includes(item.href);
        }
        if (user?.role === "INSTRUCTOR") {
            return ["/admin", "/admin/courses", "/admin/media"].includes(item.href);
        }
        return item.href === "/admin";
    });

    if (!mounted) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 selection:bg-yellow-500/30" dir={isRTL ? "rtl" : "ltr"}>

            {/* Background Gradient Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            {/* ===== FLOATING SIDEBAR ===== */}
            <AnimatePresence mode="wait">
                {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.aside
                        initial={{ x: isRTL ? 300 : -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isRTL ? 300 : -300, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`
                            fixed inset-y-4 ${isRTL ? 'right-4' : 'left-4'} z-50 w-64 
                            bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                            border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-black/5
                            rounded-[2rem] flex flex-col overflow-hidden
                            lg:sticky lg:top-4 lg:left-auto lg:right-auto lg:h-[calc(100vh-2rem)] lg:my-4 lg:mx-4
                            print:hidden
                        `}
                    >
                        {/* Logo Area */}
                        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 relative bg-yellow-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-300">
                                    <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain invert brightness-0" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-lg leading-tight tracking-tight dark:text-white">
                                        YSM<span className="text-yellow-500">Panel</span>
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t("adminArea")}</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Scroll Area */}
                        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                            {filteredItems.map((item, idx) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 + 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`
                                                relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold
                                                transition-all duration-300 group
                                                ${active
                                                    ? "bg-slate-900 dark:bg-yellow-500 text-white dark:text-black shadow-xl shadow-yellow-500/10"
                                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                                }
                                            `}
                                        >
                                            <Icon size={20} className={`${active ? "scale-110" : "group-hover:scale-110"} transition-transform`} />
                                            <span>{t(item.labelKey as any)}</span>
                                            {active && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className={`absolute ${isRTL ? 'left-2' : 'right-2'} w-1.5 h-1.5 bg-yellow-500 dark:bg-black rounded-full`}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* User Bottom Section */}
                        <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-3 p-3 rounded-2xl">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-yellow-500/20">
                                    {user?.name?.[0] || "U"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                                        {user?.name || t("dashboard")}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {user?.role === "ADMIN" ? t("nav.role") : (t(`nav.roles.${user?.role}` as any) || user?.role)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ===== MAIN CONTENT AREA ===== */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10">

                {/* Modern Header - Sticky/Fixed for Mobile & Desktop */}
                <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-6 lg:px-8 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 print:hidden">
                    {/* Header Left: Menu Toggle & Title */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-900 dark:text-white shadow-xl shadow-black/5 hover:bg-slate-50 transition-colors"
                        >
                            <Menu size={24} />
                        </motion.button>

                        <div className="hidden lg:block">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {t("dashboard")}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {new Date().toLocaleDateString(locale === 'ar' ? 'ar-YE' : 'ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>

                    {/* Integrated Search */}
                    <AdminSearch />

                    {/* Header Right: Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border border-slate-200/50 dark:border-white/5 shadow-sm"
                    >
                        <LocaleSwitcherIcon />
                        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => logoutAction()}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-black transition-all"
                        >
                            <LogOut size={16} />
                            <span className="hidden md:inline uppercase tracking-widest">{t("nav.logout")}</span>
                        </motion.button>
                    </motion.div>
                </header>

                {/* Main Viewport */}
                <div className="flex-1 p-6 lg:p-8 overflow-auto">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.4);
                }
            `}</style>
        </div>
    );
}
