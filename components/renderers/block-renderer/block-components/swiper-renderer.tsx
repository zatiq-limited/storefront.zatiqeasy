/**
 * ========================================
 * SWIPER RENDERER
 * ========================================
 *
 * Handles V3.0 Schema swiper/carousel blocks
 * Integrates with Swiper.js for slider functionality
 */

"use client";

import React, { useMemo, useRef, useCallback, useEffect, useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCoverflow,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";

import {
  parseWrapper,
  convertStyleToCSS,
  generateBlockKey,
} from "@/lib/block-utils";
import type { Block, BlockRendererProps } from "..";

// Lazy import BlockRenderer to avoid circular dependency
const BlockRenderer = React.lazy(() => import(".."));

// Global Swiper Registry - uses Map for ordered iteration
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

/**
 * Find swiper by target ID - improved matching logic
 * Priority: exact match > partial match > first registered
 */
function findSwiperByTarget(target: string): SwiperType | undefined {
  // 1. Exact match
  if (swiperRegistry.has(target)) {
    return swiperRegistry.get(target);
  }

  // 2. Find swiper whose ID contains the target or vice versa
  for (const [key, value] of swiperRegistry.entries()) {
    // Match hero-1-swiper-xxx with target "hero-1-swiper-xxx" or partial
    if (key.includes(target) || target.includes(key)) {
      return value;
    }
    // Match section ID pattern (hero-1-xxx targets hero-1-swiper-xxx)
    const keyPrefix = key.split('-swiper-')[0];
    const targetPrefix = target.split('-swiper-')[0];
    if (keyPrefix && targetPrefix && keyPrefix === targetPrefix) {
      return value;
    }
  }

  // 3. Fallback to most recently registered (last in map)
  const entries = Array.from(swiperRegistry.entries());
  if (entries.length > 0) {
    return entries[entries.length - 1][1];
  }

  return undefined;
}

export function globalSliderPrev(target: string = "swiper") {
  const swiper = findSwiperByTarget(target);
  swiper?.slidePrev();
}

export function globalSliderNext(target: string = "swiper") {
  const swiper = findSwiperByTarget(target);
  swiper?.slideNext();
}

export function globalSliderGoto(index: number, target: string = "swiper") {
  const swiper = findSwiperByTarget(target);
  swiper?.slideTo(index);
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
  fade_effect?: { cross_fade?: boolean };
  disable_on_interaction?: boolean;
  centered_slides?: boolean;
  slidesPerView?: number;
  spaceBetween?: number;
  disableOnInteraction?: boolean;
  centeredSlides?: boolean;
  loop?: boolean;
  effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
  autoplay?:
    | {
        delay?: number;
        disable_on_interaction?: boolean;
        disableOnInteraction?: boolean;
      }
    | boolean;
  breakpoints?: Record<
    string,
    {
      slides_per_view?: number;
      space_between?: number;
      slidesPerView?: number;
      spaceBetween?: number;
    }
  >;
  navigation?: boolean;
  pagination?:
    | boolean
    | {
        clickable?: boolean;
        type?: "bullets" | "fraction" | "progressbar";
      };
  coverflow_effect?: {
    rotate?: number;
    stretch?: number;
    depth?: number;
    modifier?: number;
    slide_shadows?: boolean;
    slideShadows?: boolean;
  };
  coverflowEffect?: {
    rotate?: number;
    stretch?: number;
    depth?: number;
    modifier?: number;
    slideShadows?: boolean;
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
 */
export default function SwiperRenderer({
  block,
  data,
  context,
  eventHandlers,
  className = "",
}: SwiperRendererProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Merge block.data with incoming data
  const mergedData = useMemo(() => {
    const blockData = (block.data as Record<string, unknown>) || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Parse wrapper
  const { id, classes } = parseWrapper(block.wrapper || "div");

  // Build className
  const blockClass = block.class || "";
  const wrapperClasses = classes.join(" ");
  const finalClassName = [wrapperClasses, blockClass, className]
    .filter(Boolean)
    .join(" ");

  // Build style
  const style = convertStyleToCSS(
    block.style,
    mergedData,
    context,
    block.bind_style as Record<string, unknown>
  );

  // Convert config to Swiper format
  const swiperConfig = useMemo(() => {
    const config = (block.config || {}) as SwiperConfig;
    const modules = [Navigation, Autoplay];

    if (config.pagination) {
      modules.push(Pagination);
    }

    if (config.effect === "fade") {
      modules.push(EffectFade);
    }

    if (config.effect === "coverflow") {
      modules.push(EffectCoverflow);
    }

    const baseSlidesPerView =
      config.slidesPerView ?? config.slides_per_view ?? 1;
    const baseSpaceBetween = config.spaceBetween ?? config.space_between ?? 0;
    const centeredSlides =
      config.centeredSlides ?? config.centered_slides ?? false;

    const swiperOptions: Record<string, unknown> = {
      modules,
      slidesPerView: baseSlidesPerView,
      spaceBetween: baseSpaceBetween,
      loop: config.loop ?? false,
      centeredSlides,
    };

    if (config.effect) {
      swiperOptions.effect = config.effect;
      if (config.effect === "fade" && config.fade_effect) {
        swiperOptions.fadeEffect = {
          crossFade: config.fade_effect.cross_fade ?? true,
        };
      }
      if (config.effect === "coverflow") {
        const coverflowConfig =
          config.coverflowEffect ?? config.coverflow_effect ?? {};
        swiperOptions.coverflowEffect = {
          rotate: coverflowConfig.rotate ?? 0,
          stretch: coverflowConfig.stretch ?? 0,
          depth: coverflowConfig.depth ?? 100,
          modifier: coverflowConfig.modifier ?? 2.5,
          slideShadows: coverflowConfig.slideShadows ?? false,
        };
      }
    }

    if (config.autoplay) {
      if (typeof config.autoplay === "boolean") {
        swiperOptions.autoplay = { delay: 3000, pauseOnMouseEnter: true };
      } else {
        swiperOptions.autoplay = {
          delay: config.autoplay.delay || 3000,
          disableOnInteraction:
            config.autoplay.disableOnInteraction ??
            config.autoplay.disable_on_interaction ??
            false,
          pauseOnMouseEnter:
            (config.autoplay as Record<string, unknown>).pauseOnMouseEnter ??
            (config.autoplay as Record<string, unknown>).pause_on_mouse_enter ??
            true,
        };
      }
    }

    if (config.breakpoints) {
      const breakpoints: Record<number, Record<string, unknown>> = {};
      Object.entries(config.breakpoints).forEach(([key, value]) => {
        const breakpointConfig: Record<string, unknown> = {};

        const slidesPerView = value.slidesPerView ?? value.slides_per_view;
        const spaceBetween = value.spaceBetween ?? value.space_between;

        if (slidesPerView !== undefined) {
          breakpointConfig.slidesPerView = slidesPerView;
        }
        if (spaceBetween !== undefined) {
          breakpointConfig.spaceBetween = spaceBetween;
        }

        breakpoints[Number(key)] = breakpointConfig;
      });
      swiperOptions.breakpoints = breakpoints;
    }

    if (config.navigation) {
      swiperOptions.navigation = true;
    }

    if (config.pagination) {
      if (typeof config.pagination === "boolean") {
        swiperOptions.pagination = { clickable: true };
      } else {
        swiperOptions.pagination = {
          clickable: config.pagination.clickable ?? true,
          type: config.pagination.type || "bullets",
          el: config.pagination.type === "progressbar" ? ".swiper-pagination" : undefined,
        };
      }
    } else {
      swiperOptions.pagination = false;
    }

    return swiperOptions;
  }, [block.config]);

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

  // Generate a stable unique ID for this swiper instance
  const reactId = useId();
  const swiperId = id || block.id || `swiper-${reactId}`;

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle swiper instance and register globally
  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      registerSwiper(swiperId, swiper);

      if (!swiperRegistry.has("swiper")) {
        registerSwiper("swiper", swiper);
      }

      if (containerRef.current) {
        const section = containerRef.current.closest(
          'section[id^="hero-"], section[id^="reviews-"], section[id]'
        );
        if (section) {
          registerSwiper(section.id, swiper);
        }
      }
    },
    [swiperId]
  );

  useEffect(() => {
    if (swiperRef.current && containerRef.current) {
      const section = containerRef.current.closest(
        'section[id^="hero-"], section[id^="reviews-"], section[id]'
      );
      if (section) {
        registerSwiper(section.id, swiperRef.current);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    return () => {
      unregisterSwiper(swiperId);
      if (container) {
        const section = container.closest(
          'section[id^="hero-"], section[id^="reviews-"], section[id]'
        );
        if (section) {
          unregisterSwiper(section.id);
        }
      }
    };
  }, [swiperId]);

  const childBlocks = block.blocks || [];
  const hasRepeater =
    childBlocks.length > 0 && childBlocks[0]?.type === "repeater";

  if (hasRepeater) {
    const repeaterBlock = childBlocks[0];
    const { source, iterator = "item", template } = repeaterBlock;

    if (!source || !template) {
      console.warn("SwiperRenderer: Repeater missing source or template");
      return null;
    }

    let sourceArray = (mergedData[source] as unknown[]) || [];
    if (sourceArray.length === 0 && context[source]) {
      sourceArray = (context[source] as unknown[]) || [];
    }

    if (sourceArray.length === 0) {
      if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
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

  // Direct slides
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
