"use client";

import { Trade } from "@/mock/trades";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpDown, Eye } from "lucide-react";

interface TradeTableProps {
  trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  if (trades.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">No trades found</h3>
          <p className="text-muted-foreground mb-4">
            Add your first trade to get started!
          </p>
          <Button asChild>
            <Link href="/journal/add">Add Trade</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Symbol
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Market</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">Entry</TableHead>
            <TableHead className="text-right">Exit</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <Link
                  href={`/journal/${trade.id}`}
                  className="hover:underline font-semibold"
                >
                  {trade.symbol}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{trade.market}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={trade.side === "LONG" ? "default" : "destructive"}
                >
                  {trade.side}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                ${trade.entryPrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : "-"}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-sm font-semibold ${
                  trade.pnl
                    ? trade.pnl > 0
                      ? "text-green-600"
                      : "text-red-600"
                    : ""
                }`}
              >
                {trade.pnl
                  ? `${trade.pnl > 0 ? "+" : ""}$${trade.pnl.toFixed(2)}`
                  : "-"}
              </TableCell>
              <TableCell>
                {trade.result && (
                  <Badge
                    variant={
                      trade.result === "WIN"
                        ? "default"
                        : trade.result === "LOSS"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {trade.result}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(trade.entryTime).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/journal/${trade.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
