import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "loremflickr.com",
      "d10rvdv6rxomuk.cloudfront.net",
      "www.easykoro.com",
      "res.cloudinary.com",
      "www.zatiq.com",
      "*.zatiqeasy.com",
      "*.zatiq.app",
    ],
    unoptimized: true,
    minimumCacheTTL: 604800, // Cache images for one week (in seconds)
  },
  turbopack: {}, // Empty turbopack config to silence the warning
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix for module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };
    return config;
  },
};

export default nextConfig;
