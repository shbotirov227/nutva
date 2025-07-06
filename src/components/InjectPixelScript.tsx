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

    runOnce();
  }, []);

  return null;
}
