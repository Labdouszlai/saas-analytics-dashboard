"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrency, formatDate } from "@/lib/format"

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RevenueChart({
  data,
}: {
  data: { day: string; revenue: number }[]
}) {
  const total = data.reduce((s, d) => s + d.revenue, 0)

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">Revenue over time</h2>
          <p className="text-sm text-muted-foreground">Daily gross revenue, last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {formatCurrency(total)}
          </p>
          <p className="text-xs text-muted-foreground">total this period</p>
        </div>
      </div>

      <ChartContainer config={config} className="mt-4 h-[260px] w-full">
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(v) => formatDate(v)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={48}
            tickFormatter={(v) => formatCurrency(v, true)}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(v) => formatDate(v as string)}
                formatter={(value) => [formatCurrency(Number(value)), " Revenue"]}
              />
            }
          />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            fill="url(#fillRevenue)"
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}
