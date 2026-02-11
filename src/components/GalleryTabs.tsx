"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import ImageGrid from "@/components/ImageGrid";
import VideoGrid from "@/components/VideoGrid";

type Tab = "photos" | "videos";

export default function GalleryTabs() {
  const [tab, setTab] = useState<Tab>("photos");
  const locale = useLocale();

  const photosLabel = locale === "ar" ? "صور" : "Фото";
  const videosLabel = locale === "ar" ? "فيديو" : "Видео";

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("photos")}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm",
            tab === "photos"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-slate-50",
          ].join(" ")}
        >
          {photosLabel}
        </button>

        <button
          type="button"
          onClick={() => setTab("videos")}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm",
            tab === "videos"
              ? "bg-slate-900 text-white"
              : "bg-white hover:bg-slate-50",
          ].join(" ")}
        >
          {videosLabel}
        </button>
      </div>

      {tab === "photos" ? <ImageGrid /> : <VideoGrid />}
    </div>
  );
}