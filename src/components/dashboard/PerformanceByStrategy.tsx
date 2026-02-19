"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceByStrategyProps {
  trades: Trade[];
}

interface StrategyStats {
  strategy: string;
  totalPnL: number;
  trades: number;
  winRate: number;
  avgRR: number;
  avgPnL: number;
}

export function PerformanceByStrategy({ trades }: PerformanceByStrategyProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN");

  // Calculate stats by strategy
  const strategyMap = new Map<string, Trade[]>();
  closedTrades.forEach((trade) => {
    const strategy = trade.strategy || "No Strategy";
    const existing = strategyMap.get(strategy) || [];
    existing.push(trade);
    strategyMap.set(strategy, existing);
  });

  const strategyStats: StrategyStats[] = Array.from(strategyMap.entries()).map(
    ([strategy, strategyTrades]) => {
      const wins = strategyTrades.filter((t) => t.result === "WIN").length;
      const totalPnL = strategyTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const avgRR =
        strategyTrades.filter((t) => t.riskReward).length > 0
          ? strategyTrades
              .filter((t) => t.riskReward)
              .reduce((sum, t) => sum + (t.riskReward || 0), 0) /
            strategyTrades.filter((t) => t.riskReward).length
          : 0;

      return {
        strategy,
        totalPnL,
        trades: strategyTrades.length,
        winRate: (wins / strategyTrades.length) * 100,
        avgRR,
        avgPnL: totalPnL / strategyTrades.length,
      };
    }
  );

  // Sort by total P&L
  strategyStats.sort((a, b) => b.totalPnL - a.totalPnL);

  // Find best performing strategy
  const bestStrategy = strategyStats.length > 0 ? strategyStats[0] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance by Strategy</CardTitle>
        <p className="text-sm text-muted-foreground">
          Analyze which strategies work best for you
        </p>
      </CardHeader>
      <CardContent>
        {strategyStats.length > 0 ? (
          <div className="space-y-4">
            {/* Best Performing Strategy Highlight */}
            {bestStrategy && bestStrategy.totalPnL > 0 && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Top Performing Strategy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{bestStrategy.strategy}</span>
                  <span className="text-green-600 font-bold">
                    +${bestStrategy.totalPnL.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{bestStrategy.trades} trades</span>
                  <span>{bestStrategy.winRate.toFixed(0)}% win rate</span>
                  <span>{bestStrategy.avgRR.toFixed(1)}R avg</span>
                </div>
              </div>
            )}

            {/* Strategy List */}
            <div className="space-y-2">
              {strategyStats.map((stat, index) => (
                <div
                  key={stat.strategy}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        stat.totalPnL >= 0
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {stat.totalPnL >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{stat.strategy}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.trades} trades • {stat.winRate.toFixed(0)}% win rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        stat.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.totalPnL >= 0 ? "+" : ""}${stat.totalPnL.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Avg: ${stat.avgPnL.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>No closed trades yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
