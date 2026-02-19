"use client";

import { useParams, useRouter } from "next/navigation";
import { mockTrades } from "@/mock/trades";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, Target, Activity, Clock, Brain, FileText } from "lucide-react";
import Link from "next/link";

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trade = mockTrades.find(t => t.id === params.id);

  if (!trade) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Trade Not Found</h2>
        <p className="text-muted-foreground mb-4">The trade you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/journal">Back to Journal</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this trade?")) {
      alert("Trade deleted! (Mock - no backend yet)");
      router.push("/journal");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/journal">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{trade.symbol}</h1>
              <Badge variant={trade.side === "LONG" ? "default" : "destructive"}>
                {trade.side}
              </Badge>
              {trade.result && (
                <Badge
                  variant={
                    trade.result === "WIN"
                      ? "default"
                      : trade.result === "LOSS"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {trade.result}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {trade.market} • {trade.timeframe} • {new Date(trade.entryTime).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* P&L Banner */}
      {trade.pnl !== null && (
        <Card className={trade.pnl > 0 ? "border-green-500/50 bg-green-50/50" : "border-red-500/50 bg-red-50/50"}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {trade.pnl > 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Profit & Loss</p>
                  <p className={`text-3xl font-bold ${trade.pnl > 0 ? "text-green-600" : "text-red-600"}`}>
                    {trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Return</p>
                <p className={`text-2xl font-bold ${trade.pnlPercent && trade.pnlPercent > 0 ? "text-green-600" : "text-red-600"}`}>
                  {trade.pnlPercent && trade.pnlPercent > 0 ? "+" : ""}
                  {trade.pnlPercent?.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Price Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Entry Price</p>
                  <p className="text-xl font-bold">${trade.entryPrice.toFixed(2)}</p>
                </div>
                {trade.exitPrice && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Exit Price</p>
                    <p className="text-xl font-bold">${trade.exitPrice.toFixed(2)}</p>
                  </div>
                )}
                {trade.stopLoss && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Stop Loss</p>
                    <p className="text-xl font-bold text-red-600">${trade.stopLoss.toFixed(2)}</p>
                  </div>
                )}
                {trade.target && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Target</p>
                    <p className="text-xl font-bold text-green-600">${trade.target.toFixed(2)}</p>
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <p className="text-lg font-semibold">{trade.quantity}</p>
                </div>
                {trade.riskReward && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Risk:Reward</p>
                    <p className="text-lg font-semibold text-primary">{trade.riskReward.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Time</span>
                <span className="font-semibold">{new Date(trade.entryTime).toLocaleString()}</span>
              </div>
              {trade.exitTime && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exit Time</span>
                    <span className="font-semibold">{new Date(trade.exitTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">
                      {Math.round((new Date(trade.exitTime).getTime() - new Date(trade.entryTime).getTime()) / (1000 * 60 * 60))}h
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timeframe</span>
                <Badge variant="outline">{trade.timeframe}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {trade.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{trade.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Psychology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Psychology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trade.confidence && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${trade.confidence * 10}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold">{trade.confidence}/10</span>
                  </div>
                </div>
              )}

              {trade.emotions.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Emotions</p>
                  <div className="flex flex-wrap gap-2">
                    {trade.emotions.map(emotion => (
                      <Badge key={emotion} variant="secondary">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {trade.strategy && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Strategy</p>
                  <Badge variant="outline" className="text-base">
                    {trade.strategy}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market</span>
                <Badge>{trade.market}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Side</span>
                <Badge variant={trade.side === "LONG" ? "default" : "destructive"}>
                  {trade.side}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Result</span>
                {trade.result ? (
                  <Badge
                    variant={
                      trade.result === "WIN"
                        ? "default"
                        : trade.result === "LOSS"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {trade.result}
                  </Badge>
                ) : (
                  <Badge variant="secondary">OPEN</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
