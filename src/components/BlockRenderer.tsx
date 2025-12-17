/**
 * ========================================
 * BLOCK RENDERER
 * ========================================
 *
 * Main recursive component for V3.0 Schema Block Rendering
 * Renders blocks from theme.json and homepage.json
 */

"use client";

import React, {
  createElement,
  useMemo,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
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

// Context for managing drawer/toggle visibility states across blocks
interface DrawerContextType {
  drawerStates: Record<string, boolean>;
  toggleDrawer: (id: string) => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

function useDrawerContext() {
  return useContext(DrawerContext);
}

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
    pause_on_hover?: boolean;
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
  bind_style?: Record<string, unknown>;

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
 * Helper function to recursively collect all blocks with state.visible
 */
function collectDrawerStates(block: Block): Record<string, boolean> {
  const states: Record<string, boolean> = {};

  const collectFromBlock = (b: Block) => {
    const blockId = b.id || b.wrapper?.match(/#([^.#\s]+)/)?.[1];
    if (blockId && b.state?.visible !== undefined) {
      states[blockId] = b.state.visible;
    }
    if (b.blocks) {
      b.blocks.forEach(collectFromBlock);
    }
  };

  collectFromBlock(block);
  return states;
}

/**
 * Internal Block Renderer Component (without context provider)
 */
function BlockRendererInternal({
  block,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
}: BlockRendererProps) {
  const drawerContext = useDrawerContext();

  const blockId = block.id || block.wrapper?.match(/#([^.#\s]+)/)?.[1];
  const isVisible =
    blockId && drawerContext?.drawerStates[blockId] !== undefined
      ? drawerContext.drawerStates[blockId]
      : block.state?.visible ?? true;

  // Merge block data with parent data
  const mergedData = useMemo(() => {
    const blockData = block.data || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  // Extended event handlers with local state management
  const extendedHandlers = useMemo(
    () => ({
      ...eventHandlers,
      toggleDrawer: (target: string) => {
        if (drawerContext) {
          drawerContext.toggleDrawer(target);
        } else {
          eventHandlers.toggleDrawer?.(target);
        }
      },
      toggleAccordion: (target: string) => {
        eventHandlers.toggleAccordion?.(target);
      },
    }),
    [eventHandlers, drawerContext]
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
      break;
  }

  // Default element rendering
  const { tag, id: wrapperId, classes } = parseWrapper(block.wrapper || "div");

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
    block.bind_style
  );

  // Build props
  const props: Record<string, unknown> = {
    className: finalClassName || undefined,
    style: Object.keys(style).length > 0 ? style : undefined,
  };

  // Add id if present
  if (wrapperId || block.id) {
    props.id = wrapperId || block.id;
  }

  // Handle visibility state
  if (block.state !== undefined && !isVisible) {
    props.style = {
      ...style,
      display: "none",
    };
  }

  // Resolve content binding
  let content: React.ReactNode = block.content;
  if (block.bind_content) {
    const boundContent = resolveBinding(
      block.bind_content,
      mergedData,
      context
    );
    content = boundContent !== undefined ? String(boundContent) : block.content;
  }

  // src for images - skip rendering if no src
  if (tag === "img") {
    const src = block.bind_src
      ? String(
          resolveBinding(block.bind_src, mergedData, context) || block.src || ""
        )
      : block.src || "";

    // Don't render img with empty src (causes browser to re-fetch page)
    if (!src) {
      return null;
    }

    props.src = src;

    const alt = block.bind_alt
      ? String(
          resolveBinding(block.bind_alt, mergedData, context) || block.alt || ""
        )
      : block.alt || "";
    props.alt = alt;
  }

  // href for links
  if (tag === "a") {
    const href = block.bind_href
      ? String(
          resolveBinding(block.bind_href, mergedData, context) ||
            block.href ||
            "#"
        )
      : block.href || "#";
    props.href = href;
  }

  // placeholder for inputs
  if (tag === "input") {
    const placeholder = block.bind_placeholder
      ? String(
          resolveBinding(block.bind_placeholder, mergedData, context) ||
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
        mergedData,
        context,
        extendedHandlers || {}
      );
      if (handler) {
        switch (eventType) {
          case "click":
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
  if (block.events?.on_click || block.events?.click) {
    props.style = {
      ...(props.style as React.CSSProperties),
      cursor: "pointer",
    };
  }

  // Render children
  let children: React.ReactNode = content;

  if (block.blocks && block.blocks.length > 0) {
    children = block.blocks.map((childBlock, index) => (
      <BlockRendererInternal
        key={generateBlockKey(childBlock, index)}
        block={childBlock}
        data={mergedData}
        context={context}
        eventHandlers={extendedHandlers}
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
          resolveBinding(block.bind_icon, mergedData, context) ||
            block.icon ||
            "help"
        )
      : block.icon || "help";

    return (
      <IconRenderer icon={iconName} className={finalClassName} style={style} />
    );
  }

  return createElement(tag, props, children);
}

/**
 * Main Block Renderer Component (exported)
 */
export default function BlockRenderer({
  block,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
}: BlockRendererProps) {
  const existingContext = useDrawerContext();

  const initialDrawerStates = useMemo(() => {
    return collectDrawerStates(block);
  }, [block]);

  const [drawerStates, setDrawerStates] =
    useState<Record<string, boolean>>(initialDrawerStates);

  const toggleDrawer = useCallback(
    (id: string) => {
      setDrawerStates((prev) => {
        const newState = { ...prev, [id]: !prev[id] };
        return newState;
      });
      eventHandlers?.toggleDrawer?.(id);
    },
    [eventHandlers]
  );

  const drawerContextValue = useMemo(
    () => ({ drawerStates, toggleDrawer }),
    [drawerStates, toggleDrawer]
  );

  if (existingContext) {
    return (
      <BlockRendererInternal
        block={block}
        data={data}
        context={context}
        eventHandlers={eventHandlers}
        className={className}
      />
    );
  }

  return (
    <DrawerContext.Provider value={drawerContextValue}>
      <BlockRendererInternal
        block={block}
        data={data}
        context={context}
        eventHandlers={eventHandlers}
        className={className}
      />
    </DrawerContext.Provider>
  );
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

  const style = convertStyleToCSS(block.style, data, context, block.bind_style);

  const iconSize =
    (block.icon_size as number) || (block.size as number) || undefined;

  return (
    <IconRenderer
      icon={iconName}
      className={block.class || ""}
      style={style}
      size={iconSize}
    />
  );
}

/**
 * Render multiple blocks with shared drawer context
 */
export function BlocksRenderer({
  blocks,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
  externalDrawerStates,
}: {
  blocks: Block[];
  data?: Record<string, unknown>;
  context?: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
  className?: string;
  externalDrawerStates?: Record<string, boolean>;
}) {
  const initialDrawerStates = useMemo(() => {
    const states: Record<string, boolean> = {};

    const collectStates = (blockList: Block[]) => {
      blockList.forEach((block) => {
        const blockId = block.id || block.wrapper?.match(/#([^.#\s]+)/)?.[1];
        if (blockId && block.state?.visible !== undefined) {
          states[blockId] = block.state.visible;
        }
        if (block.blocks) {
          collectStates(block.blocks);
        }
      });
    };

    collectStates(blocks);
    return states;
  }, [blocks]);

  const [internalDrawerStates, setInternalDrawerStates] =
    useState<Record<string, boolean>>(initialDrawerStates);

  const drawerStates = useMemo(
    () => ({
      ...internalDrawerStates,
      ...externalDrawerStates,
    }),
    [internalDrawerStates, externalDrawerStates]
  );

  const toggleDrawer = useCallback(
    (id: string) => {
      if (externalDrawerStates && id in externalDrawerStates) {
        eventHandlers?.toggleDrawer?.(id);
      } else {
        setInternalDrawerStates((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      }
    },
    [eventHandlers, externalDrawerStates]
  );

  const drawerContextValue = useMemo(
    () => ({ drawerStates, toggleDrawer }),
    [drawerStates, toggleDrawer]
  );

  if (!blocks || blocks.length === 0) return null;

  return (
    <DrawerContext.Provider value={drawerContextValue}>
      {blocks.map((block, index) => (
        <BlockRendererInternal
          key={generateBlockKey(block, index)}
          block={block}
          data={data}
          context={context}
          eventHandlers={eventHandlers}
          className={index === 0 ? className : ""}
        />
      ))}
    </DrawerContext.Provider>
  );
}
