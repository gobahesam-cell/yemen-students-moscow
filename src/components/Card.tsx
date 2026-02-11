import Image from "next/image";

type Props = {
  title: string;
  desc?: string;
  image?: string;
  footer?: React.ReactNode;
};

export default function Card({ title, desc, image, footer }: Props) {
  return (
    <div className="group rounded-[2rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-1">
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-yellow-600 transition-colors">
          {title}
        </h3>
        {desc ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
            {desc}
          </p>
        ) : null}
        {footer ? (
          <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
