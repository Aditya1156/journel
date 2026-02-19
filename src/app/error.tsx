"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">Oops!</h1>
          <h2 className="text-2xl font-semibold text-white/80">
            Something went wrong
          </h2>
          <p className="text-white/60">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button
            onClick={reset}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
