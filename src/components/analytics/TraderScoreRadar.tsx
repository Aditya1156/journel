"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TraderScoreRadarProps {
  trades: Trade[];
}

export function TraderScoreRadar({ trades }: TraderScoreRadarProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN");
  const winningTrades = closedTrades.filter((t) => t.result === "WIN");
  const losingTrades = closedTrades.filter((t) => t.result === "LOSS");

  // Calculate various scores (0-100)
  const calculateScores = () => {
    // Win Rate Score (40% = 0, 60% = 100)
    const winRate = closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;
    const winRateScore = Math.min(Math.max(((winRate - 40) / 20) * 100, 0), 100);

    // Risk Management Score (based on R:R)
    const avgRR = closedTrades
      .filter((t) => t.riskReward)
      .reduce((sum, t, _, arr) => sum + (t.riskReward || 0) / arr.length, 0);
    const riskScore = Math.min((avgRR / 3) * 100, 100);

    // Consistency Score (based on profit factor)
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 2;
    const consistencyScore = Math.min((profitFactor / 2.5) * 100, 100);

    // Discipline Score (based on following plan - using confidence as proxy)
    const tradesWithConfidence = closedTrades.filter((t) => t.confidence !== null);
    const avgConfidence = tradesWithConfidence.length > 0
      ? tradesWithConfidence.reduce((sum, t) => sum + (t.confidence || 0), 0) / tradesWithConfidence.length
      : 5;
    const disciplineScore = (avgConfidence / 10) * 100;

    // Emotional Control Score (based on calm vs anxious trades performance)
    const calmTrades = closedTrades.filter((t) =>
      t.emotions.some((e) => ["calm", "confident", "patient", "disciplined"].includes(e.toLowerCase()))
    );
    const anxiousTrades = closedTrades.filter((t) =>
      t.emotions.some((e) => ["anxious", "fearful", "impulsive", "fomo", "greedy"].includes(e.toLowerCase()))
    );
    const emotionalScore = closedTrades.length > 0
      ? ((calmTrades.length / closedTrades.length) * 100)
      : 50;

    // Execution Score (based on hitting targets)
    const tradesHitTarget = closedTrades.filter((t) => {
      if (!t.target || !t.exitPrice) return false;
      return t.side === "LONG"
        ? t.exitPrice >= t.target * 0.95
        : t.exitPrice <= t.target * 1.05;
    });
    const executionScore = closedTrades.length > 0
      ? (tradesHitTarget.length / closedTrades.length) * 100
      : 50;

    return [
      { subject: "Win Rate", score: winRateScore, fullMark: 100 },
      { subject: "Risk Mgmt", score: riskScore, fullMark: 100 },
      { subject: "Consistency", score: consistencyScore, fullMark: 100 },
      { subject: "Discipline", score: disciplineScore, fullMark: 100 },
      { subject: "Emotional", score: emotionalScore, fullMark: 100 },
      { subject: "Execution", score: executionScore, fullMark: 100 },
    ];
  };

  const data = calculateScores();
  const overallScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;

  // Determine grade
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-green-500" };
    if (score >= 80) return { grade: "A", color: "text-green-500" };
    if (score >= 70) return { grade: "B", color: "text-blue-500" };
    if (score >= 60) return { grade: "C", color: "text-yellow-500" };
    if (score >= 50) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-red-500" };
  };

  const { grade, color } = getGrade(overallScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Trader Performance Score</CardTitle>
            <p className="text-sm text-muted-foreground">
              Multi-dimensional analysis of your trading
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="text-center"
          >
            <div className={`text-4xl font-bold ${color}`}>{grade}</div>
            <div className="text-sm text-muted-foreground">
              {overallScore.toFixed(0)}%
            </div>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{data.subject}</p>
                        <p className="text-sm">Score: {data.score.toFixed(0)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {data.map((item, index) => (
            <motion.div
              key={item.subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-2 rounded-lg bg-muted/50 text-center"
            >
              <p className="text-xs text-muted-foreground">{item.subject}</p>
              <p
                className={`font-bold ${
                  item.score >= 70
                    ? "text-green-600"
                    : item.score >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {item.score.toFixed(0)}%
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
