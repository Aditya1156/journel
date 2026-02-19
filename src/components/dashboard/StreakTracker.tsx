"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingDown, Calendar, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakTrackerProps {
  trades: Trade[];
}

interface Streak {
  type: "win" | "loss";
  count: number;
  pnl: number;
  startDate: Date;
  endDate: Date;
}

export function StreakTracker({ trades }: StreakTrackerProps) {
  const closedTrades = trades
    .filter((t) => t.result !== "OPEN" && t.exitTime)
    .sort(
      (a, b) =>
        new Date(b.exitTime!).getTime() - new Date(a.exitTime!).getTime()
    );

  // Calculate current streak
  let currentStreak = 0;
  let currentStreakType: "win" | "loss" | null = null;
  let currentStreakPnL = 0;

  for (const trade of closedTrades) {
    if (trade.result === "WIN") {
      if (currentStreakType === "win" || currentStreakType === null) {
        currentStreak++;
        currentStreakType = "win";
        currentStreakPnL += trade.pnl || 0;
      } else {
        break;
      }
    } else if (trade.result === "LOSS") {
      if (currentStreakType === "loss" || currentStreakType === null) {
        currentStreak++;
        currentStreakType = "loss";
        currentStreakPnL += trade.pnl || 0;
      } else {
        break;
      }
    } else {
      break; // Breakeven breaks the streak
    }
  }

  // Calculate best winning streak
  let bestWinStreak = 0;
  let bestWinStreakPnL = 0;
  let tempWinStreak = 0;
  let tempWinPnL = 0;

  for (const trade of closedTrades) {
    if (trade.result === "WIN") {
      tempWinStreak++;
      tempWinPnL += trade.pnl || 0;
      if (tempWinStreak > bestWinStreak) {
        bestWinStreak = tempWinStreak;
        bestWinStreakPnL = tempWinPnL;
      }
    } else {
      tempWinStreak = 0;
      tempWinPnL = 0;
    }
  }

  // Calculate worst losing streak
  let worstLossStreak = 0;
  let worstLossStreakPnL = 0;
  let tempLossStreak = 0;
  let tempLossPnL = 0;

  for (const trade of closedTrades) {
    if (trade.result === "LOSS") {
      tempLossStreak++;
      tempLossPnL += trade.pnl || 0;
      if (tempLossStreak > worstLossStreak) {
        worstLossStreak = tempLossStreak;
        worstLossStreakPnL = tempLossPnL;
      }
    } else {
      tempLossStreak = 0;
      tempLossPnL = 0;
    }
  }

  // Calculate consecutive trading days
  const tradingDates = new Set(
    closedTrades.map((t) => new Date(t.exitTime!).toDateString())
  );
  const uniqueDates = Array.from(tradingDates)
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let consecutiveDays = 0;
  if (uniqueDates.length > 0) {
    consecutiveDays = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diffDays = Math.round(
        (uniqueDates[i - 1].getTime() - uniqueDates[i].getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        consecutiveDays++;
      } else {
        break;
      }
    }
  }

  // Calculate profit factor
  const totalWins = closedTrades
    .filter((t) => t.result === "WIN")
    .reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalLosses = Math.abs(
    closedTrades
      .filter((t) => t.result === "LOSS")
      .reduce((sum, t) => sum + (t.pnl || 0), 0)
  );
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;

  // Calculate average win/loss
  const winningTrades = closedTrades.filter((t) => t.result === "WIN");
  const losingTrades = closedTrades.filter((t) => t.result === "LOSS");
  const avgWin =
    winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) /
        winningTrades.length
      : 0;
  const avgLoss =
    losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length
      : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Streak & Consistency
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your trading momentum
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Streak */}
          <div
            className={cn(
              "p-4 rounded-lg border-2",
              currentStreakType === "win"
                ? "bg-green-500/10 border-green-500/30"
                : currentStreakType === "loss"
                ? "bg-red-500/10 border-red-500/30"
                : "bg-muted border-muted"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Streak</span>
              {currentStreak > 0 && (
                <Badge
                  variant={currentStreakType === "win" ? "default" : "destructive"}
                >
                  {currentStreak} {currentStreakType === "win" ? "Wins" : "Losses"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              {currentStreak > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    {currentStreakType === "win" ? (
                      <Flame className="h-8 w-8 text-orange-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    )}
                    <span className="text-3xl font-bold">{currentStreak}</span>
                  </div>
                  <div className="text-sm">
                    <p
                      className={
                        currentStreakType === "win"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {currentStreakType === "win" ? "+" : ""}$
                      {currentStreakPnL.toFixed(2)}
                    </p>
                    <p className="text-muted-foreground">streak P&L</p>
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">No active streak</span>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Best Win Streak</span>
              </div>
              <p className="text-xl font-bold">{bestWinStreak}</p>
              <p className="text-xs text-green-600">+${bestWinStreakPnL.toFixed(2)}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-xs text-muted-foreground">Worst Loss Streak</span>
              </div>
              <p className="text-xl font-bold">{worstLossStreak}</p>
              <p className="text-xs text-red-600">${worstLossStreakPnL.toFixed(2)}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Trading Days</span>
              </div>
              <p className="text-xl font-bold">{consecutiveDays}</p>
              <p className="text-xs text-muted-foreground">consecutive</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Profit Factor</span>
              </div>
              <p
                className={cn(
                  "text-xl font-bold",
                  profitFactor >= 1.5
                    ? "text-green-600"
                    : profitFactor >= 1
                    ? "text-yellow-600"
                    : "text-red-600"
                )}
              >
                {profitFactor === Infinity ? "∞" : profitFactor.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {profitFactor >= 1.5 ? "Excellent" : profitFactor >= 1 ? "Good" : "Improve"}
              </p>
            </div>
          </div>

          {/* Win/Loss Ratio */}
          <div className="p-3 rounded-lg border">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Avg Win vs Avg Loss</span>
              <Badge variant="outline">
                {avgLoss !== 0
                  ? (Math.abs(avgWin / avgLoss)).toFixed(2)
                  : "N/A"}{" "}
                R/R
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-green-600">Avg Win</span>
                  <span className="font-medium">+${avgWin.toFixed(2)}</span>
                </div>
                <div className="h-2 rounded-full bg-green-500/20">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${Math.min(
                        (avgWin / (Math.abs(avgLoss) + avgWin)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-red-600">Avg Loss</span>
                  <span className="font-medium">${avgLoss.toFixed(2)}</span>
                </div>
                <div className="h-2 rounded-full bg-red-500/20">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width: `${Math.min(
                        (Math.abs(avgLoss) / (Math.abs(avgLoss) + avgWin)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
