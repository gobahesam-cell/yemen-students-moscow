"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
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
    Search
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const NAV_ITEMS = [
    { href: "/admin", labelKey: "nav.home", icon: LayoutDashboard },
    { href: "/admin/posts", labelKey: "nav.news", icon: Newspaper },
    { href: "/admin/events", labelKey: "nav.events", icon: Calendar },
    { href: "/admin/courses", labelKey: "nav.courses", icon: GraduationCap },
    { href: "/admin/members", labelKey: "nav.members", icon: Users },
    { href: "/admin/media", labelKey: "nav.media", icon: ImageIcon },
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

    // ✅ فلترة العناصر بناءً على الرتبة
    const filteredItems = NAV_ITEMS.filter(item => {
        if (user?.role === "ADMIN") return true;

        if (user?.role === "EDITOR") {
            const allowed = ["/admin", "/admin/posts", "/admin/events", "/admin/media", "/admin/settings"];
            return allowed.includes(item.href);
        }

        if (user?.role === "INSTRUCTOR") {
            const allowed = ["/admin", "/admin/courses", "/admin/media", "/admin/settings"];
            return allowed.includes(item.href);
        }

        // للمستخدم العادي (MEMBER)
        return item.href === "/admin" || item.href === "/admin/settings";
    });

    if (!mounted) {
        return <div className="min-h-screen bg-slate-100 dark:bg-slate-950" />;
    }

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>

            {/* ===== SIDEBAR ===== */}
            <aside className={`
                fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 
                bg-white dark:bg-slate-900 
                border-slate-200 dark:border-slate-800
                ${isRTL ? 'border-l' : 'border-r'}
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
                lg:translate-x-0 lg:static lg:inset-auto
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 relative">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                            YSM<span className="text-yellow-500">Panel</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                    transition-all duration-200
                                    ${active
                                        ? "bg-slate-900 dark:bg-yellow-500 text-white dark:text-black shadow-lg shadow-black/10"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    }
                                `}
                            >
                                <Icon size={18} />
                                <span>{t(item.labelKey as any)}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            {user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {user?.name || t("dashboard")}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                                {user?.role === "ADMIN" ? t("nav.role") : user?.role || "Member"}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== MAIN CONTENT ===== */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-4">
                    {/* Left: Menu + Search */}
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden sm:flex items-center flex-1 max-w-md">
                            <div className="relative w-full">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={t("search")}
                                    className="w-full h-10 pr-10 pl-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <LocaleSwitcherIcon />
                        <ThemeToggle />
                        <button
                            onClick={() => logoutAction()}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">{t("nav.logout")}</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
