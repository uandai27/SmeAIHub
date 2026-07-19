export const analyticsConfig = {
  googleAnalyticsId: "G-DHK9KW3ERC",
  clarityProjectId: "xoyle33ton",
} as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackDiagnosisLead() {
  window.gtag?.("event", "generate_lead", {
    lead_source: "business_diagnosis_form",
  });

  window.clarity?.("event", "business_diagnosis_submitted");
}
