"use client";

import { useEffect, useState } from "react";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

const isSlowNetwork = (effectiveType?: string) => {
  if (!effectiveType) return false;
  return effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
};

/**
 * A pragmatic flag for mobile/low-end devices.
 * Used to disable non-essential continuous animations (snowfall, autoplay sliders, etc.).
 */
export function useLowPowerMode() {
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const connection = (navigator as unknown as { connection?: NetworkInformationLike }).connection;

    const compute = () => {
      const prefersReducedMotion = Boolean(mq?.matches);
      const saveData = Boolean(connection?.saveData);
      const slowNetwork = isSlowNetwork(connection?.effectiveType);
      const smallScreen = window.innerWidth < 768;

      setLowPowerMode(prefersReducedMotion || saveData || slowNetwork || smallScreen);
    };

    compute();

    const onResize = () => compute();
    window.addEventListener("resize", onResize, { passive: true });

    const onMqChange = () => compute();
    mq?.addEventListener?.("change", onMqChange);

    const onConnChange = () => compute();
    connection?.addEventListener?.("change", onConnChange);

    return () => {
      window.removeEventListener("resize", onResize);
      mq?.removeEventListener?.("change", onMqChange);
      connection?.removeEventListener?.("change", onConnChange);
    };
  }, []);

  return lowPowerMode;
}
