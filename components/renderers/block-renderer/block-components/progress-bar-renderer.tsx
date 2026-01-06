/**
 * ========================================
 * PROGRESS BAR RENDERER
 * ========================================
 *
 * Renders a progress bar that syncs with Swiper slide changes
 * Used for Hero1 carousel progress indicator
 */

"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { parseWrapper, convertStyleToCSS } from "@/lib/block-utils";
import { getSwiperInstance } from "./swiper-renderer";
import type { Block, BlockRendererProps } from "..";

export interface ProgressBarRendererProps {
  block: Block;
  data: Record<string, unknown>;
  context: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
  className?: string;
}

/**
 * Progress Bar Renderer Component
 * Syncs with a Swiper instance to show progressive fill
 */
export default function ProgressBarRenderer({
  block,
  data,
  context,
  className = "",
}: ProgressBarRendererProps) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Merge block.data with incoming data
  const mergedData = useMemo(() => {
    const blockData = (block.data as Record<string, unknown>) || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Get swiper target and total slides from block data
  const swiperTarget = (mergedData.swiper_target as string) || "swiper";
  const totalSlides = (mergedData.total_slides as number) || 1;

  // Parse wrapper
  const { id, classes } = parseWrapper(block.wrapper || "div");

  // Build className
  const blockClass = block.class || "";
  const wrapperClasses = classes.join(" ");
  const finalClassName = [wrapperClasses, blockClass, className]
    .filter(Boolean)
    .join(" ");

  // Build style
  const baseStyle = convertStyleToCSS(
    block.style,
    mergedData,
    context,
    block.bind_style as Record<string, unknown>
  );

  useEffect(() => {
    // Function to find swiper and set up listener
    const setupSwiperListener = () => {
      // Try to find the swiper instance
      const swiper = getSwiperInstance(swiperTarget);

      // If not found by exact ID, try to find any swiper starting with the target prefix
      if (!swiper) {
        // Wait a bit and try again - swiper might not be registered yet
        return false;
      }

      // Calculate initial progress
      const updateProgress = () => {
        if (swiper) {
          const activeIndex = swiper.realIndex ?? swiper.activeIndex ?? 0;
          const newProgress = ((activeIndex + 1) / totalSlides) * 100;
          setProgress(newProgress);
        }
      };

      // Set initial progress
      updateProgress();

      // Listen for slide changes
      swiper.on("slideChange", updateProgress);
      swiper.on("slideChangeTransitionEnd", updateProgress);

      // Cleanup function
      return () => {
        swiper?.off("slideChange", updateProgress);
        swiper?.off("slideChangeTransitionEnd", updateProgress);
      };
    };

    // Try to set up immediately
    const cleanup = setupSwiperListener();
    
    if (cleanup === false) {
      // Swiper not ready, poll for it
      intervalRef.current = setInterval(() => {
        const result = setupSwiperListener();
        if (result !== false && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [swiperTarget, totalSlides]);

  // Dynamic style with progress width
  const style = {
    ...baseStyle,
    width: `${progress}%`,
  };

  return (
    <div
      id={id || block.id}
      className={finalClassName}
      style={style}
      data-progress={progress}
      data-swiper-target={swiperTarget}
    />
  );
}
