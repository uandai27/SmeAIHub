"use client";

import { openAnalyticsSettings } from "@/components/analytics/analytics-consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openAnalyticsSettings}
      className="text-neutral-500 transition hover:text-neutral-950"
    >
      Cookie settings
    </button>
  );
}
