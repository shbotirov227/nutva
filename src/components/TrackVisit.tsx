"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export default function TrackVisit() {
  useEffect(() => {
    const alreadyTracked = sessionStorage.getItem("visit_tracked");

    if (!alreadyTracked) {
      apiClient.postTrackVisit()
        .then(() => {
          sessionStorage.setItem("visit_tracked", "true");
          console.log("Visit tracked");
        })
        .catch((error) => {
          console.error("Track visit error:", error);
        });
    }

    console.log("Already tracked:", alreadyTracked);
  }, []);

  return null;
}
