"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
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
import { format, parseISO } from "date-fns";

interface ConsistencyTrackerProps {
  trades: Trade[];
}

export function ConsistencyTracker({ trades }: ConsistencyTrackerProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN" && t.pnl !== null);

  // Calculate rolling metrics (e.g., 10-trade rolling average)
  const windowSize = 10;
  const rollingData = closedTrades.map((trade, index) => {
    const startIndex = Math.max(0, index - windowSize + 1);
    const window = closedTrades.slice(startIndex, index + 1);
    
    const avgPnL = window.reduce((sum, t) => sum + (t.pnl || 0), 0) / window.length;
    const wins = window.filter((t) => t.result === "WIN").length;
    const winRate = (wins / window.length) * 100;
    
    // Calculate variance within window
    const pnlValues = window.map((t) => t.pnl || 0);
    const mean = avgPnL;
    const variance = pnlValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / pnlValues.length;
    const stdDev = Math.sqrt(variance);

    return {
      tradeNum: index + 1,
      date: trade.exitTime ? format(new Date(trade.exitTime), "MMM d") : `Trade ${index + 1}`,
      avgPnL,
      winRate,
      stdDev,
      pnl: trade.pnl || 0,
    };
  });

  // Calculate overall consistency score (lower variance = more consistent)
  const overallPnL = closedTrades.map((t) => t.pnl || 0);
  const overallMean = overallPnL.reduce((sum, v) => sum + v, 0) / overallPnL.length || 0;
  const overallVariance = overallPnL.reduce(
    (sum, v) => sum + Math.pow(v - overallMean, 2),
    0
  ) / overallPnL.length || 0;
  const coefficientOfVariation = overallMean !== 0 
    ? (Math.sqrt(overallVariance) / Math.abs(overallMean)) * 100 
    : 0;

  // Score from 0-100 (lower CV = higher consistency score)
  const consistencyScore = Math.max(0, Math.min(100, 100 - coefficientOfVariation));

  // Identify if trader is becoming more or less consistent
  const firstHalf = rollingData.slice(0, Math.floor(rollingData.length / 2));
  const secondHalf = rollingData.slice(Math.floor(rollingData.length / 2));
  const firstHalfAvgStdDev = firstHalf.reduce((sum, d) => sum + d.stdDev, 0) / firstHalf.length || 0;
  const secondHalfAvgStdDev = secondHalf.reduce((sum, d) => sum + d.stdDev, 0) / secondHalf.length || 0;
  const isImprovingConsistency = secondHalfAvgStdDev < firstHalfAvgStdDev;

  const getConsistencyGrade = (score: number) => {
    if (score >= 80) return { grade: "A", label: "Excellent", color: "text-green-600" };
    if (score >= 60) return { grade: "B", label: "Good", color: "text-blue-600" };
    if (score >= 40) return { grade: "C", label: "Average", color: "text-yellow-600" };
    if (score >= 20) return { grade: "D", label: "Needs Work", color: "text-orange-600" };
    return { grade: "F", label: "Inconsistent", color: "text-red-600" };
  };

  const grade = getConsistencyGrade(consistencyScore);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label} - Trade #{data.tradeNum}</p>
          <p className="text-sm">
            Rolling Avg P&L:{" "}
            <span className={data.avgPnL >= 0 ? "text-green-600" : "text-red-600"}>
              ${data.avgPnL.toFixed(2)}
            </span>
          </p>
          <p className="text-sm">
            Rolling Win Rate: {data.winRate.toFixed(0)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Volatility: ${data.stdDev.toFixed(2)}
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
            <CardTitle className="text-lg">Consistency Tracker</CardTitle>
            <p className="text-sm text-muted-foreground">
              {windowSize}-trade rolling performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className={`text-3xl font-bold ${grade.color}`}
              >
                {grade.grade}
              </motion.div>
              <p className="text-xs text-muted-foreground">{grade.label}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Score</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold"
              >
                {consistencyScore.toFixed(0)}
              </motion.p>
            </div>
            <Badge variant={isImprovingConsistency ? "default" : "secondary"}>
              {isImprovingConsistency ? "📈 Improving" : "📊 Stable"}
            </Badge>
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
            <AreaChart data={rollingData}>
              <defs>
                <linearGradient id="consistencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={overallMean}
                stroke="#888"
                strokeDasharray="3 3"
                label={{
                  value: `Avg: $${overallMean.toFixed(0)}`,
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
              <Area
                type="monotone"
                dataKey="avgPnL"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#consistencyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground">Avg P&L</p>
            <p className={`font-bold ${overallMean >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${overallMean.toFixed(2)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground">Std Deviation</p>
            <p className="font-bold">${Math.sqrt(overallVariance).toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground">CV Ratio</p>
            <p className="font-bold">{coefficientOfVariation.toFixed(0)}%</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
