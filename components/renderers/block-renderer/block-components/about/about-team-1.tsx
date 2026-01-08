/**
 * ========================================
 * ABOUT TEAM 1 RENDERER
 * ========================================
 *
 * Team section with Swiper carousel functionality
 * Matches merchant-panel AboutTeam1 component exactly
 */

"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Block, BlockRendererProps } from "../../index";
import { convertStyleToCSS, parseWrapper } from "@/lib/block-utils";
import { FallbackImage } from "@/components/ui/fallback-image";

// Team member interface
interface TeamMember {
  name?: string;
  role?: string;
  image?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  linkedin?: string;
  twitter?: string;
  email?: string;
  mailto_href?: string;
}

export interface AboutTeam1RendererProps {
  block: Block;
  data: Record<string, unknown>;
  context: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
  className?: string;
}

/**
 * About Team 1 - Swiper carousel with team members
 * Mirrors the merchant-panel AboutTeam1 component exactly
 */
export default function AboutTeam1Renderer({
  block,
  data,
  context,
  className = "",
}: AboutTeam1RendererProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Merge block.data with incoming data
  const mergedData = useMemo(() => {
    const blockData = (block.data as Record<string, unknown>) || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Extract settings from merged data
  const backgroundColor = (mergedData.background_color as string) || (mergedData.backgroundColor as string) || "#FFFFFF";
  const textColor = (mergedData.text_color as string) || (mergedData.textColor as string) || "#111827";
  const title = (mergedData.title as string) || "Meet Our Team";
  const subtitle = (mergedData.subtitle as string) || "The talented people behind our success";
  const borderRadius = (mergedData.border_radius as string) || (mergedData.borderRadius as string) || "12px";
  const autoPlay = (mergedData.auto_play as boolean) ?? (mergedData.autoPlay as boolean) ?? true;
  const autoPlayDelay = (mergedData.auto_play_delay as number) || (mergedData.autoPlayDelay as number) || 4000;

  // Extract team members from data
  const teamMembers: TeamMember[] = (mergedData.team_members as TeamMember[]) || 
    (mergedData.teamMembers as TeamMember[]) || 
    (mergedData.blocks as TeamMember[]) || [];

  // State for autoplay control
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Default team members for preview
  const defaultMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
      bio: "Visionary leader with 15+ years in e-commerce",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "sarah@example.com",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
      bio: "Tech innovator driving our digital transformation",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces",
      bio: "Creative designer crafting exceptional experiences",
      linkedin: "https://linkedin.com",
      email: "emily@example.com",
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces",
      bio: "Marketing strategist connecting brands with customers",
      twitter: "https://twitter.com",
      email: "david@example.com",
    },
    {
      name: "Jennifer Smith",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
      bio: "Operations expert optimizing business processes",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "jennifer@example.com",
    },
  ];

  // Normalize team member data structure
  const normalizeTeamMember = (member: TeamMember): TeamMember => {
    return {
      ...member,
      social: member.social || {
        linkedin: member.linkedin,
        twitter: member.twitter,
        email: member.email || (member.mailto_href ? member.mailto_href.replace("mailto:", "") : undefined),
      },
    };
  };

  const displayMembers = teamMembers.length > 0 
    ? teamMembers.map(normalizeTeamMember) 
    : defaultMembers;

  // Parse wrapper for id and classes
  const { id, classes } = parseWrapper(block.wrapper || "section");
  const blockClass = block.class || "";
  const wrapperClasses = classes.join(" ");
  const finalClassName = [wrapperClasses, blockClass, className].filter(Boolean).join(" ");

  // Build style
  const style = convertStyleToCSS(block.style, mergedData, context, block.bind_style as Record<string, unknown>);

  // Toggle autoplay
  const toggleAutoPlay = useCallback(() => {
    if (swiperRef.current) {
      if (isAutoPlaying) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
      setIsAutoPlaying(!isAutoPlaying);
    }
  }, [isAutoPlaying]);

  // Button size
  const buttonSize = 40;

  return (
    <section
      id={id || block.id}
      className={`w-full pb-12 sm:pb-16 lg:pb-24 overflow-hidden ${finalClassName}`}
      style={{ backgroundColor, ...style }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation */}
        <div className="flex items-center justify-between mb-8 sm:mb-12 lg:mb-16">
          <div className="text-center flex-1">
            <h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            <p
              className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
              style={{ color: textColor, opacity: 0.7 }}
            >
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls - Hidden on mobile */}
          {displayMembers.length > 3 && (
            <div className="hidden sm:flex items-center gap-2 ml-4">
              {/* Pause/Play Button */}
              {autoPlay && (
                <button
                  onClick={toggleAutoPlay}
                  className="rounded-full border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all"
                  style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
                  aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
                >
                  {isAutoPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              )}
              {/* Previous Button */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="rounded-full border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all"
                style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {/* Next Button */}
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="rounded-full border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all"
                style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.3}
          spaceBetween={12}
          centeredSlides={false}
          loop={displayMembers.length > 4}
          autoplay={
            autoPlay
              ? { delay: autoPlayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }
              : false
          }
          pagination={{ clickable: true, dynamicBullets: true }}
          modules={[Navigation, Autoplay, Pagination]}
          breakpoints={{
            640: { slidesPerView: 2.5, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="pb-10"
        >
          {displayMembers.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="group pb-10">
                <div
                  className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
                  style={{ borderRadius }}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square overflow-hidden">
                    <FallbackImage
                      src={member.image || ""}
                      alt={member.name || "Team member"}
                      fill
                      sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 lg:p-5">
                    <h3
                      className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 truncate"
                      style={{ color: textColor }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 truncate"
                      style={{ color: textColor, opacity: 0.6 }}
                    >
                      {member.role}
                    </p>
                    {member.bio && (
                      <p
                        className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2"
                        style={{ color: textColor, opacity: 0.7 }}
                      >
                        {member.bio}
                      </p>
                    )}

                    {/* Social Links */}
                    {member.social && (
                      <div className="flex gap-2 sm:gap-3">
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                        {member.social.email && (
                          <a
                            href={`mailto:${member.social.email}`}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
