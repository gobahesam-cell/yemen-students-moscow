"use client";

import { ChartCard, SimpleBarChart, SimpleLineChart, SimpleDonutChart } from "./Charts";
import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Weekly Trend */}
            <ChartCard title={c("weeklyTitle")} subtitle={c("weeklySubtitle")}>
                <SimpleLineChart data={weeklyData} color="#3b82f6" height={160} />
                <div className="flex justify-between mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
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
                <SimpleDonutChart data={statusData} size={180} />
            </ChartCard>

            {/* Categories */}
            <ChartCard title={c("categoriesTitle")} subtitle={c("categoriesSubtitle")}>
                <SimpleBarChart data={categoryData} />
            </ChartCard>

            {/* Growth Stats */}
            <ChartCard title={c("growthTitle")} subtitle={c("growthSubtitle")}>
                <SimpleLineChart data={[5, 8, 12, 10, 15, 18, stats.usersCount]} color="#10b981" height={160} />
                <div className="flex items-center justify-between mt-10 p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 shadow-inner">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-600/50 dark:text-emerald-400/50 uppercase tracking-[0.2em] leading-none mb-2">{c("growthRate")}</span>
                        <div className="text-3xl font-black text-emerald-500 tracking-tighter leading-none">+24%</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <TrendingUp size={24} className="text-emerald-500" />
                    </div>
                </div>
            </ChartCard>
        </div>
    );
}
