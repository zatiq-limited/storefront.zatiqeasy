/**
 * ========================================
 * BLOCK RENDERER
 * ========================================
 *
 * Main recursive component for V3.0 Schema Block Rendering
 * Renders blocks from theme.json and homepage.json
 */

"use client";

import React, { createElement, useMemo, useState, useCallback } from "react";
import {
  parseWrapper,
  convertStyleToCSS,
  resolveBinding,
  evaluateCondition,
  createEventHandler,
  generateBlockKey,
  getBlockType,
  type Condition,
  type BlockEvent,
  type BlockStyle,
} from "@/lib/block-utils";
import IconRenderer from "./block-renderers/IconRenderer";
import RepeaterRenderer from "./block-renderers/RepeaterRenderer";
import MarqueeRenderer from "./block-renderers/MarqueeRenderer";
import SwiperRenderer from "./block-renderers/SwiperRenderer";

// Block type definition
export interface Block {
  wrapper?: string;
  type?: string;
  class?: string;
  style?: BlockStyle;
  id?: string;
  data?: Record<string, unknown>;
  blocks?: Block[];
  condition?: Condition;
  events?: Record<string, BlockEvent>;
  animation?: {
    type: string;
    direction?: string;
    duration?: number;
    repeat?: string;
  };
  state?: {
    visible?: boolean;
  };

  // Content bindings
  content?: string;
  bind_content?: string;
  bind_src?: string;
  bind_alt?: string;
  bind_href?: string;
  bind_icon?: string;
  bind_placeholder?: string;
  bind_class?: string;

  // Direct attributes
  src?: string;
  alt?: string;
  href?: string;
  icon?: string;
  placeholder?: string;
  aria_label?: string;

  // Special types
  source?: string;
  iterator?: string;
  index?: string;
  template?: Block;
  config?: Record<string, unknown>;

  [key: string]: unknown;
}

export interface BlockRendererProps {
  block: Block;
  data?: Record<string, unknown>;
  context?: Record<string, unknown>;
  eventHandlers?: {
    navigate?: (url: string) => void;
    toggleDrawer?: (target: string) => void;
    toggleTheme?: () => void;
    search?: (query: string) => void;
    sliderPrev?: (target: string) => void;
    sliderNext?: (target: string) => void;
    sliderGoto?: (index: number) => void;
    toggleAccordion?: (target: string) => void;
    toggleDropdown?: (target: string) => void;
    setStyle?: (target: string, value: unknown) => void;
  };
  className?: string;
}

/**
 * Main Block Renderer Component
 * Recursively renders V3.0 Schema blocks
 */
export default function BlockRenderer({
  block,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
}: BlockRendererProps) {
  // State for visibility toggling
  const [isVisible, setIsVisible] = useState(block.state?.visible ?? true);

  // Merge block data with parent data - block.data takes precedence for its scope
  // This is critical for components like announcement bars and navbars that have their own data
  const mergedData = useMemo(() => {
    const blockData = block.data || {};
    // Deep merge: parent data first, then block's own data on top
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Extended event handlers with local state management
  const extendedHandlers = useMemo(
    () => ({
      ...eventHandlers,
      toggleDrawer: (target: string) => {
        if (block.id === target || block.wrapper?.includes(target)) {
          setIsVisible((prev) => !prev);
        }
        eventHandlers.toggleDrawer?.(target);
      },
      toggleAccordion: (target: string) => {
        eventHandlers.toggleAccordion?.(target);
      },
    }),
    [eventHandlers, block.id, block.wrapper]
  );

  // Check condition
  if (block.condition) {
    const shouldRender = evaluateCondition(
      block.condition,
      mergedData,
      context
    );
    if (!shouldRender) return null;
  }

  // Get block type for specialized rendering
  const blockType = getBlockType(block);

  // Handle special block types
  switch (blockType) {
    case "repeater":
      return (
        <RepeaterRenderer
          block={block}
          data={mergedData}
          context={context}
          eventHandlers={extendedHandlers}
        />
      );

    case "swiper":
      return (
        <SwiperRenderer
          block={block}
          data={mergedData}
          context={context}
          eventHandlers={extendedHandlers}
          className={className}
        />
      );

    case "marquee":
      return (
        <MarqueeRenderer
          block={block}
          data={mergedData}
          context={context}
          eventHandlers={extendedHandlers}
          className={className}
        />
      );

    case "icon":
      return renderIcon(block, mergedData, context);

    default:
      return renderElement(
        block,
        mergedData,
        context,
        extendedHandlers,
        isVisible,
        className
      );
  }
}

/**
 * Render an icon block
 */
function renderIcon(
  block: Block,
  data: Record<string, unknown>,
  context: Record<string, unknown>
): React.ReactElement {
  const iconName = block.bind_icon
    ? String(
        resolveBinding(block.bind_icon, data, context) || block.icon || "help"
      )
    : block.icon || "help";

  const style = convertStyleToCSS(block.style, data, context);

  return (
    <IconRenderer icon={iconName} className={block.class || ""} style={style} />
  );
}

/**
 * Render a standard HTML element
 */
function renderElement(
  block: Block,
  data: Record<string, unknown>,
  context: Record<string, unknown>,
  eventHandlers: BlockRendererProps["eventHandlers"],
  isVisible: boolean,
  additionalClassName: string
): React.ReactElement | null {
  // Parse wrapper to get tag, id, and classes
  const { tag, id, classes } = parseWrapper(block.wrapper || "div");

  // Build className
  const blockClass = block.class || "";
  const wrapperClasses = classes.join(" ");
  const finalClassName = [wrapperClasses, blockClass, additionalClassName]
    .filter(Boolean)
    .join(" ");

  // Build style - pass data and context to resolve style bindings
  const style = convertStyleToCSS(block.style, data, context);

  // Build props
  const props: Record<string, unknown> = {
    className: finalClassName || undefined,
    style: Object.keys(style).length > 0 ? style : undefined,
  };

  // Add id if present
  if (id || block.id) {
    props.id = id || block.id;
  }

  // Handle visibility state
  if (block.state !== undefined && !isVisible) {
    props.style = {
      ...style,
      display: "none",
    };
  }

  // Resolve bindings
  // Content
  let content: React.ReactNode = block.content;
  if (block.bind_content) {
    const boundContent = resolveBinding(block.bind_content, data, context);
    content = boundContent !== undefined ? String(boundContent) : block.content;
  }

  // src for images
  if (tag === "img") {
    const src = block.bind_src
      ? String(resolveBinding(block.bind_src, data, context) || block.src || "")
      : block.src || "";
    props.src = src;

    const alt = block.bind_alt
      ? String(resolveBinding(block.bind_alt, data, context) || block.alt || "")
      : block.alt || "";
    props.alt = alt;
  }

  // href for links
  if (tag === "a") {
    const href = block.bind_href
      ? String(
          resolveBinding(block.bind_href, data, context) || block.href || "#"
        )
      : block.href || "#";
    props.href = href;
  }

  // placeholder for inputs
  if (tag === "input") {
    const placeholder = block.bind_placeholder
      ? String(
          resolveBinding(block.bind_placeholder, data, context) ||
            block.placeholder ||
            ""
        )
      : block.placeholder || "";
    props.placeholder = placeholder;
    props.type = (block.type === "text_input" ? "text" : block.type) || "text";
  }

  // aria-label
  if (block.aria_label) {
    props["aria-label"] = block.aria_label;
  }

  // Handle events
  if (block.events) {
    Object.entries(block.events).forEach(([eventType, eventConfig]) => {
      const handler = createEventHandler(
        eventConfig,
        data,
        context,
        eventHandlers || {}
      );
      if (handler) {
        switch (eventType) {
          case "on_click":
            props.onClick = handler;
            break;
          case "on_hover":
          case "on_mouse_enter":
            props.onMouseEnter = handler;
            break;
          case "on_mouse_leave":
            props.onMouseLeave = handler;
            break;
          case "on_submit":
            props.onSubmit = (e: React.FormEvent) => {
              e.preventDefault();
              handler();
            };
            break;
        }
      }
    });
  }

  // Handle cursor pointer for clickable elements
  if (block.events?.on_click) {
    props.style = {
      ...((props.style as React.CSSProperties) || {}),
      cursor: "pointer",
    };
  }

  // Render children
  let children: React.ReactNode = content;

  if (block.blocks && block.blocks.length > 0) {
    children = block.blocks.map((childBlock, index) => (
      <BlockRenderer
        key={generateBlockKey(childBlock, index)}
        block={childBlock}
        data={data}
        context={context}
        eventHandlers={eventHandlers}
      />
    ));
  }

  // Special handling for self-closing tags
  const selfClosingTags = ["img", "input", "br", "hr", "meta", "link"];
  if (selfClosingTags.includes(tag)) {
    return createElement(tag, props);
  }

  // Handle SVG icons specially
  if (tag === "svg" && block.type === "icon") {
    const iconName = block.bind_icon
      ? String(
          resolveBinding(block.bind_icon, data, context) || block.icon || "help"
        )
      : block.icon || "help";

    return (
      <IconRenderer icon={iconName} className={finalClassName} style={style} />
    );
  }

  return createElement(tag, props, children);
}

/**
 * Render multiple blocks
 */
export function BlocksRenderer({
  blocks,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
}: {
  blocks: Block[];
  data?: Record<string, unknown>;
  context?: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
  className?: string;
}) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => (
        <BlockRenderer
          key={generateBlockKey(block, index)}
          block={block}
          data={data}
          context={context}
          eventHandlers={eventHandlers}
          className={index === 0 ? className : ""}
        />
      ))}
    </>
  );
}
