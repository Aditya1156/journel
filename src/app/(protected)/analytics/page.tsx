"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTrades } from "@/mock/trades";
import {
  AnimatedMetricCard,
  TradingSuggestions,
  PerformanceHeatmap,
  TraderScoreRadar,
  DrawdownChart,
  WinLossScatter,
  PnLDistribution,
  MonthlyPerformanceChart,
  TimeInTradeAnalysis,
  ConsistencyTracker,
} from "@/components/analytics";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Percent,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Zap,
  Brain,
  Filter,
  RefreshCw,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"1W" | "1M" | "3M" | "6M" | "1Y" | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  // Filter trades by time range
  const getFilteredTrades = () => {
    const now = new Date();
    const ranges: Record<string, number> = {
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "6M": 180,
      "1Y": 365,
      "ALL": Infinity,
    };
    const days = ranges[timeRange];
    
    return mockTrades.filter((trade) => {
      if (days === Infinity) return true;
      const tradeDate = new Date(trade.entryTime);
      const diffDays = (now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  };

  const filteredTrades = getFilteredTrades();
  const closedTrades = filteredTrades.filter((t) => t.result !== "OPEN");
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter((t) => t.result === "WIN");
  const losingTrades = closedTrades.filter((t) => t.result === "LOSS");

  // Calculate comprehensive metrics
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
  const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
  const avgRR = filteredTrades
    .filter((t) => t.riskReward)
    .reduce((sum, t, _, arr) => sum + (t.riskReward || 0) / arr.length, 0);

  // Calculate max winning and losing streaks
  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  closedTrades.forEach((trade) => {
    if (trade.result === "WIN") {
      if (currentStreak >= 0) currentStreak++;
      else currentStreak = 1;
      maxWinStreak = Math.max(maxWinStreak, currentStreak);
    } else {
      if (currentStreak <= 0) currentStreak--;
      else currentStreak = -1;
      maxLossStreak = Math.max(maxLossStreak, Math.abs(currentStreak));
    }
  });

  // Best and worst trades
  const bestTrade = closedTrades.reduce((best, t) =>
    (t.pnl || 0) > (best.pnl || 0) ? t : best,
    closedTrades[0] || { pnl: 0 }
  );
  const worstTrade = closedTrades.reduce((worst, t) =>
    (t.pnl || 0) < (worst.pnl || 0) ? t : worst,
    closedTrades[0] || { pnl: 0 }
  );

  // Expectancy
  const expectancy = totalTrades > 0
    ? (winRate / 100 * avgWin) - ((100 - winRate) / 100 * avgLoss)
    : 0;

  const timeRanges = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered performance insights and trading suggestions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Time Range Filter */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="h-7 px-3"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Performance Summary Banner */}
      <motion.div variants={itemVariants}>
        <Card className={`border-l-4 ${totalPnL >= 0 ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/20" : "border-l-red-500 bg-red-50/50 dark:bg-red-950/20"}`}>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className={`p-3 rounded-full ${totalPnL >= 0 ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50"}`}
                >
                  {totalPnL >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                </motion.div>
                <div>
                  <p className="text-sm text-muted-foreground">Performance Summary ({timeRange})</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className={`text-lg font-bold ${winRate >= 50 ? "text-green-600" : "text-red-600"}`}>
                    {winRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Profit Factor</p>
                  <p className={`text-lg font-bold ${profitFactor >= 1 ? "text-green-600" : "text-red-600"}`}>
                    {profitFactor === Infinity ? "" : profitFactor.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Expectancy</p>
                  <p className={`text-lg font-bold ${expectancy >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${expectancy.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-lg font-bold">{totalTrades}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Animated Metric Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <AnimatedMetricCard
          title="Win Rate"
          value={winRate}
          suffix="%"
          icon={Target}
          trend={{ value: 2.5, isPositive: true }}
        />
        <AnimatedMetricCard
          title="Profit Factor"
          value={profitFactor === Infinity ? 99 : profitFactor}
          decimals={2}
          icon={Award}
        />
        <AnimatedMetricCard
          title="Avg Win"
          value={avgWin}
          prefix="$"
          icon={TrendingUp}
        />
        <AnimatedMetricCard
          title="Avg Loss"
          value={avgLoss}
          prefix="$"
          icon={TrendingDown}
        />
        <AnimatedMetricCard
          title="Best Trade"
          value={bestTrade.pnl || 0}
          prefix="$"
          icon={Zap}
        />
        <AnimatedMetricCard
          title="Worst Trade"
          value={Math.abs(worstTrade.pnl || 0)}
          prefix="-$"
          icon={Activity}
        />
        <AnimatedMetricCard
          title="Win Streak"
          value={maxWinStreak}
          icon={TrendingUp}
        />
        <AnimatedMetricCard
          title="Loss Streak"
          value={maxLossStreak}
          icon={TrendingDown}
        />
      </motion.div>

      {/* AI Suggestions */}
      <motion.div variants={itemVariants}>
        <TradingSuggestions trades={filteredTrades} />
      </motion.div>

      {/* Main Charts Section */}
      <motion.div variants={itemVariants}>
        <MonthlyPerformanceChart trades={filteredTrades} months={12} />
      </motion.div>

      {/* Second Row - 2 Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <TraderScoreRadar trades={filteredTrades} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ConsistencyTracker trades={filteredTrades} />
        </motion.div>
      </div>

      {/* Third Row - Heatmap */}
      <motion.div variants={itemVariants}>
        <PerformanceHeatmap trades={filteredTrades} type="hourly" />
      </motion.div>

      {/* Fourth Row - 2 Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <DrawdownChart trades={filteredTrades} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <PnLDistribution trades={filteredTrades} />
        </motion.div>
      </div>

      {/* Fifth Row - 2 Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <WinLossScatter trades={filteredTrades} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <TimeInTradeAnalysis trades={filteredTrades} />
        </motion.div>
      </div>

      {/* Detailed Stats Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: "Total P&L", value: `$${totalPnL.toFixed(2)}`, positive: totalPnL >= 0 },
                { label: "Gross Profit", value: `$${totalWins.toFixed(2)}`, positive: true },
                { label: "Gross Loss", value: `$${totalLosses.toFixed(2)}`, positive: false },
                { label: "Avg Win/Loss", value: avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : "N/A", positive: avgWin > avgLoss },
                { label: "Avg R:R", value: avgRR.toFixed(2), positive: avgRR >= 1 },
                { label: "Win Rate", value: `${winRate.toFixed(1)}%`, positive: winRate >= 50 },
                { label: "Total Trades", value: totalTrades.toString() },
                { label: "Winners", value: winningTrades.length.toString(), positive: true },
                { label: "Losers", value: losingTrades.length.toString(), positive: false },
                { label: "Expectancy", value: `$${expectancy.toFixed(2)}`, positive: expectancy >= 0 },
                { label: "Best Win Streak", value: maxWinStreak.toString(), positive: true },
                { label: "Worst Loss Streak", value: maxLossStreak.toString(), positive: false },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`font-bold ${
                    stat.positive === undefined
                      ? ""
                      : stat.positive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Tips */}
      <motion.div
        variants={itemVariants}
        className="text-center text-sm text-muted-foreground py-4"
      >
        <p>
           <strong>Pro Tip:</strong> Review your analytics weekly to identify patterns and improve your trading strategy.
          Click on any chart to see more details.
        </p>
      </motion.div>
    </motion.div>
  );
}
