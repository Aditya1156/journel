"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { cn } from "@/lib/utils";
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface EmotionalAnalysisProps {
  trades: Trade[];
}

export function EmotionalAnalysis({ trades }: EmotionalAnalysisProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN");

  // Categorize emotions
  const positiveEmotions = ["confident", "patient", "calm", "disciplined", "focused"];
  const negativeEmotions = ["anxious", "fearful", "impulsive", "greedy", "frustrated", "angry", "fomo"];
  const neutralEmotions = ["neutral", "uncertain"];

  // Count emotion occurrences and their associated P&L
  const emotionStats = new Map<string, { count: number; pnl: number; winRate: number }>();

  closedTrades.forEach((trade) => {
    trade.emotions.forEach((emotion) => {
      const existing = emotionStats.get(emotion) || { count: 0, pnl: 0, winRate: 0 };
      existing.count++;
      existing.pnl += trade.pnl || 0;
      emotionStats.set(emotion, existing);
    });
  });

  // Calculate win rates for each emotion
  closedTrades.forEach((trade) => {
    trade.emotions.forEach((emotion) => {
      const stat = emotionStats.get(emotion);
      if (stat && trade.result === "WIN") {
        stat.winRate++;
      }
    });
  });

  // Convert to array and calculate win rates as percentages
  const emotionData = Array.from(emotionStats.entries())
    .map(([emotion, data]) => ({
      emotion,
      count: data.count,
      pnl: data.pnl,
      winRate: data.count > 0 ? (data.winRate / data.count) * 100 : 0,
      category: positiveEmotions.includes(emotion)
        ? "positive"
        : negativeEmotions.includes(emotion)
        ? "negative"
        : "neutral",
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate overall emotional performance
  const positiveTradesPnL = closedTrades
    .filter((t) => t.emotions.some((e) => positiveEmotions.includes(e)))
    .reduce((sum, t) => sum + (t.pnl || 0), 0);

  const negativeTradesPnL = closedTrades
    .filter((t) => t.emotions.some((e) => negativeEmotions.includes(e)))
    .reduce((sum, t) => sum + (t.pnl || 0), 0);

  // Pie chart data for emotion distribution
  const pieData = [
    {
      name: "Positive",
      value: emotionData.filter((e) => e.category === "positive").reduce((sum, e) => sum + e.count, 0),
    },
    {
      name: "Negative",
      value: emotionData.filter((e) => e.category === "negative").reduce((sum, e) => sum + e.count, 0),
    },
    {
      name: "Neutral",
      value: emotionData.filter((e) => e.category === "neutral").reduce((sum, e) => sum + e.count, 0),
    },
  ].filter((d) => d.value > 0);

  const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

  // Calculate confidence correlation
  const tradesWithConfidence = closedTrades.filter((t) => t.confidence !== null);
  const highConfidenceTrades = tradesWithConfidence.filter((t) => (t.confidence || 0) >= 7);
  const lowConfidenceTrades = tradesWithConfidence.filter((t) => (t.confidence || 0) < 5);

  const highConfidenceWinRate =
    highConfidenceTrades.length > 0
      ? (highConfidenceTrades.filter((t) => t.result === "WIN").length /
          highConfidenceTrades.length) *
        100
      : 0;
  const lowConfidenceWinRate =
    lowConfidenceTrades.length > 0
      ? (lowConfidenceTrades.filter((t) => t.result === "WIN").length /
          lowConfidenceTrades.length) *
        100
      : 0;

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Smile className="h-5 w-5" />
          Emotional Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How emotions affect your trading performance
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Emotion Distribution Pie Chart */}
          {pieData.length > 0 && (
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="text-sm font-medium">{data.name}</p>
                            <p className="text-sm">{data.value} occurrences</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* P&L by Emotional State */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "p-3 rounded-lg border",
                positiveTradesPnL >= 0
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Smile className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Positive Emotions</span>
              </div>
              <p
                className={cn(
                  "text-lg font-bold",
                  positiveTradesPnL >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {positiveTradesPnL >= 0 ? "+" : ""}${positiveTradesPnL.toFixed(2)}
              </p>
            </div>

            <div
              className={cn(
                "p-3 rounded-lg border",
                negativeTradesPnL >= 0
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Frown className="h-4 w-4 text-red-600" />
                <span className="text-xs text-muted-foreground">Negative Emotions</span>
              </div>
              <p
                className={cn(
                  "text-lg font-bold",
                  negativeTradesPnL >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {negativeTradesPnL >= 0 ? "+" : ""}${negativeTradesPnL.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Confidence Correlation */}
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Confidence vs Win Rate</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">High (7-10)</span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {highConfidenceWinRate.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {highConfidenceTrades.length} trades
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs text-muted-foreground">Low (1-4)</span>
                </div>
                <p className="text-xl font-bold text-yellow-600">
                  {lowConfidenceWinRate.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {lowConfidenceTrades.length} trades
                </p>
              </div>
            </div>
          </div>

          {/* Top Emotions */}
          {emotionData.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Top Emotions</p>
              <div className="flex flex-wrap gap-1">
                {emotionData.slice(0, 6).map((emotion) => (
                  <span
                    key={emotion.emotion}
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      emotion.category === "positive" &&
                        "bg-green-500/10 text-green-600",
                      emotion.category === "negative" &&
                        "bg-red-500/10 text-red-600",
                      emotion.category === "neutral" &&
                        "bg-yellow-500/10 text-yellow-600"
                    )}
                  >
                    {emotion.emotion} ({emotion.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
