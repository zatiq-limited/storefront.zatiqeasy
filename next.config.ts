import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // https://nextjs.org/docs/app/getting-started/cache-components#enabling-cache-components
  images: {
    unoptimized: true,
    minimumCacheTTL: 604800, // Cache images for one week (in seconds)

    // Remote image patterns (Next.js 16 style)
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
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "**.ibb.co",
      },
      {
        protocol: "https",
        hostname: "www.zatiq.com",
      },
      {
        protocol: "https",
        hostname: "**.zatiqeasy.com",
      },
      {
        protocol: "https",
        hostname: "**.zatiq.app",
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

  turbopack: {},

  webpack: (config) => {
    // Fix for module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };
    return config;
  },

  // Cache headers for static files
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Cache static files for a year
          },
        ],
      },
    ];
  },

  // Rewrites and redirects based on environment
  ...(process.env.NEXT_PUBLIC_SYSTEM_ENV === "STANDALONE"
    ? {
        // Production/Standalone mode: Custom domains and subdomains
        rewrites: async () => [
          {
            source: "/robots.txt",
            destination: "/api/robots.txt",
          },
          {
            source: "/r/:path*",
            destination: "/receipt/:path",
          },
          {
            source: "/merchant/:path*",
            destination: "/404",
          },
        ],
        redirects: async () => [
          {
            source: "/",
            has: [{ type: "query", key: "product" }],
            destination: "/products/:product",
            permanent: true,
          },
          {
            source: "/",
            has: [{ type: "query", key: "category" }],
            destination: "/categories/:category",
            permanent: true,
          },
        ],
      }
    : {
        // Development mode: /merchant/[shopId] routing
        rewrites: async () => [
          // NOTE: /categories routes are now handled by the app router - removed rewrite to /404
          // {
          //   source: "/categories/:path*",
          //   destination: "/404",
          // },
          // NOTE: /products routes are now handled by the app router - removed rewrite to /404
          // {
          //   source: "/products/:path*",
          //   destination: "/404",
          // },
          {
            source: "/r/:path*",
            destination: "/receipt/:path",
          },
        ],
        redirects: async () => [
          // Only redirect root if NEXT_PUBLIC_REDIRECT_URL is explicitly set
          ...(process.env.NEXT_PUBLIC_REDIRECT_URL
            ? [
                {
                  source: "/",
                  destination: process.env.NEXT_PUBLIC_REDIRECT_URL,
                  permanent: true,
                },
              ]
            : []),
          {
            source: "/:shopId(\\d+)/:path*",
            destination: "/merchant/:shopId/:path*",
            permanent: false,
          },
          {
            source: "/merchant/:path",
            has: [{ type: "query", key: "product" }],
            destination: "/merchant/:path/products/:product",
            permanent: true,
          },
          {
            source: "/merchant/:path",
            has: [{ type: "query", key: "category" }],
            destination: "/merchant/:path/categories/:category",
            permanent: true,
          },
        ],
      }),
};

export default nextConfig;
