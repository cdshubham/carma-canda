import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: { missingSuspenseWithCSRBailout: false } as any,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "s3dev.imgix.net",
      "www.reshot.com",
      "cdn.prod.website-files.com",
    ],
  },
};

export default nextConfig;
