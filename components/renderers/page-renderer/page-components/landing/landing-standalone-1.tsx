/**
 * Landing Standalone 1
 * Full-width promotional banner with CTA
 */

"use client";

import React from "react";
import Image from "next/image";

interface LandingStandalone1Settings {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  layout?: "image-right" | "image-left" | "image-bg";
  backgroundColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingStandalone1Props {
  settings: LandingStandalone1Settings;
  onScrollToCheckout?: () => void;
}

export default function LandingStandalone1({
  settings,
  onScrollToCheckout,
}: LandingStandalone1Props) {
  const {
    title = "Limited Time Offer!",
    subtitle = "Don't miss out on this amazing deal",
    description = "Order now and get 20% off your first purchase",
    image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    buttonText = "Claim Offer",
    buttonLink = "checkout",
    layout = "image-right",
    backgroundColor = "#111827",
    textColor = "#FFFFFF",
    buttonBgColor = "#DC2626",
    buttonTextColor = "#FFFFFF",
    fontFamily = "inherit",
  } = settings;

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

  // Image Background Layout
  if (layout === "image-bg") {
    return (
      <section
        className="relative py-24 px-4"
        style={{ fontFamily }}
      >
        {/* Background Image */}
        {image && (
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={title || "Banner"}
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `${backgroundColor}CC` }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="relative z-10 max-w-4xl mx-auto text-center"
          style={{ color: textColor }}
        >
          {subtitle && (
            <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          )}
          {description && (
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {buttonText && (
            <button
              onClick={handleButtonClick}
              className="px-10 py-4 text-lg font-bold rounded-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
              }}
            >
              {buttonText}
            </button>
          )}
        </div>
      </section>
    );
  }

  // Side by Side Layout
  const isImageLeft = layout === "image-left";

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex flex-col ${
            isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
          } items-center gap-8 md:gap-12`}
        >
          {/* Image */}
          {image && (
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={image}
                  alt={title || "Banner"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className={`w-full md:w-1/2 ${
              isImageLeft ? "md:text-left" : "md:text-right"
            } text-center`}
            style={{ color: textColor }}
          >
            {subtitle && (
              <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-lg mb-8 opacity-90">{description}</p>
            )}
            {buttonText && (
              <button
                onClick={handleButtonClick}
                className="px-10 py-4 text-lg font-bold rounded-lg transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
