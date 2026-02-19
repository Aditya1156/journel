"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Target,
  Percent,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskMetricsProps {
  trades: Trade[];
  initialBalance?: number;
}

export function RiskMetrics({ trades, initialBalance = 10000 }: RiskMetricsProps) {
  const closedTrades = trades
    .filter((t) => t.result !== "OPEN" && t.exitTime)
    .sort(
      (a, b) =>
        new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime()
    );

  // Calculate running balance and max drawdown
  let runningBalance = initialBalance;
  let peak = initialBalance;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let currentDrawdown = 0;
  let currentDrawdownPercent = 0;

  closedTrades.forEach((trade) => {
    runningBalance += trade.pnl || 0;
    if (runningBalance > peak) {
      peak = runningBalance;
    }
    const drawdown = peak - runningBalance;
    const drawdownPercent = (drawdown / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = drawdownPercent;
    }
    currentDrawdown = drawdown;
    currentDrawdownPercent = drawdownPercent;
  });

  // Calculate risk metrics
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winningTrades = closedTrades.filter((t) => t.result === "WIN");
  const losingTrades = closedTrades.filter((t) => t.result === "LOSS");

  const avgWin =
    winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) /
        winningTrades.length
      : 0;
  const avgLoss =
    losingTrades.length > 0
      ? Math.abs(
          losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) /
            losingTrades.length
        )
      : 0;

  // Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss)
  const winRate = closedTrades.length > 0
    ? winningTrades.length / closedTrades.length
    : 0;
  const lossRate = 1 - winRate;
  const expectancy = winRate * avgWin - lossRate * avgLoss;

  // Sharpe Ratio approximation (simplified)
  const returns = closedTrades.map((t) => t.pnlPercent || 0);
  const avgReturn = returns.length > 0 
    ? returns.reduce((a, b) => a + b, 0) / returns.length 
    : 0;
  const stdDev = returns.length > 0
    ? Math.sqrt(
        returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) /
          returns.length
      )
    : 0;
  const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

  // R-Multiples
  const rMultiples = closedTrades
    .filter((t) => t.riskReward !== null)
    .map((t) => t.riskReward || 0);
  const avgR = rMultiples.length > 0
    ? rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length
    : 0;

  // Recovery factor
  const recoveryFactor = maxDrawdown > 0 ? totalPnL / maxDrawdown : 0;

  // Risk rating based on metrics
  const getRiskRating = () => {
    let score = 0;
    if (maxDrawdownPercent < 10) score += 2;
    else if (maxDrawdownPercent < 20) score += 1;
    if (expectancy > 50) score += 2;
    else if (expectancy > 0) score += 1;
    if (sharpeRatio > 1) score += 2;
    else if (sharpeRatio > 0.5) score += 1;
    if (recoveryFactor > 3) score += 2;
    else if (recoveryFactor > 1) score += 1;

    if (score >= 6) return { rating: "Low Risk", color: "text-green-600", bg: "bg-green-500" };
    if (score >= 4) return { rating: "Moderate", color: "text-yellow-600", bg: "bg-yellow-500" };
    return { rating: "High Risk", color: "text-red-600", bg: "bg-red-500" };
  };

  const riskRating = getRiskRating();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Analysis
          </CardTitle>
          <Badge
            className={cn(
              "gap-1",
              riskRating.rating === "Low Risk" && "bg-green-500/10 text-green-600 border-green-500/30",
              riskRating.rating === "Moderate" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
              riskRating.rating === "High Risk" && "bg-red-500/10 text-red-600 border-red-500/30"
            )}
            variant="outline"
          >
            <div className={cn("w-2 h-2 rounded-full", riskRating.bg)} />
            {riskRating.rating}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Key risk metrics and drawdown analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Drawdown Section */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="font-medium">Drawdown</span>
              </div>
              {currentDrawdownPercent > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  In Drawdown
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
                <p className="text-xl font-bold text-red-600">
                  -{maxDrawdownPercent.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  -${maxDrawdown.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Drawdown</p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    currentDrawdownPercent > 0 ? "text-red-600" : "text-green-600"
                  )}
                >
                  -{currentDrawdownPercent.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  -${currentDrawdown.toFixed(2)}
                </p>
              </div>
            </div>
            {/* Drawdown Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Drawdown Severity</span>
                <span>{maxDrawdownPercent.toFixed(1)}% / 25%</span>
              </div>
              <Progress
                value={Math.min((maxDrawdownPercent / 25) * 100, 100)}
                className="h-2"
              />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Expectancy</span>
              </div>
              <p
                className={cn(
                  "text-lg font-bold",
                  expectancy >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                ${expectancy.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">per trade</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Sharpe Ratio</span>
              </div>
              <p
                className={cn(
                  "text-lg font-bold",
                  sharpeRatio >= 1
                    ? "text-green-600"
                    : sharpeRatio >= 0.5
                    ? "text-yellow-600"
                    : "text-red-600"
                )}
              >
                {sharpeRatio.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {sharpeRatio >= 1 ? "Excellent" : sharpeRatio >= 0.5 ? "Good" : "Improve"}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Percent className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">Avg R-Multiple</span>
              </div>
              <p
                className={cn(
                  "text-lg font-bold",
                  avgR >= 2 ? "text-green-600" : avgR >= 1 ? "text-yellow-600" : "text-red-600"
                )}
              >
                {avgR.toFixed(2)}R
              </p>
              <p className="text-xs text-muted-foreground">risk/reward</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Recovery Factor</span>
              </div>
              <p
                className={cn(
                  "text-lg font-bold",
                  recoveryFactor >= 3
                    ? "text-green-600"
                    : recoveryFactor >= 1
                    ? "text-yellow-600"
                    : "text-red-600"
                )}
              >
                {recoveryFactor.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {recoveryFactor >= 3 ? "Strong" : recoveryFactor >= 1 ? "Fair" : "Weak"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
