"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trade } from "@/mock/trades";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Clock,
  Brain,
  Zap,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TradingSuggestionsProps {
  trades: Trade[];
}

interface Suggestion {
  id: string;
  type: "improvement" | "warning" | "strength" | "insight";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  icon: any;
  actionable?: string;
}

export function TradingSuggestions({ trades }: TradingSuggestionsProps) {
  const closedTrades = trades.filter((t) => t.result !== "OPEN");
  const suggestions: Suggestion[] = [];

  // Calculate metrics for analysis
  const winningTrades = closedTrades.filter((t) => t.result === "WIN");
  const losingTrades = closedTrades.filter((t) => t.result === "LOSS");
  const winRate = closedTrades.length > 0 
    ? (winningTrades.length / closedTrades.length) * 100 
    : 0;

  const avgWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
    : 0;
  const avgLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length)
    : 0;

  // Analyze by time of day
  const morningTrades = closedTrades.filter((t) => {
    const hour = new Date(t.entryTime).getHours();
    return hour >= 9 && hour < 12;
  });
  const afternoonTrades = closedTrades.filter((t) => {
    const hour = new Date(t.entryTime).getHours();
    return hour >= 12 && hour < 16;
  });

  const morningWinRate = morningTrades.length > 0
    ? (morningTrades.filter((t) => t.result === "WIN").length / morningTrades.length) * 100
    : 0;
  const afternoonWinRate = afternoonTrades.length > 0
    ? (afternoonTrades.filter((t) => t.result === "WIN").length / afternoonTrades.length) * 100
    : 0;

  // Analyze by emotion
  const anxiousTrades = closedTrades.filter((t) => 
    t.emotions.some((e) => ["anxious", "fearful", "impulsive", "fomo"].includes(e.toLowerCase()))
  );
  const calmTrades = closedTrades.filter((t) => 
    t.emotions.some((e) => ["calm", "confident", "patient", "disciplined"].includes(e.toLowerCase()))
  );

  const anxiousWinRate = anxiousTrades.length > 0
    ? (anxiousTrades.filter((t) => t.result === "WIN").length / anxiousTrades.length) * 100
    : 0;
  const calmWinRate = calmTrades.length > 0
    ? (calmTrades.filter((t) => t.result === "WIN").length / calmTrades.length) * 100
    : 0;

  // Analyze by strategy
  const strategyStats = new Map<string, { wins: number; total: number; pnl: number }>();
  closedTrades.forEach((t) => {
    const strategy = t.strategy || "No Strategy";
    const existing = strategyStats.get(strategy) || { wins: 0, total: 0, pnl: 0 };
    existing.total++;
    existing.pnl += t.pnl || 0;
    if (t.result === "WIN") existing.wins++;
    strategyStats.set(strategy, existing);
  });

  // Best and worst strategies
  let bestStrategy = { name: "", winRate: 0, pnl: 0 };
  let worstStrategy = { name: "", winRate: 100, pnl: 0 };
  strategyStats.forEach((stats, name) => {
    const wr = (stats.wins / stats.total) * 100;
    if (wr > bestStrategy.winRate && stats.total >= 2) {
      bestStrategy = { name, winRate: wr, pnl: stats.pnl };
    }
    if (wr < worstStrategy.winRate && stats.total >= 2) {
      worstStrategy = { name, winRate: wr, pnl: stats.pnl };
    }
  });

  // Generate suggestions based on analysis

  // Win Rate Suggestions
  if (winRate < 40) {
    suggestions.push({
      id: "low-win-rate",
      type: "warning",
      title: "Win Rate Below Target",
      description: `Your current win rate is ${winRate.toFixed(1)}%. Consider reviewing your entry criteria and being more selective with trade setups.`,
      priority: "high",
      icon: AlertTriangle,
      actionable: "Review last 10 losing trades for common patterns",
    });
  } else if (winRate >= 60) {
    suggestions.push({
      id: "high-win-rate",
      type: "strength",
      title: "Strong Win Rate",
      description: `Excellent! Your ${winRate.toFixed(1)}% win rate shows consistent execution. Keep following your current approach.`,
      priority: "low",
      icon: CheckCircle,
    });
  }

  // Risk/Reward Suggestions
  if (avgWin > 0 && avgLoss > 0) {
    const riskRewardRatio = avgWin / avgLoss;
    if (riskRewardRatio < 1) {
      suggestions.push({
        id: "poor-rr",
        type: "warning",
        title: "Risk/Reward Needs Improvement",
        description: `Your average win ($${avgWin.toFixed(0)}) is smaller than your average loss ($${avgLoss.toFixed(0)}). Try to let winners run longer or cut losses quicker.`,
        priority: "high",
        icon: Target,
        actionable: "Set wider take-profit targets or tighter stop losses",
      });
    } else if (riskRewardRatio >= 2) {
      suggestions.push({
        id: "great-rr",
        type: "strength",
        title: "Excellent Risk Management",
        description: `Your average win is ${riskRewardRatio.toFixed(1)}x your average loss. This gives you a significant edge even with a lower win rate.`,
        priority: "low",
        icon: Shield,
      });
    }
  }

  // Time-based suggestions
  if (morningTrades.length >= 3 && afternoonTrades.length >= 3) {
    if (morningWinRate > afternoonWinRate + 15) {
      suggestions.push({
        id: "morning-better",
        type: "insight",
        title: "Morning Trading Edge",
        description: `Your morning win rate (${morningWinRate.toFixed(0)}%) significantly outperforms afternoon (${afternoonWinRate.toFixed(0)}%). Consider focusing more trades during market open.`,
        priority: "medium",
        icon: Clock,
        actionable: "Prioritize trading between 9 AM - 12 PM",
      });
    } else if (afternoonWinRate > morningWinRate + 15) {
      suggestions.push({
        id: "afternoon-better",
        type: "insight",
        title: "Afternoon Trading Edge",
        description: `You perform better in the afternoon (${afternoonWinRate.toFixed(0)}% vs ${morningWinRate.toFixed(0)}%). Consider avoiding early morning trades.`,
        priority: "medium",
        icon: Clock,
        actionable: "Wait for midday setups for better results",
      });
    }
  }

  // Emotional trading suggestions
  if (calmTrades.length >= 3 && anxiousTrades.length >= 2) {
    if (calmWinRate > anxiousWinRate + 10) {
      suggestions.push({
        id: "emotional-trading",
        type: "improvement",
        title: "Emotions Affecting Performance",
        description: `When calm/confident, you win ${calmWinRate.toFixed(0)}% of trades. When anxious/fearful, only ${anxiousWinRate.toFixed(0)}%. Your mental state significantly impacts results.`,
        priority: "high",
        icon: Brain,
        actionable: "Practice mindfulness before trading sessions",
      });
    }
  }

  // Strategy-specific suggestions
  if (bestStrategy.name && bestStrategy.pnl > 0) {
    suggestions.push({
      id: "best-strategy",
      type: "strength",
      title: `"${bestStrategy.name}" is Your Best Strategy`,
      description: `This strategy has a ${bestStrategy.winRate.toFixed(0)}% win rate and generated $${bestStrategy.pnl.toFixed(0)} profit. Consider focusing more on this setup.`,
      priority: "medium",
      icon: Zap,
      actionable: "Document and refine this strategy further",
    });
  }

  if (worstStrategy.name && worstStrategy.pnl < 0 && worstStrategy.name !== bestStrategy.name) {
    suggestions.push({
      id: "worst-strategy",
      type: "warning",
      title: `Reconsider "${worstStrategy.name}" Strategy`,
      description: `This strategy has only ${worstStrategy.winRate.toFixed(0)}% win rate and lost $${Math.abs(worstStrategy.pnl).toFixed(0)}. Consider paper trading or abandoning this approach.`,
      priority: "high",
      icon: AlertTriangle,
      actionable: "Stop using this strategy until backtested",
    });
  }

  // Consistency suggestion
  const tradesWithConfidence = closedTrades.filter((t) => t.confidence !== null);
  if (tradesWithConfidence.length >= 5) {
    const highConfTrades = tradesWithConfidence.filter((t) => (t.confidence || 0) >= 7);
    const lowConfTrades = tradesWithConfidence.filter((t) => (t.confidence || 0) < 5);
    
    const highConfWinRate = highConfTrades.length > 0
      ? (highConfTrades.filter((t) => t.result === "WIN").length / highConfTrades.length) * 100
      : 0;
    const lowConfWinRate = lowConfTrades.length > 0
      ? (lowConfTrades.filter((t) => t.result === "WIN").length / lowConfTrades.length) * 100
      : 0;

    if (lowConfTrades.length >= 2 && lowConfWinRate < 40) {
      suggestions.push({
        id: "low-confidence-trades",
        type: "improvement",
        title: "Avoid Low-Confidence Trades",
        description: `Trades with low confidence (1-4) have only ${lowConfWinRate.toFixed(0)}% win rate. Trust your instincts and skip uncertain setups.`,
        priority: "medium",
        icon: Lightbulb,
        actionable: "Only take trades with confidence level 7+",
      });
    }
  }

  // Sort suggestions by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "border-red-500/30 bg-red-500/5";
      case "improvement":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "strength":
        return "border-green-500/30 bg-green-500/5";
      case "insight":
        return "border-blue-500/30 bg-blue-500/5";
      default:
        return "";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-red-500";
      case "improvement":
        return "text-yellow-500";
      case "strength":
        return "text-green-500";
      case "insight":
        return "text-blue-500";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Trading Insights & Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized recommendations based on your trading patterns
        </p>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Need more trades to generate insights</p>
            <p className="text-sm">Keep logging your trades for personalized suggestions</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                variants={itemVariants}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-md",
                  getTypeStyles(suggestion.type)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5", getIconColor(suggestion.type))}>
                    <suggestion.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <Badge
                        variant={
                          suggestion.priority === "high"
                            ? "destructive"
                            : suggestion.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    {suggestion.actionable && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">
                          Action: {suggestion.actionable}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
