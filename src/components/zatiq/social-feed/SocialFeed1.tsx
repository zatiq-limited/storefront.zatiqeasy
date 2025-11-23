/**
 * Social Feed Component - Premium Instagram Feed Display
 * World-class design with smooth animations and interactions
 */

import React from "react";
import { Heart, MessageCircle, Instagram } from "lucide-react";

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
    title,
    subtitle,
    source = "instagram",
    username,
    columns,
    columnsMobile,
    showLikes,
    limit
  } = settings;

  // Early return if no posts
  if (posts.length <= 0) {
    return null;
  }

  const displayPosts = posts.slice(0, limit || posts.length);

  const gridColsMap = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };

  const gridColsMobileMap = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  const gridColsClass =
    gridColsMap[columns as keyof typeof gridColsMap];
  const gridColsMobileClass =
    gridColsMobileMap[columnsMobile as keyof typeof gridColsMobileMap];

  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}K`;
    }
    return likes.toString();
  };

  return (
    <section className="pb-8 sm:pb-14 px-4 2xl:px-0">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 lg:mb-16">
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 flex items-center justify-center gap-2">
              {source === "instagram" && (
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              )}
              {subtitle}
            </p>
          )}
        </div>

        {/* Posts Grid */}
        {displayPosts.length > 0 ? (
          <div
            className={`grid ${gridColsMobileClass} ${gridColsClass} gap-3 md:gap-4 lg:gap-6`}
          >
            {displayPosts.map((post: Post, index: number) => (
              <a
                key={post.id}
                href={post.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden rounded-xl md:rounded-2xl aspect-square bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Image */}
                <img
                  src={post.image}
                  alt={post.caption || "Social post"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Instagram Icon - Top Right */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 md:p-2.5 shadow-lg">
                    <Instagram className="w-4 h-4 md:w-5 md:h-5 text-pink-600" />
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 lg:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {/* Caption */}
                  {post.caption && (
                    <p className="text-white text-sm md:text-base font-medium mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  )}

                  {/* Likes and Comments */}
                  {showLikes && post.likes && (
                    <div className="flex items-center gap-4 md:gap-6 text-white">
                      <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2">
                        <Heart className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                        <span className="text-sm md:text-base font-semibold">
                          {formatLikes(post.likes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2">
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base font-semibold">
                          {Math.floor(post.likes / 10)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <Instagram className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg md:text-xl">
              No posts available
            </p>
          </div>
        )}

        {/* Follow Button */}
        {username && (
          <div className="text-center mt-10 md:mt-14 lg:mt-16">
            <a
              href={`https://${source}.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white text-base md:text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
            >
              {source === "instagram" && (
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              )}
              Follow Us on {source.charAt(0).toUpperCase() + source.slice(1)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
