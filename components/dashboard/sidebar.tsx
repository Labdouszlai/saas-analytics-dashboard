"use client"

import {
  Activity,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Customers", icon: Users, active: false },
  { label: "Transactions", icon: CreditCard, active: false },
  { label: "Activity", icon: Activity, active: false },
  { label: "Settings", icon: Settings, active: false },
]

export function DashboardSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Activity className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Pulse
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
        {NAV.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
            aria-current={item.active ? "page" : undefined}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-sidebar-accent/60 p-3">
          <p className="text-sm font-medium text-sidebar-foreground">Pro plan</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Unlimited dashboards &amp; exports
          </p>
        </div>
      </div>
    </aside>
  )
}
