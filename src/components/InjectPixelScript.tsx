"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export default function InjectPixelScript() {
  useEffect(() => {
    const fetchPixelScript = async () => {
      try {
        const data = await apiClient.getTrackingPixels();

        if (data?.script) {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.innerHTML = data.script;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error("Pixel scriptni olishda xatolik:", error);
      }
    };

    fetchPixelScript();
  }, []);

  return null;
}
