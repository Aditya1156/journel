"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
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

interface PnLDistributionProps {
  trades: Trade[];
}

export function PnLDistribution({ trades }: PnLDistributionProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN" && t.pnl !== null);

  // Create histogram buckets
  const pnlValues = closedTrades.map((t) => t.pnl || 0);
  const minPnL = Math.min(...pnlValues);
  const maxPnL = Math.max(...pnlValues);
  const range = maxPnL - minPnL;
  const bucketSize = range / 10 || 100;

  const buckets = new Map<number, { min: number; max: number; count: number; trades: Trade[] }>();
  
  for (let i = 0; i < 10; i++) {
    const bucketMin = minPnL + i * bucketSize;
    const bucketMax = minPnL + (i + 1) * bucketSize;
    buckets.set(i, { min: bucketMin, max: bucketMax, count: 0, trades: [] });
  }

  closedTrades.forEach((trade) => {
    const pnl = trade.pnl || 0;
    const bucketIndex = Math.min(Math.floor((pnl - minPnL) / bucketSize), 9);
    const bucket = buckets.get(bucketIndex);
    if (bucket) {
      bucket.count++;
      bucket.trades.push(trade);
    }
  });

  const histogramData = Array.from(buckets.values()).map((bucket) => ({
    range: `$${bucket.min.toFixed(0)}`,
    count: bucket.count,
    min: bucket.min,
    max: bucket.max,
    isPositive: bucket.min >= 0,
    avgPnL: bucket.trades.length > 0
      ? bucket.trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / bucket.trades.length
      : 0,
  }));

  // Calculate statistics
  const mean = pnlValues.length > 0
    ? pnlValues.reduce((sum, v) => sum + v, 0) / pnlValues.length
    : 0;
  const sortedPnL = [...pnlValues].sort((a, b) => a - b);
  const median = sortedPnL.length > 0
    ? sortedPnL[Math.floor(sortedPnL.length / 2)]
    : 0;
  const stdDev = pnlValues.length > 0
    ? Math.sqrt(
        pnlValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / pnlValues.length
      )
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">
            ${data.min.toFixed(0)} to ${data.max.toFixed(0)}
          </p>
          <p className="text-sm">{data.count} trades</p>
          <p className="text-sm text-muted-foreground">
            Avg: ${data.avgPnL.toFixed(2)}
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
            <CardTitle className="text-lg">P&L Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Histogram of trade outcomes
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Mean</p>
              <p className={`font-bold ${mean >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${mean.toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Median</p>
              <p className={`font-bold ${median >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${median.toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Std Dev</p>
              <p className="font-bold">${stdDev.toFixed(0)}</p>
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
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="range"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                label={{
                  value: "Trades",
                  angle: -90,
                  position: "insideLeft",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {histogramData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isPositive ? "#22c55e" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
