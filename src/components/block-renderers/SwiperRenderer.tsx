/**
 * ========================================
 * SWIPER RENDERER
 * ========================================
 *
 * Handles V3.0 Schema swiper/carousel blocks
 * Integrates with Swiper.js for slider functionality
 */

"use client";

import React, { useMemo, useRef, useCallback, useEffect } from "react";
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

// ============================================
// Global Swiper Registry
// ============================================
// This allows navigation buttons outside the Swiper to control it

const swiperRegistry: Map<string, SwiperType> = new Map();

export function registerSwiper(id: string, swiper: SwiperType) {
  swiperRegistry.set(id, swiper);
}

export function unregisterSwiper(id: string) {
  swiperRegistry.delete(id);
}

export function getSwiperInstance(id: string): SwiperType | undefined {
  return swiperRegistry.get(id);
}

// Global functions to control swipers from outside
export function globalSliderPrev(target: string = "swiper") {
  // Try to find a swiper by target name first
  let swiper = swiperRegistry.get(target);

  // If not found by exact name, try to find one that contains the target in its ID
  if (!swiper) {
    for (const [key, value] of swiperRegistry.entries()) {
      if (key.includes(target) || target.includes(key.split("-")[0])) {
        swiper = value;
        break;
      }
    }
  }

  // Fallback to the most recently registered swiper
  if (!swiper) {
    const entries = Array.from(swiperRegistry.entries());
    if (entries.length > 0) {
      swiper = entries[entries.length - 1][1];
    }
  }

  swiper?.slidePrev();
}

export function globalSliderNext(target: string = "swiper") {
  // Try to find a swiper by target name first
  let swiper = swiperRegistry.get(target);

  // If not found by exact name, try to find one that contains the target in its ID
  if (!swiper) {
    for (const [key, value] of swiperRegistry.entries()) {
      if (key.includes(target) || target.includes(key.split("-")[0])) {
        swiper = value;
        break;
      }
    }
  }

  // Fallback to the most recently registered swiper
  if (!swiper) {
    const entries = Array.from(swiperRegistry.entries());
    if (entries.length > 0) {
      swiper = entries[entries.length - 1][1];
    }
  }

  swiper?.slideNext();
}

export function globalSliderGoto(index: number, target: string = "swiper") {
  let swiper = swiperRegistry.get(target);

  if (!swiper) {
    for (const [key, value] of swiperRegistry.entries()) {
      if (key.includes(target) || target.includes(key.split("-")[0])) {
        swiper = value;
        break;
      }
    }
  }

  if (!swiper) {
    const entries = Array.from(swiperRegistry.entries());
    if (entries.length > 0) {
      swiper = entries[entries.length - 1][1];
    }
  }

  swiper?.slideTo(index);
}

// Find swiper by looking at the DOM - finds the closest swiper to a given element
export function findClosestSwiper(
  element: HTMLElement | null
): SwiperType | undefined {
  if (!element) return undefined;

  // Look for closest section with hero ID
  const heroSection = element.closest('section[id^="hero-"]');
  if (heroSection) {
    const sectionId = heroSection.id;
    // Try to find swiper registered with this section's ID pattern
    for (const [key, swiper] of swiperRegistry.entries()) {
      if (key.includes(sectionId.split("-").slice(0, 2).join("-"))) {
        return swiper;
      }
    }
  }

  // Fallback: return the last registered swiper
  const entries = Array.from(swiperRegistry.entries());
  return entries.length > 0 ? entries[entries.length - 1][1] : undefined;
}

// Attach to window for global access
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__swiperRegistry = {
    prev: globalSliderPrev,
    next: globalSliderNext,
    goto: globalSliderGoto,
    get: getSwiperInstance,
  };
}

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

  // Build style - pass data and context to resolve style bindings (including bind_style for gradients)
  const style = convertStyleToCSS(
    block.style,
    mergedData,
    context,
    block.bind_style as Record<string, unknown>
  );

  // Convert snake_case config to Swiper format
  const swiperConfig = useMemo(() => {
    // Only include modules that are actually needed
    const modules = [Navigation, Autoplay];

    // Add Pagination module only if pagination is configured
    if (config.pagination) {
      modules.push(Pagination);
    }

    // Add effect module if using fade
    if (config.effect === "fade") {
      modules.push(EffectFade);
    }

    // When breakpoints are configured, the base slidesPerView should be 1 (mobile-first)
    // The breakpoints will override for larger screens
    const hasBreakpoints =
      config.breakpoints && Object.keys(config.breakpoints).length > 0;

    const swiperOptions: Record<string, unknown> = {
      modules,
      // Use 1 as base when breakpoints exist (mobile-first), otherwise use config value
      slidesPerView: hasBreakpoints ? 1 : config.slides_per_view || 1,
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
        const breakpointConfig: Record<string, unknown> = {};

        // Only add properties that are defined
        if (value.slides_per_view !== undefined) {
          breakpointConfig.slidesPerView = value.slides_per_view;
        }
        if (value.space_between !== undefined) {
          breakpointConfig.spaceBetween = value.space_between;
        }

        breakpoints[Number(key)] = breakpointConfig;
      });
      swiperOptions.breakpoints = breakpoints;
    }

    // Navigation
    if (config.navigation) {
      swiperOptions.navigation = true;
    }

    // Pagination - explicitly disable if not configured
    if (config.pagination) {
      if (typeof config.pagination === "boolean") {
        swiperOptions.pagination = { clickable: true };
      } else {
        swiperOptions.pagination = {
          clickable: config.pagination.clickable ?? true,
          type: config.pagination.type || "bullets",
        };
      }
    } else {
      // Explicitly disable pagination to prevent any default behavior
      swiperOptions.pagination = false;
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

  // Generate a unique ID for this swiper instance
  const swiperId = useMemo(() => {
    return (
      id ||
      block.id ||
      `swiper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );
  }, [id, block.id]);

  // Ref to store the container element for finding parent section
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle swiper instance and register globally
  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      // Register this swiper instance globally so external buttons can control it
      registerSwiper(swiperId, swiper);

      // Also register with generic "swiper" key - but don't overwrite if it already exists
      // This ensures the first swiper gets the "swiper" key
      if (!swiperRegistry.has("swiper")) {
        registerSwiper("swiper", swiper);
      }

      // Try to find parent section and register with section ID
      // This allows arrows outside the swiper to find the correct swiper
      if (containerRef.current) {
        const section = containerRef.current.closest('section[id^="hero-"]');
        if (section) {
          registerSwiper(section.id, swiper);
        }
      }
    },
    [swiperId]
  );

  // Also register when the component mounts (in case onSwiper fired before ref was set)
  useEffect(() => {
    if (swiperRef.current && containerRef.current) {
      const section = containerRef.current.closest('section[id^="hero-"]');
      if (section) {
        registerSwiper(section.id, swiperRef.current);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unregisterSwiper(swiperId);
      // Also unregister section-based key if it exists
      if (containerRef.current) {
        const section = containerRef.current.closest('section[id^="hero-"]');
        if (section) {
          unregisterSwiper(section.id);
        }
      }
    };
  }, [swiperId]);

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
      <div
        ref={containerRef}
        id={id || block.id}
        className={finalClassName}
        style={style}
      >
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
    <div
      ref={containerRef}
      id={id || block.id}
      className={finalClassName}
      style={style}
    >
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
