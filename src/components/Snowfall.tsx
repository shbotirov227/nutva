"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

const SNOWFLAKE_COUNT = 50;

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate snowflakes only on client side
    const flakes: Snowflake[] = Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 10,
      animationDelay: Math.random() * 5,
      size: 4 + Math.random() * 8,
      opacity: 0.4 + Math.random() * 0.6,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snowfall-container" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
