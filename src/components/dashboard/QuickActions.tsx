"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Download,
  BarChart2,
  Settings,
  RefreshCw,
  BookOpen,
  Target,
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="h-auto py-3 flex-col gap-1">
            <Link href="/journal/add">
              <Plus className="h-5 w-5" />
              <span className="text-xs">New Trade</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
            <Link href="/journal">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Journal</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
            <Link href="/analytics">
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Link>
          </Button>

          <Button
            variant="secondary"
            className="h-auto py-3 flex-col gap-1 col-span-2"
            onClick={() => {
              // Export functionality placeholder
              console.log("Exporting trades...");
            }}
          >
            <Download className="h-5 w-5" />
            <span className="text-xs">Export Trades</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
