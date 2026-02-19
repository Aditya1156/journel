"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";

interface PerformanceByMarketProps {
  trades: Trade[];
}

interface MarketStats {
  market: string;
  totalPnL: number;
  trades: number;
  winRate: number;
  avgPnL: number;
}

export function PerformanceByMarket({ trades }: PerformanceByMarketProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN");

  // Calculate stats by market
  const marketMap = new Map<string, Trade[]>();
  closedTrades.forEach((trade) => {
    const existing = marketMap.get(trade.market) || [];
    existing.push(trade);
    marketMap.set(trade.market, existing);
  });

  const marketStats: MarketStats[] = Array.from(marketMap.entries()).map(
    ([market, marketTrades]) => {
      const wins = marketTrades.filter((t) => t.result === "WIN").length;
      const totalPnL = marketTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

      return {
        market,
        totalPnL,
        trades: marketTrades.length,
        winRate: (wins / marketTrades.length) * 100,
        avgPnL: totalPnL / marketTrades.length,
      };
    }
  );

  // Sort by total P&L
  marketStats.sort((a, b) => b.totalPnL - a.totalPnL);

  // Prepare pie chart data for trade distribution
  const pieData = marketStats.map((stat) => ({
    name: stat.market,
    value: stat.trades,
  }));

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.market}</p>
          <p className="text-sm">
            P&L:{" "}
            <span className={data.totalPnL >= 0 ? "text-green-600" : "text-red-600"}>
              ${data.totalPnL.toFixed(2)}
            </span>
          </p>
          <p className="text-sm">Trades: {data.trades}</p>
          <p className="text-sm">Win Rate: {data.winRate.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance by Market</CardTitle>
        <p className="text-sm text-muted-foreground">
          P&L breakdown across different markets
        </p>
      </CardHeader>
      <CardContent>
        {marketStats.length > 0 ? (
          <div className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="market"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="totalPnL" radius={[0, 4, 4, 0]}>
                    {marketStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.totalPnL >= 0 ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Market Stats Table */}
            <div className="grid gap-2">
              {marketStats.map((stat) => (
                <div
                  key={stat.market}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{stat.market}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {stat.trades} trades
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">
                        Win Rate:{" "}
                      </span>
                      <span className="text-sm font-medium">
                        {stat.winRate.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      className={`font-semibold ${
                        stat.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.totalPnL >= 0 ? "+" : ""}${stat.totalPnL.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>No closed trades yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
