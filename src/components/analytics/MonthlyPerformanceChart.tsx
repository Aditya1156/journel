"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";

interface MonthlyPerformanceChartProps {
  trades: Trade[];
  months?: number;
}

export function MonthlyPerformanceChart({ trades, months = 12 }: MonthlyPerformanceChartProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN" && t.exitTime);

  // Get last N months
  const now = new Date();
  const startDate = startOfMonth(subMonths(now, months - 1));
  const monthIntervals = eachMonthOfInterval({
    start: startDate,
    end: now,
  });

  // Calculate stats for each month
  const monthlyData = monthIntervals.map((monthStart) => {
    const monthEnd = endOfMonth(monthStart);
    const monthTrades = closedTrades.filter((t) => {
      const exitDate = new Date(t.exitTime!);
      return exitDate >= monthStart && exitDate <= monthEnd;
    });

    const pnl = monthTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const wins = monthTrades.filter((t) => t.result === "WIN").length;
    const winRate = monthTrades.length > 0 ? (wins / monthTrades.length) * 100 : 0;

    return {
      month: format(monthStart, "MMM yy"),
      pnl,
      trades: monthTrades.length,
      winRate,
      wins,
      losses: monthTrades.length - wins,
    };
  });

  // Calculate cumulative P&L
  let cumulative = 0;
  const dataWithCumulative = monthlyData.map((d) => {
    cumulative += d.pnl;
    return { ...d, cumulative };
  });

  // Calculate best and worst month
  const bestMonth = monthlyData.reduce(
    (best, m) => (m.pnl > best.pnl ? m : best),
    monthlyData[0] || { pnl: 0, month: "N/A" }
  );
  const worstMonth = monthlyData.reduce(
    (worst, m) => (m.pnl < worst.pnl ? m : worst),
    monthlyData[0] || { pnl: 0, month: "N/A" }
  );
  const avgMonthlyPnL = monthlyData.reduce((sum, m) => sum + m.pnl, 0) / monthlyData.length;
  const profitableMonths = monthlyData.filter((m) => m.pnl > 0).length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className={`text-sm ${data.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
            P&L: {data.pnl >= 0 ? "+" : ""}${data.pnl.toFixed(2)}
          </p>
          <p className="text-sm">Trades: {data.trades}</p>
          <p className="text-sm">Win Rate: {data.winRate.toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">
            Cumulative: ${data.cumulative.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Monthly Performance</CardTitle>
            <p className="text-sm text-muted-foreground">
              Month-by-month P&L with cumulative line
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground">Best Month</p>
              <p className="font-bold text-green-600">
                +${bestMonth.pnl.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">{bestMonth.month}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground">Worst Month</p>
              <p className="font-bold text-red-600">
                ${worstMonth.pnl.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">{worstMonth.month}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground">Avg Monthly</p>
              <p className={`font-bold ${avgMonthlyPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${avgMonthlyPnL.toFixed(0)}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground">Profitable</p>
              <p className="font-bold">
                {profitableMonths}/{monthlyData.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {((profitableMonths / monthlyData.length) * 100).toFixed(0)}%
              </p>
            </motion.div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dataWithCumulative}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="pnl" name="Monthly P&L" radius={[4, 4, 0, 0]}>
                {dataWithCumulative.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
                  />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                name="Cumulative P&L"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
