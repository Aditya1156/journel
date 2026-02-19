"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-white">Error</h1>
              <h2 className="text-2xl font-semibold text-white/80">
                Something went wrong
              </h2>
              <p className="text-white/60">
                A critical error occurred. Please try refreshing the page.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={reset}
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
