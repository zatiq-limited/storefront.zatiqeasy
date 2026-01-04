/**
 * Landing Navbar 1
 * Simple navbar with logo and CTA
 */

"use client";

import React from "react";
import Image from "next/image";

interface LandingNavbar1Settings {
  showLogo?: boolean;
  logoPosition?: "left" | "center";
  showMessage?: boolean;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  messageColor?: string;
  ctaBgColor?: string;
  ctaTextColor?: string;
  sticky?: boolean;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingNavbar1Props {
  settings: LandingNavbar1Settings;
  shopLogo?: string;
  shopName?: string;
  onScrollToCheckout?: () => void;
}

export default function LandingNavbar1({
  settings,
  shopLogo,
  shopName = "Store",
  onScrollToCheckout,
}: LandingNavbar1Props) {
  const {
    showLogo = true,
    logoPosition = "left",
    showMessage = true,
    message = "🔥 Limited Time Offer - Order Now!",
    ctaText = "Order Now",
    ctaLink = "checkout",
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    messageColor = "#DC2626",
    ctaBgColor = "#DC2626",
    ctaTextColor = "#FFFFFF",
    sticky = true,
    fontFamily = "inherit",
  } = settings;

  const handleCtaClick = () => {
    if (ctaLink === "checkout" && onScrollToCheckout) {
      onScrollToCheckout();
    } else if (ctaLink && ctaLink.startsWith("http")) {
      window.open(ctaLink, "_blank");
    } else if (ctaLink) {
      const element = document.getElementById(ctaLink);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`${sticky ? "sticky top-0 z-50" : ""} shadow-sm`}
      style={{ backgroundColor, fontFamily }}
    >
      {/* Top Message Bar */}
      {showMessage && message && (
        <div
          className="py-2 px-4 text-center text-sm font-medium"
          style={{ backgroundColor: messageColor, color: "#FFFFFF" }}
        >
          {message}
        </div>
      )}

      {/* Main Navbar */}
      <nav className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          {showLogo && (
            <div
              className={`${
                logoPosition === "center"
                  ? "absolute left-1/2 -translate-x-1/2"
                  : ""
              }`}
            >
              {shopLogo ? (
                <Image
                  src={shopLogo}
                  alt={shopName}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span
                  className="text-xl font-bold"
                  style={{ color: textColor }}
                >
                  {shopName}
                </span>
              )}
            </div>
          )}

          {/* Spacer for centered logo */}
          {logoPosition === "center" && <div />}

          {/* CTA Button */}
          {ctaText && (
            <button
              onClick={handleCtaClick}
              className="px-6 py-2 text-sm font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-md"
              style={{
                backgroundColor: ctaBgColor,
                color: ctaTextColor,
              }}
            >
              {ctaText}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
