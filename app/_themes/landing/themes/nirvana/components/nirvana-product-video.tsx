"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Play, Loader2 } from "lucide-react";
import type { ProductVideoInterface } from "@/types/landing-page.types";

interface NirvanaProductVideoProps {
  content: ProductVideoInterface | ProductVideoInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

export function NirvanaProductVideo({ content, onBuyNow }: NirvanaProductVideoProps) {
  // Support both single video and array of videos
  const productVideo = Array.isArray(content) ? content[0] : content;

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoId = useMemo(
    () => (productVideo?.video_url ? extractVideoId(productVideo.video_url) : null),
    [productVideo?.video_url]
  );

  useEffect(() => {
    if (videoId) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [videoId]);

  const handleVideoError = () => {
    setError("Video failed to load. Please try again later.");
    setIsLoading(false);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsLoading(true);
  };

  if (!productVideo?.title && !videoId) return null;

  return (
    <div className="bg-white/95 border-b-2">
      <div className="container mx-auto w-full py-10 md:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title with animated underline */}
          {productVideo?.title && (
            <div className="text-center mb-8 md:mb-16 cursor-pointer">
              <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-landing-primary to-landing-secondary leading-tight tracking-tight relative inline-block after:content-[''] after:absolute after:-bottom-1 md:after:-bottom-6 pb-2 after:left-0 after:w-full after:h-1 after:bg-landing-primary after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">
                {productVideo.title}
              </h2>
            </div>
          )}

          {/* Video Container */}
          {videoId && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 transform transition-transform duration-300 hover:scale-[1.02]">
              {!isPlaying ? (
                // Thumbnail View
                <div
                  className="relative aspect-video cursor-pointer group"
                  onClick={handlePlayClick}
                >
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-all duration-300 flex items-center justify-center z-10">
                    <button className="w-10 h-10 md:w-20 md:h-20 bg-red-500 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 ring-2 md:ring-4 ring-white/30">
                      <Play className="w-4 h-4 md:w-8 md:h-8 text-white ml-1" />
                    </button>
                  </div>
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={productVideo?.title || "Video thumbnail"}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                // Video Player
                <div className="relative aspect-video cursor-pointer">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                  )}
                  {error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      <p className="text-white text-lg">{error}</p>
                    </div>
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=0`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full h-full"
                      onLoad={() => setIsLoading(false)}
                      onError={handleVideoError}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Video Description */}
          {productVideo?.description && (
            <div className="mt-8 text-center">
              <p className="text-lg text-slate-700 hover:scale-105 hover:text-slate-700/80 transform duration-500 max-w-3xl mx-auto leading-relaxed">
                {productVideo.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NirvanaProductVideo;
