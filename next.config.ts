import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,

    minimumCacheTTL: 604800, // Cache images for one week (in seconds)

    // Remote image patterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "d10rvdv6rxomuk.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www.easykoro.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.zatiq.com",
      },
      {
        protocol: "https",
        hostname: "*.zatiqeasy.com",
      },
      {
        protocol: "https",
        hostname: "*.zatiq.app",
      },
      {
        protocol: "https",
        hostname: "**.ufileos.com", // For UCloud CDN
      },
      {
        protocol: "https",
        hostname: "**.cn-wlcb.ufileos.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },

  turbopack: {}, // Empty turbopack config to silence the warning

  webpack: (config) => {
    // Fix for module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };
    return config;
  },
};

export default nextConfig;
