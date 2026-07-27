import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/deals/signature-request": ["./assets/contracts/*.pdf"],
  },
};

export default nextConfig;
