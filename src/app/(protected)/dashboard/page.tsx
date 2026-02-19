"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { EquityCurveChart } from "@/components/dashboard/EquityCurveChart";
import { PerformanceByMarket } from "@/components/dashboard/PerformanceByMarket";
import { PerformanceByStrategy } from "@/components/dashboard/PerformanceByStrategy";
import { TradingCalendar } from "@/components/dashboard/TradingCalendar";
import { OpenPositions } from "@/components/dashboard/OpenPositions";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { WeeklyPnLChart } from "@/components/dashboard/WeeklyPnLChart";
import { RiskMetrics } from "@/components/dashboard/RiskMetrics";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EmotionalAnalysis } from "@/components/dashboard/EmotionalAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Percent,
  Trophy,
  AlertTriangle,
  Calendar,
  Zap,
} from "lucide-react";
import { mockTrades } from "@/mock/trades";
import { mockUser } from "@/mock/user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function DashboardPage() {
  // Calculate metrics from mock data
  const closedTrades = mockTrades.filter((t) => t.result !== "OPEN");
  const openTrades = mockTrades.filter((t) => t.result === "OPEN");
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter((t) => t.result === "WIN");
  const losingTrades = closedTrades.filter((t) => t.result === "LOSS");
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const avgRR = mockTrades
    .filter((t) => t.riskReward)
    .reduce((sum, t, _, arr) => sum + (t.riskReward || 0) / arr.length, 0);

  // Calculate additional metrics
  const avgWin =
    winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
      : 0;
  const avgLoss =
    losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length)
      : 0;

  // Profit Factor
  const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  // Best & Worst Trade
  const bestTrade = closedTrades.reduce(
    (best, t) => ((t.pnl || 0) > (best.pnl || 0) ? t : best),
    closedTrades[0] || { pnl: 0 }
  );
  const worstTrade = closedTrades.reduce(
    (worst, t) => ((t.pnl || 0) < (worst.pnl || 0) ? t : worst),
    closedTrades[0] || { pnl: 0 }
  );

  // Today's P&L
  const today = new Date();
  const todayTrades = closedTrades.filter((t) => {
    if (!t.exitTime) return false;
    const exitDate = new Date(t.exitTime);
    return (
      exitDate.getDate() === today.getDate() &&
      exitDate.getMonth() === today.getMonth() &&
      exitDate.getFullYear() === today.getFullYear()
    );
  });
  const todayPnL = todayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  // Get recent trades (last 5)
  const recentTrades = mockTrades
    .filter((t) => t.exitTime || t.result === "OPEN")
    .sort((a, b) => {
      const dateA = a.exitTime ? new Date(a.exitTime) : new Date(a.entryTime);
      const dateB = b.exitTime ? new Date(b.exitTime) : new Date(b.entryTime);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {mockUser.name.split(" ")[0]}! 
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is your trading performance overview for {format(new Date(), "MMMM yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/journal/add" className="gap-2">
              <Zap className="h-4 w-4" />
              Log Trade
            </Link>
          </Button>
        </div>
      </div>

      {/* Today's Summary Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Todays Performance</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-bold ${
                      todayPnL >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {todayPnL >= 0 ? "+" : ""}${todayPnL.toFixed(2)}
                  </span>
                  <Badge variant="secondary">{todayTrades.length} trades</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Open Positions</p>
                <p className="font-semibold text-lg">{openTrades.length}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Total Trades</p>
                <p className="font-semibold text-lg">{mockTrades.length}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Win Rate</p>
                <p
                  className={`font-semibold text-lg ${
                    winRate >= 50 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {winRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total P&L"
          value={`${totalPnL >= 0 ? "+" : ""}$${totalPnL.toFixed(2)}`}
          icon={DollarSign}
          description="All-time realized profit/loss"
          trend={{
            value: 12.5,
            isPositive: totalPnL > 0,
          }}
          className={totalPnL >= 0 ? "border-green-500/30" : "border-red-500/30"}
        />
        <MetricCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Activity}
          description={`${winningTrades.length}W / ${losingTrades.length}L of ${totalTrades} trades`}
          className={winRate >= 50 ? "border-green-500/30" : "border-yellow-500/30"}
        />
        <MetricCard
          title="Profit Factor"
          value={profitFactor === Infinity ? "" : profitFactor.toFixed(2)}
          icon={BarChart2}
          description={`Gross Profit: $${grossProfit.toFixed(0)}`}
          className={profitFactor >= 1.5 ? "border-green-500/30" : "border-yellow-500/30"}
        />
        <MetricCard
          title="Avg R:R"
          value={avgRR.toFixed(2)}
          icon={Target}
          description="Average risk/reward ratio"
          className={avgRR >= 2 ? "border-green-500/30" : "border-yellow-500/30"}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Average Win"
          value={`+$${avgWin.toFixed(2)}`}
          icon={TrendingUp}
          description={`${winningTrades.length} winning trades`}
          className="border-green-500/20"
        />
        <MetricCard
          title="Average Loss"
          value={`-$${avgLoss.toFixed(2)}`}
          icon={AlertTriangle}
          description={`${losingTrades.length} losing trades`}
          className="border-red-500/20"
        />
        <MetricCard
          title="Best Trade"
          value={`+$${(bestTrade?.pnl || 0).toFixed(2)}`}
          icon={Trophy}
          description={(bestTrade as any)?.symbol || "N/A"}
          className="border-green-500/20"
        />
        <MetricCard
          title="Worst Trade"
          value={`$${(worstTrade?.pnl || 0).toFixed(2)}`}
          icon={AlertTriangle}
          description={(worstTrade as any)?.symbol || "N/A"}
          className="border-red-500/20"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equity Curve */}
          <EquityCurveChart trades={mockTrades} initialBalance={10000} />

          {/* Weekly P&L Chart */}
          <WeeklyPnLChart trades={mockTrades} weeks={8} />

          {/* Performance Breakdown Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <PerformanceByMarket trades={mockTrades} />
            <PerformanceByStrategy trades={mockTrades} />
          </div>
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Open Positions */}
          <OpenPositions trades={mockTrades} />

          {/* Streak Tracker */}
          <StreakTracker trades={mockTrades} />

          {/* Trading Calendar */}
          <TradingCalendar trades={mockTrades} />
        </div>
      </div>

      {/* Bottom Row - Additional Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Metrics */}
        <RiskMetrics trades={mockTrades} initialBalance={10000} />

        {/* Emotional Analysis */}
        <EmotionalAnalysis trades={mockTrades} />
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest trading activity
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/journal">View All Trades</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentTrades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start logging your trades to see them here
              </p>
              <Button asChild>
                <Link href="/journal/add">Add Your First Trade</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <Link
                  key={trade.id}
                  href={`/journal/${trade.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        trade.result === "WIN"
                          ? "bg-green-500/10"
                          : trade.result === "LOSS"
                          ? "bg-red-500/10"
                          : trade.result === "OPEN"
                          ? "bg-blue-500/10"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      {trade.result === "WIN" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : trade.result === "LOSS" ? (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      ) : trade.result === "OPEN" ? (
                        <Activity className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Percent className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{trade.symbol}</span>
                        <Badge
                          variant={trade.side === "LONG" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {trade.side}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {trade.market}
                        </Badge>
                        {trade.result && trade.result !== "OPEN" && (
                          <Badge
                            variant={
                              trade.result === "WIN"
                                ? "default"
                                : trade.result === "LOSS"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {trade.result}
                          </Badge>
                        )}
                        {trade.result === "OPEN" && (
                          <Badge variant="secondary" className="text-xs">
                            OPEN
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trade.strategy || "No strategy"} - {trade.timeframe} -{" "}
                        {format(new Date(trade.entryTime), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {trade.pnl !== null ? (
                      <div
                        className={`text-right ${
                          trade.pnl > 0 ? "text-green-600" : trade.pnl < 0 ? "text-red-600" : ""
                        }`}
                      >
                        <div className="font-semibold flex items-center gap-1 justify-end">
                          {trade.pnl > 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : trade.pnl < 0 ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : null}
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </div>
                        <div className="text-sm">
                          {trade.pnl >= 0 ? "+" : ""}
                          {trade.pnlPercent?.toFixed(2)}%
                        </div>
                      </div>
                    ) : (
                      <div className="text-right text-muted-foreground">
                        <div className="font-medium">Entry: ${trade.entryPrice}</div>
                        <div className="text-sm">
                          {trade.riskReward?.toFixed(1)}R planned
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
