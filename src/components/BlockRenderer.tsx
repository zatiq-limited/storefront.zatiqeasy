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
  useEffect,
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

// Hook to use drawer context
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
 * Used internally when context is already available
 */
function BlockRendererInternal({
  block,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
}: BlockRendererProps) {
  // Get drawer context for global toggle state management
  const drawerContext = useDrawerContext();

  // Determine visibility from drawer context or block's initial state
  const blockId = block.id || block.wrapper?.match(/#([^.#\s]+)/)?.[1];
  const isVisible =
    blockId && drawerContext?.drawerStates[blockId] !== undefined
      ? drawerContext.drawerStates[blockId]
      : block.state?.visible ?? true;

  // Debug log for mobile_menu
  if (blockId === "mobile_menu") {
    console.log("[BlockRendererInternal] mobile_menu render:", {
      blockId,
      drawerContext: !!drawerContext,
      drawerStates: drawerContext?.drawerStates,
      isVisible,
      blockState: block.state,
    });
  }

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
        console.log(
          "[BlockRendererInternal] toggleDrawer called with target:",
          target
        );
        // Use context toggle if available (for cross-block communication)
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
      // Render element inline to preserve context for child BlockRenderers
      break;
  }

  // Default element rendering (inline to preserve React context for children)
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

  // src for images
  if (tag === "img") {
    const src = block.bind_src
      ? String(
          resolveBinding(block.bind_src, mergedData, context) || block.src || ""
        )
      : block.src || "";
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
      ...(props.style as React.CSSProperties),
      cursor: "pointer",
    };
  }

  // Render children - use BlockRendererInternal for children since they share context
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
 * Wraps with DrawerContext provider if no parent context exists
 * This allows the hamburger button to toggle mobile_menu visibility
 */
export default function BlockRenderer({
  block,
  data = {},
  context = {},
  eventHandlers = {},
  className = "",
}: BlockRendererProps) {
  // Check if we already have drawer context (from parent BlocksRenderer or BlockRenderer)
  const existingContext = useDrawerContext();

  // Collect initial drawer states from this block tree
  const initialDrawerStates = useMemo(() => {
    const states = collectDrawerStates(block);
    console.log("[BlockRenderer] Initial drawer states collected:", states);
    return states;
  }, [block]);

  // State for managing drawer visibility
  const [drawerStates, setDrawerStates] =
    useState<Record<string, boolean>>(initialDrawerStates);

  // Debug: Log when component mounts on client
  useEffect(() => {
    console.log(
      "[BlockRenderer] Component hydrated on client. DrawerStates:",
      drawerStates
    );
  }, []);

  // Debug: Log when drawerStates changes
  useEffect(() => {
    console.log("[BlockRenderer] drawerStates changed:", drawerStates);
  }, [drawerStates]);

  // Toggle drawer function
  const toggleDrawer = useCallback(
    (id: string) => {
      console.log(
        "[BlockRenderer] toggleDrawer called:",
        id,
        "current state:",
        drawerStates[id]
      );
      setDrawerStates((prev) => {
        const newState = { ...prev, [id]: !prev[id] };
        console.log("[BlockRenderer] New drawerStates:", newState);
        return newState;
      });
      // Also call external handler if provided
      eventHandlers?.toggleDrawer?.(id);
    },
    [eventHandlers, drawerStates]
  );

  // Context value
  const drawerContextValue = useMemo(
    () => ({ drawerStates, toggleDrawer }),
    [drawerStates, toggleDrawer]
  );

  // If we already have context, use BlockRendererInternal directly
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

  // Otherwise, provide context for this block tree
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

  // Get icon size from block properties
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
  // Collect all blocks with state.visible to initialize drawer states
  const initialDrawerStates = useMemo(() => {
    const states: Record<string, boolean> = {};

    // Recursively find all blocks with state.visible
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

  // State for managing drawer visibility across all blocks
  const [internalDrawerStates, setInternalDrawerStates] =
    useState<Record<string, boolean>>(initialDrawerStates);

  // Merge external drawer states with internal states (external takes precedence)
  const drawerStates = useMemo(
    () => ({
      ...internalDrawerStates,
      ...externalDrawerStates,
    }),
    [internalDrawerStates, externalDrawerStates]
  );

  // Toggle drawer function
  const toggleDrawer = useCallback(
    (id: string) => {
      // If external drawer states include this id, let the external handler manage it
      // This prevents double-toggling where both internal and external toggle independently
      if (externalDrawerStates && id in externalDrawerStates) {
        // Only call external handler, don't toggle internal state
        eventHandlers?.toggleDrawer?.(id);
      } else {
        // For purely internal drawers, toggle internal state
        setInternalDrawerStates((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      }
    },
    [eventHandlers, externalDrawerStates]
  );

  // Context value
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
