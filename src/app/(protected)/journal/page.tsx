"use client";

import { Button } from "@/components/ui/button";
import { TradeTable } from "@/components/journal/TradeTable";
import { mockTrades } from "@/mock/trades";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade Journal</h1>
          <p className="text-muted-foreground mt-1">
            Review and analyze all your trades
          </p>
        </div>
        <Button asChild>
          <Link href="/journal/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Trade
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input placeholder="Search symbol..." className="max-w-xs" />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Trade Table */}
      <TradeTable trades={mockTrades} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {mockTrades.length} of {mockTrades.length} trades
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
