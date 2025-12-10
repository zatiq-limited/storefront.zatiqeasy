/**
 * ========================================
 * SWIPER RENDERER
 * ========================================
 *
 * Handles V3.0 Schema swiper/carousel blocks
 * Integrates with Swiper.js for slider functionality
 */

"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import {
  parseWrapper,
  convertStyleToCSS,
  generateBlockKey,
} from "@/lib/block-utils";
import type { Block, BlockRendererProps } from "../BlockRenderer";

// Lazy import BlockRenderer to avoid circular dependency
const BlockRenderer = React.lazy(() => import("../BlockRenderer"));

export interface SwiperConfig {
  slides_per_view?: number;
  space_between?: number;
  loop?: boolean;
  effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
  fade_effect?: {
    cross_fade?: boolean;
  };
  autoplay?:
    | {
        delay?: number;
        disable_on_interaction?: boolean;
      }
    | boolean;
  breakpoints?: Record<
    string,
    {
      slides_per_view?: number;
      space_between?: number;
    }
  >;
  navigation?: boolean;
  pagination?:
    | boolean
    | {
        clickable?: boolean;
        type?: "bullets" | "fraction" | "progressbar";
      };
}

export interface SwiperRendererProps {
  block: Block;
  data: Record<string, unknown>;
  context: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
  className?: string;
}

/**
 * Swiper Renderer Component
 * Handles blocks with type: 'swiper'
 *
 * Example block:
 * {
 *   wrapper: 'div',
 *   type: 'swiper',
 *   class: 'w-full px-2',
 *   config: {
 *     slides_per_view: 3,
 *     space_between: 24,
 *     autoplay: { delay: 3000, disable_on_interaction: false },
 *     breakpoints: { 640: { slides_per_view: 2 }, 1024: { slides_per_view: 3 } }
 *   },
 *   blocks: [{ type: 'repeater', source: 'products', ... }]
 * }
 */
export default function SwiperRenderer({
  block,
  data,
  context,
  eventHandlers,
  className = "",
}: SwiperRendererProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const config = (block.config || {}) as SwiperConfig;

  // Merge block.data with incoming data (block.data takes precedence)
  const mergedData = useMemo(() => {
    const blockData = (block.data as Record<string, unknown>) || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Parse wrapper
  const { tag, id, classes } = parseWrapper(block.wrapper || "div");

  // Build className
  const blockClass = block.class || "";
  const wrapperClasses = classes.join(" ");
  const finalClassName = [wrapperClasses, blockClass, className]
    .filter(Boolean)
    .join(" ");

  // Build style
  const style = convertStyleToCSS(block.style);

  // Convert snake_case config to Swiper format
  const swiperConfig = useMemo(() => {
    const modules = [Navigation, Pagination, Autoplay];

    // Add effect module if using fade
    if (config.effect === "fade") {
      modules.push(EffectFade);
    }

    const swiperOptions: Record<string, unknown> = {
      modules,
      slidesPerView: config.slides_per_view || 1,
      spaceBetween: config.space_between || 0,
      loop: config.loop ?? false,
    };

    // Effect
    if (config.effect) {
      swiperOptions.effect = config.effect;
      if (config.effect === "fade" && config.fade_effect) {
        swiperOptions.fadeEffect = {
          crossFade: config.fade_effect.cross_fade ?? true,
        };
      }
    }

    // Autoplay
    if (config.autoplay) {
      if (typeof config.autoplay === "boolean") {
        swiperOptions.autoplay = { delay: 3000 };
      } else {
        swiperOptions.autoplay = {
          delay: config.autoplay.delay || 3000,
          disableOnInteraction: config.autoplay.disable_on_interaction ?? false,
        };
      }
    }

    // Breakpoints
    if (config.breakpoints) {
      const breakpoints: Record<number, Record<string, unknown>> = {};
      Object.entries(config.breakpoints).forEach(([key, value]) => {
        breakpoints[Number(key)] = {
          slidesPerView: value.slides_per_view,
          spaceBetween: value.space_between,
        };
      });
      swiperOptions.breakpoints = breakpoints;
    }

    // Navigation
    if (config.navigation) {
      swiperOptions.navigation = true;
    }

    // Pagination
    if (config.pagination) {
      if (typeof config.pagination === "boolean") {
        swiperOptions.pagination = { clickable: true };
      } else {
        swiperOptions.pagination = {
          clickable: config.pagination.clickable ?? true,
          type: config.pagination.type || "bullets",
        };
      }
    }

    return swiperOptions;
  }, [config]);

  // Extended event handlers with swiper controls
  const extendedEventHandlers = useMemo(
    () => ({
      ...eventHandlers,
      sliderPrev: () => {
        swiperRef.current?.slidePrev();
      },
      sliderNext: () => {
        swiperRef.current?.slideNext();
      },
      sliderGoto: (index: number) => {
        swiperRef.current?.slideTo(index);
      },
    }),
    [eventHandlers]
  );

  // Handle swiper instance
  const onSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
  }, []);

  // Extract slides from blocks
  // Blocks might contain a repeater or direct slide elements
  const childBlocks = block.blocks || [];

  // Check if first child is a repeater
  const hasRepeater =
    childBlocks.length > 0 && childBlocks[0]?.type === "repeater";

  if (hasRepeater) {
    // Render with repeater - each repeated item becomes a slide
    const repeaterBlock = childBlocks[0];
    const { source, iterator = "item", template } = repeaterBlock;

    if (!source || !template) {
      console.warn("SwiperRenderer: Repeater missing source or template");
      return null;
    }

    // Get source array from data or context
    // First check mergedData (which includes block.data), then context
    let sourceArray = (mergedData[source] as unknown[]) || [];
    if (sourceArray.length === 0 && context[source]) {
      sourceArray = (context[source] as unknown[]) || [];
    }

    if (sourceArray.length === 0) {
      if (import.meta.env.DEV) {
        console.warn(`SwiperRenderer: Source "${source}" not found or empty`, {
          data: mergedData,
          context,
        });
      }
      return null;
    }

    return (
      <div id={id || block.id} className={finalClassName} style={style}>
        <Swiper {...swiperConfig} onSwiper={onSwiper}>
          {sourceArray.map((item, idx) => {
            const itemContext = {
              ...context,
              [iterator]: item,
            };

            const itemKey = generateSlideKey(item, idx, iterator);

            return (
              <SwiperSlide key={itemKey}>
                <React.Suspense fallback={null}>
                  <BlockRenderer
                    block={template}
                    data={mergedData}
                    context={itemContext}
                    eventHandlers={extendedEventHandlers}
                  />
                </React.Suspense>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }

  // Direct slides - each child block is a slide
  return (
    <div id={id || block.id} className={finalClassName} style={style}>
      <Swiper {...swiperConfig} onSwiper={onSwiper}>
        {childBlocks.map((childBlock, index) => (
          <SwiperSlide key={generateBlockKey(childBlock, index)}>
            <React.Suspense fallback={null}>
              <BlockRenderer
                block={childBlock}
                data={mergedData}
                context={context}
                eventHandlers={extendedEventHandlers}
              />
            </React.Suspense>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

/**
 * Generate unique key for slide
 */
function generateSlideKey(
  item: unknown,
  index: number,
  iterator: string
): string {
  if (item && typeof item === "object") {
    const itemObj = item as Record<string, unknown>;
    if (itemObj.id) return `slide-${iterator}-${itemObj.id}`;
    if (itemObj.name) return `slide-${iterator}-${itemObj.name}-${index}`;
  }
  return `slide-${iterator}-${index}`;
}
