"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

import { analyticsConfig } from "@/lib/analytics";

const consentStorageKey = "smeaihub-analytics-consent";
const openSettingsEvent = "smeaihub:open-cookie-settings";

type ConsentChoice = "accepted" | "declined" | null;

function clearAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(
      (name) =>
        name === "_ga" ||
        name.startsWith("_ga_") ||
        name === "_clck" ||
        name === "_clsk",
    );

  const hostnameParts = window.location.hostname.split(".");
  const rootDomain =
    hostnameParts.length > 1
      ? `.${hostnameParts.slice(-2).join(".")}`
      : window.location.hostname;

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${rootDomain}`;
  }
}

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [isReady, setIsReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initializeConsent = window.setTimeout(() => {
      const storedConsent = window.localStorage.getItem(consentStorageKey);

      if (storedConsent === "accepted" || storedConsent === "declined") {
        setConsent(storedConsent);
      } else {
        setShowSettings(true);
      }

      setIsReady(true);
    }, 0);

    function openSettings() {
      setShowSettings(true);
    }

    window.addEventListener(openSettingsEvent, openSettings);

    return () => {
      window.clearTimeout(initializeConsent);
      window.removeEventListener(openSettingsEvent, openSettings);
    };
  }, []);

  function acceptAnalytics() {
    window.localStorage.setItem(consentStorageKey, "accepted");
    setConsent("accepted");
    setShowSettings(false);
  }

  function declineAnalytics() {
    const wasAccepted = consent === "accepted";

    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.clarity?.("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: "denied",
    });
    window.localStorage.setItem(consentStorageKey, "declined");
    clearAnalyticsCookies();
    setConsent("declined");
    setShowSettings(false);

    if (wasAccepted) {
      window.location.reload();
    }
  }

  return (
    <>
      {consent === "accepted" && process.env.NODE_ENV === "production" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('config', '${analyticsConfig.googleAnalyticsId}');
            `}
          </Script>
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${analyticsConfig.clarityProjectId}");
              window.clarity('consentv2', {
                ad_Storage: 'denied',
                analytics_Storage: 'granted'
              });
            `}
          </Script>
        </>
      )}

      {isReady && showSettings && (
        <div
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl shadow-neutral-950/15 sm:bottom-6 sm:p-6"
          role="dialog"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2
                id="analytics-consent-title"
                className="text-base font-semibold text-neutral-950"
              >
                Help us improve SmeAIHub
              </h2>
              <p
                id="analytics-consent-description"
                className="mt-2 text-sm leading-6 text-neutral-600"
              >
                We use Google Analytics and Microsoft Clarity to understand site
                usage and improve the experience. You can accept or decline
                analytics cookies. Read our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-neutral-950 underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={declineAnalytics}
                className="min-h-11 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={acceptAnalytics}
                className="min-h-11 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function openAnalyticsSettings() {
  window.dispatchEvent(new Event(openSettingsEvent));
}
