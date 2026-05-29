import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"

type Transaction = {
  id: number
  customer: string
  email: string
  amount: string
  status: string
  plan: string
  createdAt: Date
}

const STATUS_STYLES: Record<string, string> = {
  succeeded: "bg-primary/15 text-primary border-transparent",
  pending: "bg-chart-4/15 text-chart-4 border-transparent",
  refunded: "bg-muted text-muted-foreground border-transparent",
  failed: "bg-destructive/15 text-destructive border-transparent",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Recent transactions</h2>
          <p className="text-sm text-muted-foreground">Latest billing activity</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 border border-border">
                      <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                        {initials(tx.customer)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{tx.customer}</p>
                      <p className="truncate text-xs text-muted-foreground">{tx.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{tx.plan}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize", STATUS_STYLES[tx.status] ?? "")}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-medium tabular-nums text-foreground">
                  {formatCurrency(Number(tx.amount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
