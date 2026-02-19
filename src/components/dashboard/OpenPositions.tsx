"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface OpenPositionsProps {
  trades: Trade[];
}

export function OpenPositions({ trades }: OpenPositionsProps) {
  const openTrades = trades.filter((t) => t.result === "OPEN");

  // Calculate total exposure
  const totalExposure = openTrades.reduce((sum, t) => {
    return sum + t.entryPrice * t.quantity;
  }, 0);

  // Calculate unrealized P&L (using a mock current price - in real app this would come from API)
  const calculateUnrealizedPnL = (trade: Trade) => {
    // Mock current prices - in production, fetch from real-time API
    const mockCurrentPrices: Record<string, number> = {
      NVDA: 492.5,
      AAPL: 178.2,
      BTCUSD: 43500,
      ETHUSD: 2520,
    };

    const currentPrice = mockCurrentPrices[trade.symbol] || trade.entryPrice;
    const pnl =
      trade.side === "LONG"
        ? (currentPrice - trade.entryPrice) * trade.quantity
        : (trade.entryPrice - currentPrice) * trade.quantity;

    const pnlPercent = ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100;

    return {
      currentPrice,
      pnl,
      pnlPercent: trade.side === "LONG" ? pnlPercent : -pnlPercent,
    };
  };

  const totalUnrealizedPnL = openTrades.reduce((sum, t) => {
    return sum + calculateUnrealizedPnL(t).pnl;
  }, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Open Positions
            {openTrades.length > 0 && (
              <Badge variant="secondary">{openTrades.length}</Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Active trades requiring attention
          </p>
        </div>
        {openTrades.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Unrealized P&L</p>
            <p
              className={`text-lg font-bold ${
                totalUnrealizedPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalUnrealizedPnL >= 0 ? "+" : ""}$
              {totalUnrealizedPnL.toFixed(2)}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {openTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium mb-1">No Open Positions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All your trades are closed
            </p>
            <Button asChild size="sm">
              <Link href="/journal/add">Open New Trade</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {openTrades.map((trade) => {
              const { currentPrice, pnl, pnlPercent } = calculateUnrealizedPnL(trade);
              const isProfit = pnl >= 0;

              // Check if approaching stop loss
              const distanceToStop = trade.stopLoss
                ? trade.side === "LONG"
                  ? ((currentPrice - trade.stopLoss) / trade.stopLoss) * 100
                  : ((trade.stopLoss - currentPrice) / currentPrice) * 100
                : null;

              const isNearStop = distanceToStop !== null && distanceToStop < 2;

              return (
                <Link
                  key={trade.id}
                  href={`/journal/${trade.id}`}
                  className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{trade.symbol}</span>
                        <Badge
                          variant={trade.side === "LONG" ? "default" : "destructive"}
                        >
                          {trade.side}
                        </Badge>
                        <Badge variant="outline">{trade.market}</Badge>
                        {isNearStop && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Near Stop
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Entry</p>
                          <p className="font-medium">
                            ${trade.entryPrice.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current</p>
                          <p className="font-medium">${currentPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Qty</p>
                          <p className="font-medium">{trade.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        {trade.stopLoss && (
                          <span className="text-red-600">
                            SL: ${trade.stopLoss.toFixed(2)}
                          </span>
                        )}
                        {trade.target && (
                          <span className="text-green-600">
                            TP: ${trade.target.toFixed(2)}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(new Date(trade.entryTime), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div
                        className={`flex items-center gap-1 ${
                          isProfit ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isProfit ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span className="font-bold">
                          {isProfit ? "+" : ""}${pnl.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isProfit ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isProfit ? "+" : ""}
                        {pnlPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Summary */}
            <div className="pt-3 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Total Exposure: ${totalExposure.toLocaleString()}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/journal?filter=open" className="gap-1">
                  View All <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
