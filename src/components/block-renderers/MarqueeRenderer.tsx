/**
 * ========================================
 * MARQUEE RENDERER
 * ========================================
 *
 * Handles V3.0 Schema marquee animation blocks
 * Creates smooth scrolling/sliding animation effect
 */

"use client";

import React, { useMemo } from "react";
import {
  parseWrapper,
  convertStyleToCSS,
  generateBlockKey,
} from "@/lib/block-utils";
import type { Block, BlockRendererProps } from "../BlockRenderer";

// Lazy import BlockRenderer to avoid circular dependency
const BlockRenderer = React.lazy(() => import("../BlockRenderer"));

export interface MarqueeRendererProps {
  block: Block;
  data: Record<string, unknown>;
  context: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
  className?: string;
}

/**
 * Marquee Renderer Component
 * Handles blocks with type: 'marquee' or animation.type: 'marquee'
 *
 * Example block:
 * {
 *   wrapper: 'div',
 *   type: 'marquee',
 *   class: 'flex',
 *   animation: { type: 'marquee', direction: 'left', duration: 8, repeat: 'infinite' },
 *   blocks: [...]
 * }
 */
export default function MarqueeRenderer({
  block,
  data,
  context,
  eventHandlers,
  className = "",
}: MarqueeRendererProps) {
  const { animation, blocks = [] } = block;

  // Merge block.data with incoming data (block.data takes precedence)
  const mergedData = useMemo(() => {
    const blockData = (block.data as Record<string, unknown>) || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Get animation settings
  const direction = animation?.direction || "left";
  const duration = animation?.duration || 8;
  const repeat = animation?.repeat || "infinite";

  // Parse wrapper
  const { tag, id, classes } = parseWrapper(block.wrapper || "div");

  // Build className
  const blockClass = block.class || "";
  const wrapperClasses = classes.join(" ");
  const finalClassName = [wrapperClasses, blockClass, className]
    .filter(Boolean)
    .join(" ");

  // Build style with animation - pass data and context to resolve style bindings
  const baseStyle = convertStyleToCSS(block.style, mergedData, context);

  // Generate animation CSS
  const animationStyle = useMemo(() => {
    const animationName =
      direction === "left" ? "marquee-left" : "marquee-right";
    const iterationCount = repeat === "infinite" ? "infinite" : repeat;

    return {
      ...baseStyle,
      animation: `${animationName} ${duration}s linear ${iterationCount}`,
    };
  }, [baseStyle, direction, duration, repeat]);

  // Create the wrapper element
  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      <Tag
        id={id || block.id}
        className={finalClassName}
        style={animationStyle}
      >
        <React.Suspense fallback={null}>
          {blocks.map((childBlock, index) => (
            <BlockRenderer
              key={generateBlockKey(childBlock, index)}
              block={childBlock}
              data={mergedData}
              context={context}
              eventHandlers={eventHandlers}
            />
          ))}
        </React.Suspense>
      </Tag>
    </>
  );
}
