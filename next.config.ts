import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Enable Next.js image optimization (unoptimized: false is default)
    unoptimized: false,

    // Use modern image formats - AVIF is smallest, WebP is fallback
    formats: ["image/avif", "image/webp"],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],

    // Image sizes for srcset (thumbnails, cards, etc.)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],

    // Cache optimized images on server
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
