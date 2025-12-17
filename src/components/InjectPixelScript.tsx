// components/InjectPixelScriptClient.tsx
"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export default function InjectPixelScript() {
  useEffect(() => {
    let hasRun = false;
    const runOnce = async () => {
      if (hasRun) return;
      hasRun = true;

      try {
        const data = await apiClient.getTrackingPixels();
        if (data?.script && !document.getElementById("dynamic-pixel")) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.id = "dynamic-pixel";
          script.innerHTML = data.script;
          document.head.appendChild(script);
        }
      } catch (err) {
        console.error("Dynamic pixelni yuklashda xatolik:", err);
      }
    };

    // Defer heavy/unknown third-party scripts to idle time to reduce TBT.
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | null = null;
    const timeoutId = window.setTimeout(() => runOnce(), 4000);

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => runOnce(), { timeout: 5000 });
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId != null && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return null;
}
