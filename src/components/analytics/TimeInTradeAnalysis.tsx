"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface TimeInTradeAnalysisProps {
  trades: Trade[];
}

export function TimeInTradeAnalysis({ trades }: TimeInTradeAnalysisProps) {
  const closedTrades = trades.filter(
    (t) => t.result !== "OPEN" && t.entryTime && t.exitTime
  );

  // Calculate duration for each trade in minutes
  const tradesWithDuration = closedTrades.map((trade) => {
    const entryDate = new Date(trade.entryTime);
    const exitDate = new Date(trade.exitTime!);
    const durationMinutes = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60);
    return { ...trade, durationMinutes };
  });

  // Group by duration categories
  const categories = [
    { name: "Scalp", min: 0, max: 15, label: "< 15 min" },
    { name: "Short", min: 15, max: 60, label: "15-60 min" },
    { name: "Intraday", min: 60, max: 240, label: "1-4 hours" },
    { name: "Day", min: 240, max: 1440, label: "4-24 hours" },
    { name: "Swing", min: 1440, max: Infinity, label: "> 1 day" },
  ];

  const categoryStats = categories.map((cat) => {
    const catTrades = tradesWithDuration.filter(
      (t) => t.durationMinutes >= cat.min && t.durationMinutes < cat.max
    );
    const wins = catTrades.filter((t) => t.result === "WIN").length;
    const pnl = catTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const avgDuration = catTrades.length > 0
      ? catTrades.reduce((sum, t) => sum + t.durationMinutes, 0) / catTrades.length
      : 0;

    return {
      ...cat,
      trades: catTrades.length,
      wins,
      losses: catTrades.length - wins,
      winRate: catTrades.length > 0 ? (wins / catTrades.length) * 100 : 0,
      pnl,
      avgDuration,
    };
  });

  // Find best performing duration category
  const bestCategory = categoryStats.reduce(
    (best, cat) => (cat.winRate > best.winRate && cat.trades >= 3 ? cat : best),
    categoryStats[0]
  );

  // Calculate overall average holding time
  const totalDuration = tradesWithDuration.reduce(
    (sum, t) => sum + t.durationMinutes,
    0
  );
  const avgHoldingTime = tradesWithDuration.length > 0
    ? totalDuration / tradesWithDuration.length
    : 0;

  // Analyze if longer holds perform better
  const shortHolds = tradesWithDuration.filter((t) => t.durationMinutes < 60);
  const longHolds = tradesWithDuration.filter((t) => t.durationMinutes >= 60);
  const shortWinRate = shortHolds.length > 0
    ? (shortHolds.filter((t) => t.result === "WIN").length / shortHolds.length) * 100
    : 0;
  const longWinRate = longHolds.length > 0
    ? (longHolds.filter((t) => t.result === "WIN").length / longHolds.length) * 100
    : 0;

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    if (minutes < 1440) return `${(minutes / 60).toFixed(1)} hrs`;
    return `${(minutes / 1440).toFixed(1)} days`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time in Trade Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Performance by trade duration
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Avg Hold</p>
              <p className="font-bold">{formatDuration(avgHoldingTime)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Best Duration</p>
              <Badge variant="outline" className="mt-1">
                {bestCategory.name}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {categoryStats.map((cat, index) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              className="relative"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.label}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cat.trades} trades
                  </Badge>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className={`font-bold ${cat.winRate >= 50 ? "text-green-600" : "text-red-600"}`}>
                      {cat.winRate.toFixed(0)}%
                    </p>
                  </div>
                  <div className="text-center w-16">
                    <p className="text-xs text-muted-foreground">W/L</p>
                    <p className="text-sm">
                      <span className="text-green-600">{cat.wins}</span>
                      {" / "}
                      <span className="text-red-600">{cat.losses}</span>
                    </p>
                  </div>
                  <div className="text-center w-20">
                    <p className="text-xs text-muted-foreground">P&L</p>
                    <p className={`font-bold flex items-center justify-center ${cat.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {cat.pnl >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      ${Math.abs(cat.pnl).toFixed(0)}
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.winRate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full ${cat.winRate >= 50 ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            💡 Insight
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            {longWinRate > shortWinRate
              ? `Longer holds (1+ hour) have a ${(longWinRate - shortWinRate).toFixed(0)}% higher win rate. Consider being more patient with your trades.`
              : shortWinRate > longWinRate
              ? `Shorter trades (< 1 hour) perform ${(shortWinRate - longWinRate).toFixed(0)}% better. Your scalping/quick trades are working well.`
              : "Win rates are similar across different holding periods. Your strategy is consistent."}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
