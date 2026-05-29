"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatDate, formatNumber } from "@/lib/format"

const config = {
  sessions: { label: "Sessions", color: "var(--chart-2)" },
  newUsers: { label: "New users", color: "var(--chart-1)" },
} satisfies ChartConfig

export function TrafficChart({
  data,
}: {
  data: { day: string; sessions: number; newUsers: number }[]
}) {
  return (
    <Card className="p-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Sessions &amp; new users</h2>
        <p className="text-sm text-muted-foreground">Engagement over the last 30 days</p>
      </div>

      <ChartContainer config={config} className="mt-4 h-[260px] w-full">
        <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
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
            width={40}
            tickFormatter={(v) => formatNumber(v, true)}
          />
          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={(v) => formatDate(v as string)} />}
          />
          <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="newUsers" fill="var(--color-newUsers)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
