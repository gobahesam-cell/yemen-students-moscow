export type AdminNavItem = {
  label: string
  href: string
  icon?: string
}

export const adminNavItems: AdminNavItem[] = [
  { label: "لوحة التحكم", href: "/admin", icon: "📊" },
  { label: "الأخبار", href: "/admin/posts", icon: "📰" },
  { label: "الفعاليات", href: "/admin/events", icon: "📅" },
  { label: "الدورات التعليمية", href: "/admin/courses", icon: "🎓" },
  { label: "المكتبة والوسائط", href: "/admin/media", icon: "🖼️" },
  { label: "الأعضاء", href: "/admin/members", icon: "👤" },
  { label: "المستخدمون", href: "/admin/users", icon: "👥" },
]
