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
  ReferenceLine,
} from "recharts";
import { Trade } from "@/mock/trades";
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from "date-fns";

interface WeeklyPnLChartProps {
  trades: Trade[];
  weeks?: number;
}

export function WeeklyPnLChart({ trades, weeks = 8 }: WeeklyPnLChartProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN" && t.exitTime);

  // Get last N weeks
  const now = new Date();
  const startDate = subWeeks(startOfWeek(now), weeks - 1);
  const weekIntervals = eachWeekOfInterval({
    start: startDate,
    end: now,
  });

  // Calculate P&L for each week
  const weeklyData = weekIntervals.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart);
    const weekTrades = closedTrades.filter((t) => {
      const exitDate = new Date(t.exitTime!);
      return exitDate >= weekStart && exitDate <= weekEnd;
    });

    const pnl = weekTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const tradeCount = weekTrades.length;
    const wins = weekTrades.filter((t) => t.result === "WIN").length;
    const winRate = tradeCount > 0 ? (wins / tradeCount) * 100 : 0;

    return {
      week: format(weekStart, "MMM d"),
      pnl,
      tradeCount,
      winRate,
      fullDate: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
    };
  });

  const maxPnL = Math.max(...weeklyData.map((d) => Math.abs(d.pnl)));
  const totalPnL = weeklyData.reduce((sum, d) => sum + d.pnl, 0);
  const avgPnL = totalPnL / weeklyData.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.fullDate}</p>
          <p
            className={`text-sm font-semibold ${
              data.pnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            P&L: {data.pnl >= 0 ? "+" : ""}${data.pnl.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Trades: {data.tradeCount}
          </p>
          <p className="text-sm text-muted-foreground">
            Win Rate: {data.winRate.toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Count profitable weeks
  const profitableWeeks = weeklyData.filter((d) => d.pnl > 0).length;
  const profitableWeeksPercent = (profitableWeeks / weeklyData.length) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Weekly Performance</CardTitle>
          <p className="text-sm text-muted-foreground">P&L by week</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted-foreground">
            {profitableWeeks}/{weeklyData.length} profitable weeks
          </p>
          <p
            className={`font-medium ${
              profitableWeeksPercent >= 50 ? "text-green-600" : "text-red-600"
            }`}
          >
            {profitableWeeksPercent.toFixed(0)}% win rate
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="week"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <ReferenceLine
                y={avgPnL}
                stroke="hsl(var(--primary))"
                strokeDasharray="5 5"
                label={{
                  value: "Avg",
                  position: "right",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
