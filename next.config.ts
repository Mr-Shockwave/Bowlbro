import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow other devices on the LAN to load dev assets (visit via this IP).
  allowedDevOrigins: ["10.16.145.213"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
