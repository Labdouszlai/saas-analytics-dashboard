import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { DollarSign, Users, MousePointerClick, Target } from "lucide-react"

import { auth } from "@/lib/auth"
import {
  ensureSeedData,
  getDailyMetrics,
  getTransactions,
  getTrafficSources,
} from "@/app/actions/analytics"
import { formatCurrency, formatNumber } from "@/lib/format"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { UserMenu } from "@/components/sign-out-button"
import { KpiCards, type Kpi } from "@/components/dashboard/kpi-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TrafficChart } from "@/components/dashboard/traffic-chart"
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown"
import { TransactionsTable } from "@/components/dashboard/transactions-table"

function pctChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  await ensureSeedData()

  const [metrics, transactions, traffic] = await Promise.all([
    getDailyMetrics(60),
    getTransactions(8),
    getTrafficSources(),
  ])

  // Split the 60-day window into current vs previous 30-day periods.
  const half = Math.floor(metrics.length / 2)
  const previous = metrics.slice(0, half)
  const current = metrics.slice(half)

  const sum = (rows: typeof metrics, key: "revenue" | "newUsers" | "sessions" | "orders") =>
    rows.reduce((s, r) => s + Number(r[key]), 0)

  const curRevenue = sum(current, "revenue")
  const curUsers = sum(current, "newUsers")
  const curSessions = sum(current, "sessions")
  const curOrders = sum(current, "orders")
  const prevRevenue = sum(previous, "revenue")
  const prevUsers = sum(previous, "newUsers")
  const prevSessions = sum(previous, "sessions")
  const prevOrders = sum(previous, "orders")

  const curConv = curSessions ? (curOrders / curSessions) * 100 : 0
  const prevConv = prevSessions ? (prevOrders / prevSessions) * 100 : 0

  const kpis: Kpi[] = [
    {
      label: "Total revenue",
      value: formatCurrency(curRevenue),
      change: pctChange(curRevenue, prevRevenue),
      icon: DollarSign,
      hint: "vs prev 30d",
    },
    {
      label: "New users",
      value: formatNumber(curUsers),
      change: pctChange(curUsers, prevUsers),
      icon: Users,
      hint: "vs prev 30d",
    },
    {
      label: "Sessions",
      value: formatNumber(curSessions, true),
      change: pctChange(curSessions, prevSessions),
      icon: MousePointerClick,
      hint: "vs prev 30d",
    },
    {
      label: "Conversion rate",
      value: `${curConv.toFixed(2)}%`,
      change: pctChange(curConv, prevConv),
      icon: Target,
      hint: "vs prev 30d",
    },
  ]

  const chartData = current.map((r) => ({
    day: r.day as unknown as string,
    revenue: Number(r.revenue),
    sessions: r.sessions,
    newUsers: r.newUsers,
  }))

  const firstName = session.user.name?.split(" ")[0] ?? "there"

  return (
    <div className="flex min-h-svh bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Overview</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Welcome back, {firstName}. Here&apos;s your performance snapshot.
            </p>
          </div>
          <UserMenu name={session.user.name} email={session.user.email} />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <KpiCards kpis={kpis} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={chartData} />
            </div>
            <ChannelBreakdown data={traffic} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TrafficChart data={chartData} />
            <TransactionsTable transactions={transactions} />
          </div>
        </main>
      </div>
    </div>
  )
}
