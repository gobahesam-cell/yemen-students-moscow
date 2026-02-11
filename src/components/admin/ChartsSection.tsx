"use client";

import { ChartCard, SimpleBarChart, SimpleLineChart, SimpleDonutChart } from "./Charts";
import { useTranslations } from "next-intl";

interface ChartsSectionProps {
    stats: {
        usersCount: number;
        publishedCount: number;
        draftsCount: number;
        pinnedCount: number;
    };
}

export function ChartsSection({ stats }: ChartsSectionProps) {
    const t = useTranslations("Admin");
    const c = useTranslations("Admin.charts");

    // Sample data for charts
    const weeklyData = [12, 19, 8, 25, 15, 30, 22];

    const categoryData = [
        { label: c("generalNews"), value: stats.publishedCount, color: "#3b82f6" },
        { label: c("announcements"), value: Math.floor(stats.publishedCount * 0.3), color: "#10b981" },
        { label: c("eventsLabel"), value: Math.floor(stats.publishedCount * 0.2), color: "#f59e0b" },
    ];

    const statusData = [
        { label: c("published"), value: stats.publishedCount, color: "#10b981" },
        { label: c("draftLabel"), value: stats.draftsCount, color: "#f59e0b" },
        { label: c("pinnedLabel"), value: stats.pinnedCount, color: "#8b5cf6" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trend */}
            <ChartCard title={c("weeklyTitle")} subtitle={c("weeklySubtitle")}>
                <SimpleLineChart data={weeklyData} color="#3b82f6" height={140} />
                <div className="flex justify-between mt-4 text-xs text-slate-400">
                    <span>{c("sat")}</span>
                    <span>{c("sun")}</span>
                    <span>{c("mon")}</span>
                    <span>{c("tue")}</span>
                    <span>{c("wed")}</span>
                    <span>{c("thu")}</span>
                    <span>{c("fri")}</span>
                </div>
            </ChartCard>

            {/* Status Distribution */}
            <ChartCard title={c("statusTitle")} subtitle={c("statusSubtitle")}>
                <SimpleDonutChart data={statusData} />
            </ChartCard>

            {/* Categories */}
            <ChartCard title={c("categoriesTitle")} subtitle={c("categoriesSubtitle")}>
                <SimpleBarChart data={categoryData} />
            </ChartCard>

            {/* Growth Stats */}
            <ChartCard title={c("growthTitle")} subtitle={c("growthSubtitle")}>
                <SimpleLineChart data={[5, 8, 12, 10, 15, 18, stats.usersCount]} color="#10b981" height={140} />
                <div className="flex items-center justify-between mt-4 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl">
                    <span className="text-sm text-green-700 dark:text-green-400">{c("growthRate")}</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">+24%</span>
                </div>
            </ChartCard>
        </div>
    );
}

