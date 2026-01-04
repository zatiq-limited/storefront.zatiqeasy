/**
 * Landing Testimonials 1
 * Customer reviews in grid layout
 */

"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  name?: string;
  avatar?: string;
  rating?: number;
  text?: string;
  verified?: boolean;
}

interface LandingTestimonials1Settings {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  columns?: number;
  showRating?: boolean;
  showVerified?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  textColor?: string;
  starColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingTestimonials1Props {
  settings: LandingTestimonials1Settings;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "John Doe",
    avatar: "",
    rating: 5,
    text: "Amazing product! Exactly what I was looking for. Fast delivery too!",
    verified: true,
  },
  {
    name: "Jane Smith",
    avatar: "",
    rating: 5,
    text: "Best purchase I have made this year. Highly recommended!",
    verified: true,
  },
  {
    name: "Mike Johnson",
    avatar: "",
    rating: 4,
    text: "Great quality and excellent customer service.",
    verified: true,
  },
];

export default function LandingTestimonials1({
  settings,
}: LandingTestimonials1Props) {
  const {
    title = "What Our Customers Say",
    subtitle = "Real reviews from real customers",
    testimonials = defaultTestimonials,
    columns = 3,
    showRating = true,
    showVerified = true,
    backgroundColor = "#FFFFFF",
    titleColor = "#111827",
    cardBgColor = "#F9FAFB",
    textColor = "#4B5563",
    starColor = "#FBBF24",
    fontFamily = "inherit",
  } = settings;

  const gridColsClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
      ? "md:grid-cols-4"
      : "md:grid-cols-3";

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-5 h-5"
            fill={star <= rating ? starColor : "transparent"}
            stroke={starColor}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
              {subtitle}
            </p>
          )}
          {title && (
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: titleColor }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl transition-shadow hover:shadow-lg"
              style={{ backgroundColor: cardBgColor }}
            >
              {/* Rating */}
              {showRating && testimonial.rating && (
                <div className="mb-4">{renderStars(testimonial.rating)}</div>
              )}

              {/* Text */}
              {testimonial.text && (
                <p
                  className="mb-4 leading-relaxed"
                  style={{ color: textColor }}
                >
                  &quot;{testimonial.text}&quot;
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name || "Customer"}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">
                      {getInitials(testimonial.name || "U")}
                    </span>
                  )}
                </div>

                {/* Name & Verified */}
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: titleColor }}
                  >
                    {testimonial.name}
                  </p>
                  {showVerified && testimonial.verified && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified Buyer
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
