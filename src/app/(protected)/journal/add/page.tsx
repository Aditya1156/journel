import { TradeForm } from "@/components/journal/TradeForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddTradePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/journal">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Trade</h1>
          <p className="text-muted-foreground mt-1">
            Log your trade details for future analysis
          </p>
        </div>
      </div>

      {/* Form */}
      <TradeForm />
    </div>
  );
}
