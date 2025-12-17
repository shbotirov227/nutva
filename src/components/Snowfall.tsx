"use client";

import { CSSProperties, useMemo } from "react";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

const FLAKE_COUNT = 80;

type SnowflakeStyle = CSSProperties & { "--snow-drift"?: string };

type SnowflakeConfig = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
};

const buildFlake = (id: number): SnowflakeConfig => ({
  id,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 6,
  size: 4 + Math.random() * 6,
  drift: Math.random() * 6 - 3,
  opacity: 0.35 + Math.random() * 0.4,
});

export default function Snowfall() {
  const lowPowerMode = useLowPowerMode();
  const flakes = useMemo(() => Array.from({ length: FLAKE_COUNT }, (_, id) => buildFlake(id)), []);

  if (lowPowerMode) return null;

  return (
    <div className="snowfall-overlay" aria-hidden="true">
      {flakes.map(({ id, left, delay, duration, size, drift, opacity }) => {
        const style: SnowflakeStyle = {
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          "--snow-drift": `${drift}vw`,
        };

        return <span key={id} className="snowflake" style={style} />;
      })}
    </div>
  );
}
