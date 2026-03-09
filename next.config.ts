import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript worker crashes silently on Vercel (OOM); errors are checked locally via tsc --noEmit
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
