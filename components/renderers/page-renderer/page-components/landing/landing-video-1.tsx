/**
 * Landing Video 1
 * Full-width video section with title and CTA
 */

"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

interface LandingVideo1Settings {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  videoType?: "youtube" | "vimeo" | "direct";
  posterImage?: string;
  buttonText?: string;
  buttonLink?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  backgroundColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingVideo1Props {
  settings: LandingVideo1Settings;
  onScrollToCheckout?: () => void;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/
  );
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export default function LandingVideo1({
  settings,
  onScrollToCheckout,
}: LandingVideo1Props) {
  const {
    title = "See It In Action",
    subtitle = "Watch our product video",
    videoUrl = "",
    videoType = "youtube",
    posterImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    buttonText = "Order Now",
    buttonLink = "checkout",
    autoPlay = false,
    muted = true,
    loop = true,
    backgroundColor = "#000000",
    textColor = "#FFFFFF",
    buttonBgColor = "#DC2626",
    buttonTextColor = "#FFFFFF",
    fontFamily = "inherit",
  } = settings;

  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const handleButtonClick = () => {
    if (buttonLink === "checkout" && onScrollToCheckout) {
      onScrollToCheckout();
    } else if (buttonLink && buttonLink.startsWith("http")) {
      window.open(buttonLink, "_blank");
    } else if (buttonLink) {
      const element = document.getElementById(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderVideo = () => {
    if (!videoUrl) return null;

    if (videoType === "youtube") {
      const videoId = getYouTubeId(videoUrl);
      if (!videoId) return null;

      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === "vimeo") {
      const videoId = getVimeoId(videoUrl);
      if (!videoId) return null;

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === "direct") {
      return (
        <video
          src={videoUrl}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls
          className="w-full h-full object-cover"
        />
      );
    }

    return null;
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {subtitle && (
            <p
              className="text-sm uppercase tracking-wider mb-2 opacity-80"
              style={{ color: textColor }}
            >
              {subtitle}
            </p>
          )}
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Video Container */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-black">
          {isPlaying && videoUrl ? (
            renderVideo()
          ) : (
            <>
              {/* Poster Image */}
              {posterImage && (
                <Image
                  src={posterImage}
                  alt={title || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
              )}

              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                  <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </button>
            </>
          )}
        </div>

        {/* CTA Button */}
        {buttonText && (
          <div className="text-center">
            <button
              onClick={handleButtonClick}
              className="px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
              }}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
