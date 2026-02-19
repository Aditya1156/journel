"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from "recharts";

interface WinLossScatterProps {
  trades: Trade[];
}

export function WinLossScatter({ trades }: WinLossScatterProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN");

  const scatterData = closedTrades.map((trade, index) => ({
    x: index + 1,
    y: trade.pnl || 0,
    z: Math.abs(trade.pnl || 0),
    symbol: trade.symbol,
    result: trade.result,
    rr: trade.riskReward || 0,
  }));

  const winData = scatterData.filter((d) => d.result === "WIN");
  const lossData = scatterData.filter((d) => d.result === "LOSS");
  const breakevenData = scatterData.filter((d) => d.result === "BREAKEVEN");

  // Calculate statistics
  const avgWin = winData.length > 0
    ? winData.reduce((sum, d) => sum + d.y, 0) / winData.length
    : 0;
  const avgLoss = lossData.length > 0
    ? lossData.reduce((sum, d) => sum + d.y, 0) / lossData.length
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.symbol}</p>
          <p className={`text-sm ${data.y >= 0 ? "text-green-600" : "text-red-600"}`}>
            P&L: {data.y >= 0 ? "+" : ""}${data.y.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            R:R: {data.rr.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">Trade #{data.x}</p>
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
            <CardTitle className="text-lg">Trade Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Scatter plot of all trades by P&L
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Wins ({winData.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Losses ({lossData.length})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                dataKey="x"
                name="Trade #"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                label={{
                  value: "Trade Number",
                  position: "bottom",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="P&L"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                label={{
                  value: "P&L ($)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <ReferenceLine
                y={avgWin}
                stroke="#22c55e"
                strokeDasharray="5 5"
                label={{
                  value: `Avg Win: $${avgWin.toFixed(0)}`,
                  position: "right",
                  fill: "#22c55e",
                  fontSize: 10,
                }}
              />
              <ReferenceLine
                y={avgLoss}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{
                  value: `Avg Loss: $${avgLoss.toFixed(0)}`,
                  position: "right",
                  fill: "#ef4444",
                  fontSize: 10,
                }}
              />
              <Scatter name="Wins" data={winData} fill="#22c55e" />
              <Scatter name="Losses" data={lossData} fill="#ef4444" />
              <Scatter name="Breakeven" data={breakevenData} fill="#f59e0b" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
