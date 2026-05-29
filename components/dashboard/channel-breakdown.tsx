"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatNumber } from "@/lib/format"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
]

export function ChannelBreakdown({
  data,
}: {
  data: { channel: string; visitors: number }[]
}) {
  const total = data.reduce((s, d) => s + d.visitors, 0)
  const config: ChartConfig = Object.fromEntries(
    data.map((d, i) => [d.channel, { label: d.channel, color: COLORS[i % COLORS.length] }]),
  )

  return (
    <Card className="flex flex-col p-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Traffic by channel</h2>
        <p className="text-sm text-muted-foreground">Visitor acquisition sources</p>
      </div>

      <div className="flex flex-1 flex-col items-center gap-4">
        <ChartContainer config={config} className="mx-auto mt-2 aspect-square h-[180px]">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent formatter={(v, n) => [`${formatNumber(Number(v))}  `, n]} />}
            />
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="channel"
              innerRadius={50}
              outerRadius={88}
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((entry, i) => (
                <Cell key={entry.channel} fill={COLORS[i % COLORS.length]} stroke="var(--card)" />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="w-full space-y-2">
          {data.map((d, i) => (
            <li key={d.channel} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">{d.channel}</span>
              <span className="ml-auto font-medium text-foreground tabular-nums">
                {formatNumber(d.visitors, true)}
              </span>
              <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                {total ? Math.round((d.visitors / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
