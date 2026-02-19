"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
  className?: string;
  reverse?: boolean;
}

export const AnimatedBackground = ({ className, reverse = false }: AnimatedBackgroundProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-black">
        {/* Animated dots grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            animation: reverse
              ? 'dotFadeOut 2s ease-out forwards'
              : 'dotFadeIn 2s ease-out forwards',
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.3)_0%,_rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black via-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <style jsx>{`
        @keyframes dotFadeIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 0.3;
            transform: scale(1);
          }
        }

        @keyframes dotFadeOut {
          from {
            opacity: 0.3;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.5);
          }
        }
      `}</style>
    </div>
  );
};
