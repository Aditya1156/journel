"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";

interface DrawdownChartProps {
  trades: Trade[];
  initialBalance?: number;
}

export function DrawdownChart({ trades, initialBalance = 10000 }: DrawdownChartProps) {
  const closedTrades = trades
    .filter((t) => t.result !== "OPEN" && t.exitTime)
    .sort(
      (a, b) =>
        new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime()
    );

  // Calculate equity and drawdown
  let runningBalance = initialBalance;
  let peak = initialBalance;
  
  const equityData = closedTrades.map((trade) => {
    runningBalance += trade.pnl || 0;
    if (runningBalance > peak) peak = runningBalance;
    const drawdown = ((peak - runningBalance) / peak) * 100;
    
    return {
      date: format(new Date(trade.exitTime!), "MMM dd"),
      fullDate: format(new Date(trade.exitTime!), "MMM dd, yyyy"),
      balance: runningBalance,
      peak,
      drawdown: -drawdown, // Negative for visual
      drawdownPercent: drawdown,
    };
  });

  // Calculate max drawdown
  const maxDrawdown = Math.max(
    ...equityData.map((d) => d.drawdownPercent)
  );

  // Current drawdown
  const currentDrawdown = equityData.length > 0
    ? equityData[equityData.length - 1].drawdownPercent
    : 0;

  // Days in drawdown
  let daysInDrawdown = 0;
  for (let i = equityData.length - 1; i >= 0; i--) {
    if (equityData[i].drawdownPercent > 0) {
      daysInDrawdown++;
    } else {
      break;
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.fullDate}</p>
          <p className="text-sm">Balance: ${data.balance.toFixed(2)}</p>
          <p className="text-sm">Peak: ${data.peak.toFixed(2)}</p>
          <p className="text-sm text-red-600">
            Drawdown: -{data.drawdownPercent.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Drawdown Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track underwater periods and recovery
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Max Drawdown</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-red-600"
              >
                -{maxDrawdown.toFixed(2)}%
              </motion.p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-lg font-bold ${
                  currentDrawdown > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {currentDrawdown > 0 ? `-${currentDrawdown.toFixed(2)}%` : "At Peak"}
              </motion.p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Days in DD</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-bold"
              >
                {daysInDrawdown}
              </motion.p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityData}>
              <defs>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={["dataMin", 0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <ReferenceLine
                y={-maxDrawdown}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{
                  value: `Max: -${maxDrawdown.toFixed(1)}%`,
                  position: "right",
                  fill: "#ef4444",
                  fontSize: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#drawdownGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
