import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // If you want to expose environment variables:
  // env: {
  //   NEXT_PUBLIC_API_BASE: "http://localhost:8000/api"
  // },

  // If you serve images from external sources, configure domains here:
  // images: {
  //   domains: ["localhost"],
  // },

  // (Optional) Add experimental features only if needed:
  // experimental: {
  //   serverActions: true,
  // },
};

export default nextConfig;
