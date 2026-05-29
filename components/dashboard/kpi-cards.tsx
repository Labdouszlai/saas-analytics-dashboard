import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatPercent } from "@/lib/format"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"

export type Kpi = {
  label: string
  value: string
  change: number
  icon: LucideIcon
  hint: string
}

export function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const positive = kpi.change >= 0
        return (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
              <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <kpi.icon className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {kpi.value}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular-nums",
                  positive
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive",
                )}
              >
                {positive ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {formatPercent(kpi.change)}
              </span>
              <span className="text-muted-foreground">{kpi.hint}</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
