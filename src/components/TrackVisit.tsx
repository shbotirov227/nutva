"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export default function TrackVisit() {
  useEffect(() => {
    const alreadyTracked = sessionStorage.getItem("visit_tracked");

    if (!alreadyTracked) {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      const send = () => {
        apiClient
          .postTrackVisit()
          .then(() => {
            sessionStorage.setItem("visit_tracked", "true");
            if (process.env.NODE_ENV === "development") console.log("Visit tracked");
          })
          .catch((error) => {
            if (process.env.NODE_ENV === "development") console.error("Track visit error:", error);
          });
      };

      let idleId: number | null = null;
      const timeoutId = window.setTimeout(send, 2500);

      if (typeof w.requestIdleCallback === "function") {
        idleId = w.requestIdleCallback(send, { timeout: 3000 });
      }

      return () => {
        window.clearTimeout(timeoutId);
        if (idleId != null && typeof w.cancelIdleCallback === "function") {
          w.cancelIdleCallback(idleId);
        }
      };
    }
  }, []);

  return null;
}
