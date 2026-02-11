"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems } from "./admin-nav"

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 shrink-0 p-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
        <div className="text-white font-semibold text-lg">لوحة التحكم</div>
        <div className="text-white/60 text-sm mt-1">Yemen Students Moscow</div>

        <nav className="mt-6 space-y-2">
          {adminNavItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2 transition",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-4 text-white/60 text-xs">
          © Admin
        </div>
      </div>
    </aside>
  )
}
