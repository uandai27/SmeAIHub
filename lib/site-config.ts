export const siteConfig = {
  name: "SmeAIHub",
  shortName: "SmeAIHub",
  description:
    "AI-powered business solutions that help small and medium-sized businesses automate operations, understand customers, and accelerate growth.",
  url: "https://smeaihub.ai",
  locale: "en_US",
  language: "en",
  keywords: [
    "AI for small business",
    "AI business automation",
    "AI agents",
    "customer service AI",
    "business intelligence",
    "restaurant AI",
    "hotel AI",
    "spa AI",
    "small business software",
    "SmeAIHub",
  ],
  creator: "SmeAIHub",
  publisher: "SmeAIHub",
  email: "hello@smeaihub.ai",
  links: {
    linkedin: "",
    x: "",
    github: "https://github.com/uandai27/SmeAIHub",
  },
} as const;

export type SiteConfig = typeof siteConfig;