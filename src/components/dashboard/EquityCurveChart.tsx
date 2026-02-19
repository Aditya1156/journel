"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Trade } from "@/mock/trades";
import { format } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EquityCurveChartProps {
  trades: Trade[];
  initialBalance?: number;
}

export function EquityCurveChart({
  trades,
  initialBalance = 10000,
}: EquityCurveChartProps) {
  // Sort trades by exit time and calculate cumulative P&L
  const closedTrades = trades
    .filter((t) => t.result !== "OPEN" && t.exitTime)
    .sort(
      (a, b) =>
        new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime()
    );

  let runningBalance = initialBalance;
  const equityData = closedTrades.map((trade, index) => {
    runningBalance += trade.pnl || 0;
    return {
      date: format(new Date(trade.exitTime!), "MMM dd"),
      fullDate: format(new Date(trade.exitTime!), "MMM dd, yyyy"),
      balance: runningBalance,
      pnl: trade.pnl || 0,
      trade: trade.symbol,
      tradeNumber: index + 1,
    };
  });

  // Add starting point
  if (equityData.length > 0) {
    equityData.unshift({
      date: "Start",
      fullDate: "Initial Balance",
      balance: initialBalance,
      pnl: 0,
      trade: "",
      tradeNumber: 0,
    });
  }

  const currentBalance =
    equityData.length > 0 ? equityData[equityData.length - 1].balance : initialBalance;
  const totalReturn = ((currentBalance - initialBalance) / initialBalance) * 100;
  const isPositive = totalReturn >= 0;

  // Calculate peak and drawdown
  let peak = initialBalance;
  let maxDrawdown = 0;
  equityData.forEach((point) => {
    if (point.balance > peak) peak = point.balance;
    const drawdown = ((peak - point.balance) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.fullDate}</p>
          {data.trade && (
            <p className="text-sm text-muted-foreground">Trade: {data.trade}</p>
          )}
          <p className="text-sm font-semibold">
            Balance: ${data.balance.toFixed(2)}
          </p>
          {data.pnl !== 0 && (
            <p
              className={`text-sm ${
                data.pnl > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              P&L: {data.pnl > 0 ? "+" : ""}${data.pnl.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Equity Curve</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Account balance over time
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span
              className={`text-2xl font-bold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {totalReturn.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Max Drawdown: {maxDrawdown.toFixed(2)}%
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {equityData.length > 1 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? "#22c55e" : "#ef4444"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={initialBalance}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke={isPositive ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Complete at least 2 trades to see your equity curve</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
