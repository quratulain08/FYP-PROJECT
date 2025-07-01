import type { NextConfig } from "next";

const nextConfig = {
     output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
