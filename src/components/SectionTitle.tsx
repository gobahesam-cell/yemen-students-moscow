type Props = { title: string; desc?: string; align?: "start" | "center" };

export default function SectionTitle({ title, desc, align = "start" }: Props) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {desc ? (
        <p className="mt-2 text-sm leading-6 text-slate-700">{desc}</p>
      ) : null}
    </div>
  );
}
