import { useLocale } from "next-intl";
import Card from "@/components/Card";

const videos = [
  { id: "ysz5S6PUM-U", titleAr: "فيديو تجريبي 1", titleRu: "Видео 1" },
  { id: "dQw4w9WgXcQ", titleAr: "فيديو تجريبي 2", titleRu: "Видео 2" }
];

export default function VideoGrid() {
  const locale = useLocale();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {videos.map((v) => (
        <Card
          key={v.id}
          title={locale === "ar" ? v.titleAr : v.titleRu}
          footer={
            <div className="mt-3 overflow-hidden rounded-2xl border">
              <iframe
                className="h-56 w-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          }
        />
      ))}
    </div>
  );
}