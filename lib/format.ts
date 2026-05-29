export function formatCurrency(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value)
}

export function formatNumber(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value)
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
}

export function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
