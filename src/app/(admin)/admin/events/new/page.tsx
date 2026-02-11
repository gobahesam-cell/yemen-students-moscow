"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EventForm } from "@/components/admin/EventForm";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NewEventPage() {
    const t = useTranslations("Admin.eventPages");
    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href="/admin/events" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <ArrowRight size={24} className="rtl:rotate-180" />
                </Link>
                <AdminPageHeader
                    title={t("newEventTitle")}
                    description={t("newEventDesc")}
                />
            </div>

            <EventForm mode="create" />
        </div>
    );
}
