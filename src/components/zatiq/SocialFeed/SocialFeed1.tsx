/**
 * Social Feed Component
 * Displays Instagram/social media feed
 */

import React from "react";

interface Post {
  id: string;
  image: string;
  caption?: string;
  likes?: number;
  link?: string;
}

interface SocialFeed1Props {
  settings?: {
    title?: string;
    subtitle?: string;
    source?: "instagram" | "facebook" | "twitter";
    username?: string;
    limit?: number;
    columns?: number;
    columnsMobile?: number;
    showLikes?: boolean;
  };
  posts?: Post[];
}

export default function SocialFeed1({
  settings = {},
  posts = [],
}: SocialFeed1Props) {
  const {
    title = "Follow Us",
    subtitle = "@ourstore",
    source = "instagram",
    username = "",
    columns = 4,
    columnsMobile = 2,
    showLikes = true,
  } = settings;

  const gridCols =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
    }[columns] || "md:grid-cols-4";

  const gridColsMobile =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
    }[columnsMobile] || "grid-cols-2";

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className={`grid ${gridColsMobile} ${gridCols} gap-4`}>
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden rounded-lg aspect-square bg-gray-200"
              >
                <img
                  src={post.image}
                  alt={post.caption || "Social post"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4">
                    {showLikes && post.likes && (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-semibold">
                          {post.likes.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {post.caption && (
                      <p className="text-sm mt-2 line-clamp-2">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts available</p>
          </div>
        )}

        {/* Follow Button */}
        {username && (
          <div className="text-center mt-8">
            <a
              href={`https://${source}.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-shadow"
            >
              Follow Us on {source.charAt(0).toUpperCase() + source.slice(1)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
