"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calculator } from "lucide-react";

const MARKETS = ["STOCK", "FOREX", "CRYPTO", "FUTURES", "OPTIONS"];
const SIDES = ["LONG", "SHORT"];
const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"];
const EMOTIONS = [
  "confident", "fearful", "greedy", "patient",
  "impulsive", "calm", "anxious", "disciplined"
];

export function TradeForm() {
  const [formData, setFormData] = useState({
    symbol: "",
    market: "STOCK",
    side: "LONG",
    entryPrice: "",
    exitPrice: "",
    stopLoss: "",
    target: "",
    quantity: "",
    entryTime: new Date().toISOString().slice(0, 16),
    exitTime: "",
    timeframe: "15m",
    strategy: "",
    notes: "",
    confidence: "5",
    emotions: [] as string[],
  });

  const [calculatedValues, setCalculatedValues] = useState({
    riskReward: null as number | null,
    potentialProfit: null as number | null,
    potentialLoss: null as number | null,
  });

  // Calculate risk/reward and potential P&L
  const calculateMetrics = () => {
    const entry = parseFloat(formData.entryPrice);
    const stop = parseFloat(formData.stopLoss);
    const tgt = parseFloat(formData.target);
    const qty = parseFloat(formData.quantity);

    if (entry && stop && tgt && qty) {
      const risk = Math.abs(entry - stop);
      const reward = Math.abs(tgt - entry);
      const rr = reward / risk;

      const isLong = formData.side === "LONG";
      const potentialProfit = isLong
        ? (tgt - entry) * qty
        : (entry - tgt) * qty;
      const potentialLoss = isLong
        ? (entry - stop) * qty
        : (stop - entry) * qty;

      setCalculatedValues({
        riskReward: rr,
        potentialProfit,
        potentialLoss,
      });
    }
  };

  const toggleEmotion = (emotion: string) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Trade submitted:", formData);
    alert("Trade added successfully! (Mock - no backend yet)");
    // Reset form or redirect
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trade Basics */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Basics</CardTitle>
          <CardDescription>Essential trade information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol *</Label>
              <Input
                id="symbol"
                placeholder="AAPL, BTCUSD, etc."
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="market">Market *</Label>
              <select
                id="market"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
              >
                {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="side">Side *</Label>
              <select
                id="side"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
              >
                {SIDES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe *</Label>
              <select
                id="timeframe"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
              >
                {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryTime">Entry Date & Time *</Label>
              <Input
                id="entryTime"
                type="datetime-local"
                value={formData.entryTime}
                onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exitTime">Exit Date & Time (Optional)</Label>
              <Input
                id="exitTime"
                type="datetime-local"
                value={formData.exitTime}
                onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Execution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trade Execution</CardTitle>
              <CardDescription>Entry, exit, and risk management</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={calculateMetrics}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price *</Label>
              <Input
                id="entryPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                id="exitPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Calculated Metrics */}
          {calculatedValues.riskReward && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="text-sm font-semibold mb-3">Calculated Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Risk:Reward</p>
                  <p className="text-lg font-bold text-primary">
                    {calculatedValues.riskReward.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Potential Profit</p>
                  <p className="text-lg font-bold text-green-600">
                    ${calculatedValues.potentialProfit?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Potential Loss</p>
                  <p className="text-lg font-bold text-red-600">
                    ${calculatedValues.potentialLoss?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Psychology */}
      <Card>
        <CardHeader>
          <CardTitle>Psychology & Notes</CardTitle>
          <CardDescription>Track your mental state and observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Emotions</Label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(emotion => (
                <Badge
                  key={emotion}
                  variant={formData.emotions.includes(emotion) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleEmotion(emotion)}
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence">Confidence (1-10)</Label>
            <div className="flex items-center gap-4">
              <input
                id="confidence"
                type="range"
                min="1"
                max="10"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                className="flex-1"
              />
              <span className="text-lg font-bold w-8 text-center">
                {formData.confidence}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Strategy</Label>
            <Input
              id="strategy"
              placeholder="Breakout, Support bounce, etc."
              value={formData.strategy}
              onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="What went well? What could be improved?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit">
          Add Trade
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
