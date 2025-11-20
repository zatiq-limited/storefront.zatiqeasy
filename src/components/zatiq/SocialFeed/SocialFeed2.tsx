/**
 * Social Feed Component 2 - Premium Facebook Feed Display
 * Facebook-style UI with reactions and engagement metrics
 */

import React from "react";
import { ThumbsUp, MessageSquare, Share2, Facebook } from "lucide-react";

interface Post {
  id: string;
  image: string;
  caption?: string;
  likes?: number;
  link?: string;
  shares?: number;
  comments?: number;
}

interface SocialFeed2Props {
  settings?: {
    title?: string;
    subtitle?: string;
    source?: "instagram" | "facebook" | "twitter";
    username?: string;
    pageName?: string;
    limit?: number;
    columns?: number;
    columnsMobile?: number;
    showLikes?: boolean;
  };
  posts?: Post[];
}

export default function SocialFeed2({
  settings = {},
  posts = [],
}: SocialFeed2Props) {
  const {
    title,
    subtitle,
    source = "facebook",
    username,
    pageName,
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
  };

  const gridColsMobileMap = {
    1: "grid-cols-1",
    2: "grid-cols-2",
  };

  const gridColsClass =
    gridColsMap[columns as keyof typeof gridColsMap];
  const gridColsMobileClass =
    gridColsMobileMap[columnsMobile as keyof typeof gridColsMobileMap];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <section className="pb-8 sm:pb-14 px-4 sm:px-0">
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
              {source === "facebook" && (
                <Facebook className="w-5 h-5 md:w-6 md:h-6 fill-blue-600" />
              )}
              {subtitle}
            </p>
          )}
        </div>

        {/* Posts Grid - Facebook Card Style */}
        {displayPosts.length > 0 ? (
          <div
            className={`grid ${gridColsMobileClass} ${gridColsClass} gap-4 md:gap-5 lg:gap-6`}
          >
            {displayPosts.map((post: Post, index: number) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Post Header - Facebook Style */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Facebook className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {pageName || "Our Page"}
                      </h3>
                      <p className="text-xs text-gray-500">Just now · 🌍</p>
                    </div>
                  </div>
                </div>

                {/* Post Caption */}
                {post.caption && (
                  <div className="px-4 py-3">
                    <p className="text-gray-800 text-sm md:text-base line-clamp-3 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Post Image */}
                <a
                  href={post.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative overflow-hidden bg-gray-100"
                >
                  <img
                    src={post.image}
                    alt={post.caption || "Facebook post"}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </a>

                {/* Engagement Stats - Facebook Style */}
                {showLikes && post.likes && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            <ThumbsUp className="w-3 h-3 text-white fill-white" />
                          </div>
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-xs">❤️</span>
                          </div>
                        </div>
                        <span className="hover:underline cursor-pointer">
                          {formatNumber(post.likes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs md:text-sm">
                        {post.comments && (
                          <span className="hover:underline cursor-pointer">
                            {formatNumber(post.comments)} comments
                          </span>
                        )}
                        {post.shares && (
                          <span className="hover:underline cursor-pointer">
                            {formatNumber(post.shares)} shares
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Facebook Style */}
                <div className="p-2 flex items-center justify-around border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group/btn">
                    <ThumbsUp className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover/btn:text-blue-600 transition-colors" />
                    <span className="text-sm md:text-base font-semibold text-gray-600 group-hover/btn:text-blue-600 transition-colors">
                      Like
                    </span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group/btn">
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover/btn:text-blue-600 transition-colors" />
                    <span className="text-sm md:text-base font-semibold text-gray-600 group-hover/btn:text-blue-600 transition-colors">
                      Comment
                    </span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group/btn">
                    <Share2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover/btn:text-blue-600 transition-colors" />
                    <span className="text-sm md:text-base font-semibold text-gray-600 group-hover/btn:text-blue-600 transition-colors">
                      Share
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <Facebook className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4 fill-gray-300" />
            <p className="text-gray-500 text-lg md:text-xl">
              No posts available
            </p>
          </div>
        )}

        {/* Follow Button - Facebook Style */}
        {username && (
          <div className="text-center mt-10 md:mt-14 lg:mt-16">
            <a
              href={`https://facebook.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Facebook className="w-5 h-5 md:w-6 md:h-6 fill-white" />
              Follow Us on Facebook
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
