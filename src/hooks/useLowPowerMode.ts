"use client";

import { useCallback, useEffect, useState } from "react";

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
export function useLowPowerMode(options?: { includeSmallScreen?: boolean }) {
  const includeSmallScreen = options?.includeSmallScreen ?? true;

  const computeNow = useCallback(() => {
    if (typeof window === "undefined") return false;

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const connection = (navigator as unknown as { connection?: NetworkInformationLike }).connection;

    const prefersReducedMotion = Boolean(mq?.matches);
    const saveData = Boolean(connection?.saveData);
    const slowNetwork = isSlowNetwork(connection?.effectiveType);
    const smallScreen = includeSmallScreen ? window.innerWidth < 768 : false;

    return prefersReducedMotion || saveData || slowNetwork || smallScreen;
  }, [includeSmallScreen]);

  const [lowPowerMode, setLowPowerMode] = useState(() => computeNow());

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const connection = (navigator as unknown as { connection?: NetworkInformationLike }).connection;

    const compute = () => setLowPowerMode(computeNow());

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
  }, [computeNow]);

  return lowPowerMode;
}
