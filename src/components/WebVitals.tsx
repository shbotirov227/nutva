'use client';

import { useReportWebVitals } from 'next/web-vitals';

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: object) => void;
  }
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric);
    }
    
    // Send to analytics in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        custom_map: { metric_id: 'web_vitals' },
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  return null;
}
