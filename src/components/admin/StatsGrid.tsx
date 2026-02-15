"use client";

import { motion } from "framer-motion";
import { StatCard, statIcons } from "./StatCard";
import { useTranslations, useLocale } from "next-intl";

interface StatsGridProps {
    stats: {
        usersCount: number;
        publishedCount: number;
        draftsCount: number;
        pinnedCount: number;
        studentsCount?: number;
        coursesCount?: number;
    };
    userRole?: string;
}

export function StatsGrid({ stats, userRole = "ADMIN" }: StatsGridProps) {
    const t = useTranslations("Admin.stats");
    const locale = useLocale();
    const isRTL = locale === "ar";

    // البطاقات الأساسية
    const allCards = [
        {
            id: "users",
            title: t("users"),
            value: stats.usersCount,
            icon: statIcons.users,
            color: "blue" as const,
            trend: "+12%",
            roles: ["ADMIN"], // فقط الأدمن يرى هذا
        },
        {
            id: "students",
            title: t("students"),
            value: stats.studentsCount ?? 0,
            icon: statIcons.users,
            color: "green" as const,
            trend: "+8%",
            roles: ["ADMIN", "INSTRUCTOR"], // الأدمن والمدرب
        },
        {
            id: "news",
            title: t("news"),
            value: stats.publishedCount,
            icon: statIcons.news,
            color: "orange" as const,
            trend: "+5%",
            roles: ["ADMIN", "EDITOR"], // الأدمن والمحرر
        },
        {
            id: "courses",
            title: t("courses"),
            value: stats.coursesCount ?? 0,
            icon: statIcons.drafts,
            color: "purple" as const,
            trend: t("active"),
            roles: ["ADMIN", "INSTRUCTOR"], // الأدمن والمدرب
        },
        {
            id: "drafts",
            title: t("drafts"),
            value: stats.draftsCount,
            icon: statIcons.drafts,
            color: "yellow" as const,
            trend: t("drafts"),
            roles: ["ADMIN", "EDITOR"], // الأدمن والمحرر
        },
        {
            id: "pinned",
            title: t("pinned"),
            value: stats.pinnedCount,
            icon: statIcons.pinned,
            color: "cyan" as const,
            trend: t("pinned"),
            roles: ["ADMIN", "EDITOR"], // الأدمن والمحرر
        },
    ];

    // فلترة البطاقات حسب الدور
    const filteredCards = allCards.filter(card => card.roles.includes(userRole));

    return (
        <motion.div
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10"
        >
            {filteredCards.map((card, index) => (
                <StatCard
                    key={card.id}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    color={card.color}
                    trend={card.trend}
                    index={index}
                />
            ))}
        </motion.div>
    );
}
