"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { cn } from "@/lib/utils";

interface PerformanceHeatmapProps {
  trades: Trade[];
  type: "hourly" | "daily" | "monthly";
}

export function PerformanceHeatmap({ trades, type }: PerformanceHeatmapProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN" && t.exitTime);

  // Generate heatmap data based on type
  const generateHourlyData = () => {
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      pnl: 0,
      trades: 0,
      wins: 0,
    }));

    closedTrades.forEach((trade) => {
      const hour = new Date(trade.entryTime).getHours();
      hourlyStats[hour].pnl += trade.pnl || 0;
      hourlyStats[hour].trades++;
      if (trade.result === "WIN") hourlyStats[hour].wins++;
    });

    return hourlyStats.map((stat) => ({
      ...stat,
      winRate: stat.trades > 0 ? (stat.wins / stat.trades) * 100 : 0,
    }));
  };

  const generateDailyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyStats = days.map((day, i) => ({
      day,
      dayIndex: i,
      pnl: 0,
      trades: 0,
      wins: 0,
    }));

    closedTrades.forEach((trade) => {
      const dayIndex = new Date(trade.entryTime).getDay();
      dailyStats[dayIndex].pnl += trade.pnl || 0;
      dailyStats[dayIndex].trades++;
      if (trade.result === "WIN") dailyStats[dayIndex].wins++;
    });

    return dailyStats.map((stat) => ({
      ...stat,
      winRate: stat.trades > 0 ? (stat.wins / stat.trades) * 100 : 0,
    }));
  };

  const generateMonthlyData = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyStats = months.map((month, i) => ({
      month,
      monthIndex: i,
      pnl: 0,
      trades: 0,
      wins: 0,
    }));

    closedTrades.forEach((trade) => {
      const monthIndex = new Date(trade.entryTime).getMonth();
      monthlyStats[monthIndex].pnl += trade.pnl || 0;
      monthlyStats[monthIndex].trades++;
      if (trade.result === "WIN") monthlyStats[monthIndex].wins++;
    });

    return monthlyStats.map((stat) => ({
      ...stat,
      winRate: stat.trades > 0 ? (stat.wins / stat.trades) * 100 : 0,
    }));
  };

  const getHeatColor = (value: number, max: number, min: number) => {
    if (value === 0) return "bg-muted";
    const normalized = (value - min) / (max - min || 1);
    if (value > 0) {
      if (normalized > 0.7) return "bg-green-500";
      if (normalized > 0.4) return "bg-green-400";
      return "bg-green-300";
    } else {
      if (normalized < 0.3) return "bg-red-500";
      if (normalized < 0.6) return "bg-red-400";
      return "bg-red-300";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  };

  const cellVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  if (type === "hourly") {
    const data = generateHourlyData();
    const maxPnL = Math.max(...data.map((d) => d.pnl));
    const minPnL = Math.min(...data.map((d) => d.pnl));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hourly Performance Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground">
            P&L by hour of day (24-hour format)
          </p>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-12 gap-1"
          >
            {data.map((stat, index) => (
              <motion.div
                key={stat.hour}
                variants={cellVariants}
                className="group relative"
              >
                <div
                  className={cn(
                    "aspect-square rounded-sm flex items-center justify-center text-xs font-medium transition-all hover:scale-110 hover:z-10 cursor-pointer",
                    getHeatColor(stat.pnl, maxPnL, minPnL),
                    stat.pnl !== 0 && "text-white"
                  )}
                >
                  {stat.hour}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none">
                  <p className="font-medium">{stat.hour}:00</p>
                  <p>P&L: ${stat.pnl.toFixed(2)}</p>
                  <p>Trades: {stat.trades}</p>
                  <p>Win Rate: {stat.winRate.toFixed(0)}%</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>Loss</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-muted" />
              <span>No trades</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Profit</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "daily") {
    const data = generateDailyData();
    const maxPnL = Math.max(...data.map((d) => d.pnl));
    const minPnL = Math.min(...data.map((d) => d.pnl));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Performance Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground">
            P&L by day of week
          </p>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-7 gap-2"
          >
            {data.map((stat) => (
              <motion.div
                key={stat.day}
                variants={cellVariants}
                className="group relative"
              >
                <div
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer",
                    getHeatColor(stat.pnl, maxPnL, minPnL),
                    stat.pnl !== 0 && "text-white"
                  )}
                >
                  <span className="text-sm font-medium">{stat.day}</span>
                  <span className="text-xs opacity-80">
                    {stat.pnl >= 0 ? "+" : ""}${stat.pnl.toFixed(0)}
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none">
                  <p className="font-medium">{stat.day}</p>
                  <p>P&L: ${stat.pnl.toFixed(2)}</p>
                  <p>Trades: {stat.trades}</p>
                  <p>Win Rate: {stat.winRate.toFixed(0)}%</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  // Monthly
  const data = generateMonthlyData();
  const maxPnL = Math.max(...data.map((d) => d.pnl));
  const minPnL = Math.min(...data.map((d) => d.pnl));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Performance Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">
          P&L by month
        </p>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-6 gap-2"
        >
          {data.map((stat) => (
            <motion.div
              key={stat.month}
              variants={cellVariants}
              className="group relative"
            >
              <div
                className={cn(
                  "p-3 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer",
                  getHeatColor(stat.pnl, maxPnL, minPnL),
                  stat.pnl !== 0 && "text-white"
                )}
              >
                <span className="text-sm font-medium">{stat.month}</span>
                <span className="text-xs opacity-80">
                  {stat.pnl >= 0 ? "+" : ""}${stat.pnl.toFixed(0)}
                </span>
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none">
                <p className="font-medium">{stat.month}</p>
                <p>P&L: ${stat.pnl.toFixed(2)}</p>
                <p>Trades: {stat.trades}</p>
                <p>Win Rate: {stat.winRate.toFixed(0)}%</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
