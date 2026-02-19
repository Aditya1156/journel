"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/mock/trades";
import { Badge } from "@/components/ui/badge";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TradingCalendarProps {
  trades: Trade[];
}

interface DayStats {
  date: Date;
  trades: number;
  pnl: number;
  wins: number;
  losses: number;
}

export function TradingCalendar({ trades }: TradingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get trades for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate stats for each day
  const closedTrades = trades.filter((t) => t.result !== "OPEN" && t.exitTime);

  const dayStatsMap = new Map<string, DayStats>();

  closedTrades.forEach((trade) => {
    const exitDate = new Date(trade.exitTime!);
    const dateKey = format(exitDate, "yyyy-MM-dd");

    const existing = dayStatsMap.get(dateKey) || {
      date: exitDate,
      trades: 0,
      pnl: 0,
      wins: 0,
      losses: 0,
    };

    existing.trades++;
    existing.pnl += trade.pnl || 0;
    if (trade.result === "WIN") existing.wins++;
    if (trade.result === "LOSS") existing.losses++;

    dayStatsMap.set(dateKey, existing);
  });

  // Calculate monthly stats
  const monthTrades = closedTrades.filter((t) => {
    const exitDate = new Date(t.exitTime!);
    return isSameMonth(exitDate, currentMonth);
  });

  const monthPnL = monthTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const monthWins = monthTrades.filter((t) => t.result === "WIN").length;
  const monthLosses = monthTrades.filter((t) => t.result === "LOSS").length;
  const tradingDays = new Set(
    monthTrades.map((t) => format(new Date(t.exitTime!), "yyyy-MM-dd"))
  ).size;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the starting day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);

  return (
    <Card className="col-span-full xl:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trading Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Month Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="font-semibold">{monthTrades.length}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">P&L</p>
            <p
              className={`font-semibold ${
                monthPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${monthPnL.toFixed(0)}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">W/L</p>
            <p className="font-semibold">
              <span className="text-green-600">{monthWins}</span>/
              <span className="text-red-600">{monthLosses}</span>
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Days</p>
            <p className="font-semibold">{tradingDays}</p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-muted-foreground font-medium py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before the start of the month */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {daysInMonth.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayStats = dayStatsMap.get(dateKey);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={dateKey}
                className={cn(
                  "aspect-square p-1 rounded-md text-center relative transition-colors",
                  isToday && "ring-2 ring-primary",
                  dayStats && dayStats.pnl > 0 && "bg-green-500/20",
                  dayStats && dayStats.pnl < 0 && "bg-red-500/20",
                  dayStats && dayStats.pnl === 0 && "bg-yellow-500/20",
                  !dayStats && "hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "text-xs",
                    isToday && "font-bold",
                    dayStats &&
                      (dayStats.pnl >= 0 ? "text-green-600" : "text-red-600")
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayStats && (
                  <div className="absolute bottom-0 left-0 right-0 px-0.5">
                    <div className="flex justify-center gap-0.5">
                      {dayStats.trades > 0 && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            dayStats.pnl >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
            <span>Profit Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50" />
            <span>Loss Day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
