"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Loader2 } from "lucide-react";
import type { ProductVideoInterface } from "@/types/landing-page.types";

// Extract YouTube video ID from URL
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

interface GripProductVideoProps {
  content: ProductVideoInterface | ProductVideoInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

interface VideoPlayerProps {
  video: ProductVideoInterface;
}

interface VideoThumbnailProps {
  video: ProductVideoInterface;
  onPlay: () => void;
}

interface VideoEmbedProps {
  video: ProductVideoInterface;
  isLoading: boolean;
  error: string | null;
  onLoad: () => void;
  onError: () => void;
}

export function GripProductVideo({ content }: GripProductVideoProps) {
  // Get the first video (or featured)
  const productVideo = Array.isArray(content)
    ? content.find((v) => v.type === "FEATURED") || content[0]
    : content;

  // Early return if no video content
  if (!productVideo?.title && !productVideo?.video_url) return null;

  return (
    <section className="py-10 md:py-16 lg:py-24 xl:py-28 bg-gradient-to-b from-[#f8f8f8] to-[#ffffff] dark:bg-gradient-to-b dark:from-[#181818] dark:via-[#000000] dark:to-[#111111]">
      <div className="container">
        {/* Video Title */}
        {productVideo.title && <VideoTitle title={productVideo.title} />}

        {/* Video Player Section */}
        <VideoPlayer video={productVideo} />

        {/* Video Description */}
        {productVideo.description && (
          <VideoDescription description={productVideo.description} />
        )}
      </div>
    </section>
  );
}

// Video Title Component
function VideoTitle({ title }: { title: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 dark:text-white leading-tight">
        {title}
      </h2>
    </div>
  );
}

// Video Player Component
function VideoPlayer({ video }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (video?.video_url) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [video?.video_url]);

  const handleVideoError = () => {
    setError("Video failed to load. Please try again later.");
    setIsLoading(false);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsLoading(true);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
        {!isPlaying ? (
          <VideoThumbnail video={video} onPlay={handlePlayClick} />
        ) : (
          <VideoEmbed
            video={video}
            isLoading={isLoading}
            error={error}
            onLoad={() => setIsLoading(false)}
            onError={handleVideoError}
          />
        )}
      </div>
    </div>
  );
}

// Video Thumbnail Component
function VideoThumbnail({ video, onPlay }: VideoThumbnailProps) {
  const videoId = extractVideoId(video?.video_url ?? "");

  if (!videoId) return null;

  return (
    <div
      className="relative aspect-video cursor-pointer group"
      onClick={onPlay}
    >
      {/* YouTube Thumbnail */}
      <Image
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={video?.title || "Video thumbnail"}
        fill
        className="object-cover"
        unoptimized
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Play Button Background */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-900 rounded-full flex items-center justify-center">
              <Play
                className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5"
                fill="currentColor"
              />
            </div>
          </div>

          {/* "Play" Text Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
              Play
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Embed Component
function VideoEmbed({
  video,
  isLoading,
  error,
  onLoad,
  onError,
}: VideoEmbedProps) {
  const videoId = extractVideoId(video?.video_url ?? "");

  return (
    <div className="relative aspect-video">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-gray-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center max-w-md px-4">
            <p className="text-gray-800 text-lg mb-2">Oops!</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      ) : (
        /* YouTube Iframe */
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full"
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </div>
  );
}

// Video Description Component
function VideoDescription({ description }: { description: string }) {
  return (
    <div className="mt-8 text-center">
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default GripProductVideo;
