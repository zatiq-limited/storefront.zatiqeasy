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
  useRef,
  useEffect,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { PLACEHOLDER_IMAGES } from "@/lib/constants/urls";
import IconRenderer from "./block-components/icon-renderer";
import RepeaterRenderer from "./block-components/repeater-renderer";
import MarqueeRenderer from "./block-components/marquee-renderer";
import SwiperRenderer from "./block-components/swiper-renderer";
import ProgressBarRenderer from "./block-components/progress-bar-renderer";
import { AboutTeam1Renderer } from "./block-components/about";
import { AddToCartButtonRenderer } from "./block-components/add-to-cart-button-renderer";
import { useProductsStore, Product } from "@/stores/productsStore";
import { useCartStore } from "@/stores/cartStore";
import { useShopStore } from "@/stores/shopStore";
import { useShopInventories } from "@/hooks";
import { VariantSelectorModal } from "@/components/products/variant-selector-modal";
import toast from "react-hot-toast";

/**
 * Check if a URL is internal (should use Next.js Link for client-side navigation)
 */
function isInternalUrl(href: string): boolean {
  if (!href || href === "#") return false;
  // Internal URLs start with / but not // (protocol-relative)
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  // Relative URLs without protocol
  if (!href.includes("://") && !href.startsWith("//")) return true;
  return false;
}

// Context for managing drawer/toggle visibility states across blocks
interface DrawerContextType {
  drawerStates: Record<string, boolean>;
  toggleDrawer: (id: string) => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

function useDrawerContext() {
  return useContext(DrawerContext);
}

// Context for managing search input state with debounce
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSearchQueryWithDebounce: (
    query: string,
    onSearch: (q: string) => void
  ) => void;
  clearDebounceTimer: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

function useSearchContext() {
  return useContext(SearchContext);
}

// Context for managing add-to-cart functionality with variant modal
interface AddToCartContextType {
  addToCart: (productId: string, productData?: Record<string, unknown>) => void;
  openVariantModal: (product: Product) => void;
}

const AddToCartContext = createContext<AddToCartContextType | null>(null);

function useAddToCartContext() {
  return useContext(AddToCartContext);
}

// Export for use in child components
export { useAddToCartContext };

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
  bind_id?: string;

  // Direct attributes
  src?: string;
  alt?: string;
  priority?: boolean; // For LCP/hero images to load eagerly
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
    addToCart?: (
      productId: string,
      productData?: Record<string, unknown>
    ) => void;
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
  const searchContext = useSearchContext();
  const addToCartContext = useAddToCartContext();
  const router = useRouter();

  // Resolve block id - can be from block.id, wrapper, or bind_id
  let blockId = block.id || block.wrapper?.match(/#([^.#\s]+)/)?.[1];

  // If bind_id is present, resolve it from data/context
  if (block.bind_id) {
    const earlyMergedData = { ...data, ...(block.data || {}) };
    const boundId = resolveBinding(block.bind_id, earlyMergedData, context);
    if (boundId !== undefined) {
      blockId = String(boundId);
    }
  }

  const isVisible =
    blockId && drawerContext?.drawerStates[blockId] !== undefined
      ? drawerContext.drawerStates[blockId]
      : block.state?.visible ?? true;

  // Merge block data with parent data
  // Preserve special keys like cart_count, cart_total from parent (don't let block data overwrite)
  // Also inject drawer states for conditional rendering based on drawer visibility
  const mergedData = useMemo(() => {
    const blockData = block.data || {};
    const merged = { ...data, ...blockData };
    // Always preserve cart_count from parent data if it exists
    if (data.cart_count !== undefined) {
      merged.cart_count = data.cart_count;
    }
    // Always preserve cart_total from parent data if it exists
    if (data.cart_total !== undefined) {
      merged.cart_total = data.cart_total;
    }
    // Inject drawer states for condition checking (e.g., _drawer.mobile_menu)
    if (drawerContext) {
      merged._drawer = drawerContext.drawerStates;
    }
    return merged;
  }, [data, block.data, drawerContext]);

  // Extended event handlers with local state management
  const extendedHandlers = useMemo(
    () => ({
      ...eventHandlers,
      navigate: (url: string) => {
        // Close mobile menu when navigating (common UX pattern)
        if (drawerContext?.drawerStates?.mobile_menu) {
          drawerContext.toggleDrawer("mobile_menu");
        }

        if (eventHandlers.navigate) {
          eventHandlers.navigate(url);
        } else if (url === "#") {
          // Empty hash - do nothing
          return;
        } else if (url.startsWith("#")) {
          // Hash link - smooth scroll to element
          const element = document.querySelector(url);
          element?.scrollIntoView({ behavior: "smooth" });
        } else if (isInternalUrl(url)) {
          router.push(url);
        } else {
          window.location.href = url;
        }
      },
      toggleDrawer: (target: string) => {
        if (drawerContext) {
          drawerContext.toggleDrawer(target);
        } else {
          eventHandlers.toggleDrawer?.(target);
        }
      },
      toggleAccordion: (target: string) => {
        // Use DrawerContext to toggle accordion visibility (same as drawer)
        if (drawerContext) {
          drawerContext.toggleDrawer(target);
        } else {
          eventHandlers.toggleAccordion?.(target);
        }
      },
    }),
    [eventHandlers, drawerContext, router]
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

    case "progress_bar":
      return (
        <ProgressBarRenderer
          block={block}
          data={mergedData}
          context={context}
          eventHandlers={extendedHandlers}
          className={className}
        />
      );

    case "about_team_scroll":
      return (
        <AboutTeam1Renderer
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

  // Special handling for add-to-cart and buy-now buttons - render interactive cart button with quantity controls
  const addToCartClickEvent = block.events?.on_click || block.events?.click;
  if ((addToCartClickEvent?.action === "add_to_cart" || addToCartClickEvent?.action === "buy_now") && addToCartContext) {
    // Resolve product ID from event target
    const productId = addToCartClickEvent.target?.includes?.(".")
      ? String(
          resolveBinding(addToCartClickEvent.target, mergedData, context) || ""
        )
      : String(addToCartClickEvent.target || "");

    // Get product data from context (e.g., from repeater)
    const productData = mergedData.product as
      | Record<string, unknown>
      | undefined;

    // Determine if this is a buy_now button (outlined style)
    const isBuyNowButton = addToCartClickEvent.action === "buy_now";

    return (
      <AddToCartButtonRenderer
        block={block}
        productId={productId}
        productData={productData}
        data={mergedData}
        context={context}
        onOpenVariantModal={addToCartContext.openVariantModal}
        isBuyNowButton={isBuyNowButton}
      />
    );
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

  // Add id if present (supports bind_id for dynamic ids)
  let elementId = wrapperId || block.id;
  if (block.bind_id) {
    const boundId = resolveBinding(block.bind_id, mergedData, context);
    if (boundId !== undefined) {
      elementId = String(boundId);
    }
  }
  if (elementId) {
    props.id = elementId;
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
    // Check for both undefined and null to avoid showing "null" as text
    content =
      boundContent !== undefined && boundContent !== null
        ? String(boundContent)
        : block.content;
  }

  // src for images - use placeholder if no src or if image fails to load
  if (tag === "img") {
    const resolvedSrc = block.bind_src
      ? String(
          resolveBinding(block.bind_src, mergedData, context) || block.src || ""
        )
      : block.src || "";

    // Use placeholder image if src is empty
    props.src = resolvedSrc || PLACEHOLDER_IMAGES.PRODUCT;

    const alt = block.bind_alt
      ? String(
          resolveBinding(block.bind_alt, mergedData, context) || block.alt || ""
        )
      : block.alt || "";
    props.alt = alt;

    // Add onError handler to fallback to placeholder if image fails to load
    props.onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      // Only replace if not already the placeholder (prevent infinite loop)
      if (
        target.src !== PLACEHOLDER_IMAGES.PRODUCT &&
        !target.src.endsWith(PLACEHOLDER_IMAGES.PRODUCT)
      ) {
        target.src = PLACEHOLDER_IMAGES.PRODUCT;
      }
    };
  }

  // href for links - check href, bind_href, url, bind_url, and navigate event target
  if (tag === "a") {
    // Check all possible URL sources: bind_href, bind_url, href, url, navigate event target
    let href = "#";

    // Try bind_href first
    if (block.bind_href && typeof block.bind_href === "string") {
      const resolved = resolveBinding(block.bind_href, mergedData, context);
      if (resolved && typeof resolved === "string") {
        href = resolved;
      }
    }

    // Try bind_url if href still default
    if (href === "#" && block.bind_url && typeof block.bind_url === "string") {
      const resolved = resolveBinding(block.bind_url, mergedData, context);
      if (resolved && typeof resolved === "string") {
        href = resolved;
      }
    }

    // Try direct href/url properties
    if (href === "#" && block.href) {
      href = String(block.href);
    }
    if (href === "#" && block.url) {
      href = String(block.url);
    }

    // Try navigate event target as fallback (e.g., "item.url" binding)
    if (href === "#") {
      const navigateEvent = block.events?.on_click || block.events?.click;
      if (navigateEvent?.action === "navigate" && navigateEvent.target) {
        const target = navigateEvent.target;
        // Check if target is a binding path (contains ".")
        if (typeof target === "string" && target.includes(".")) {
          const resolved = resolveBinding(target, mergedData, context);
          if (resolved && typeof resolved === "string") {
            href = resolved;
          }
        } else if (typeof target === "string") {
          // Direct URL in target
          href = target;
        }
      }
    }

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

    // Check if this is a search input
    // Method 1: Has on_submit with search action
    const submitEvent = block.events?.on_submit;
    const hasSearchSubmitEvent = submitEvent?.action === "search";

    // Method 2: Placeholder contains "search" (common pattern for search inputs)
    const placeholderLower = placeholder.toLowerCase();
    const hasSearchPlaceholder =
      placeholderLower.includes("search") ||
      placeholderLower.includes("find") ||
      placeholderLower.includes("discover");

    // Method 3: Input has search-related id, class, or bind_placeholder
    const hasSearchIdentifier =
      block.id?.toLowerCase().includes("search") ||
      block.class?.toLowerCase().includes("search") ||
      block.bind_placeholder?.toLowerCase().includes("search");

    const isSearchInput =
      hasSearchSubmitEvent || hasSearchPlaceholder || hasSearchIdentifier;

    if (isSearchInput && searchContext) {
      // Make search input controlled with debounce
      props.value = searchContext.searchQuery;
      props.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        // Use debounced search - will trigger after 2 seconds of inactivity
        searchContext.setSearchQueryWithDebounce(query, (q) => {
          eventHandlers.search?.(q);
        });
      };
      // Handle Enter key to trigger search immediately
      props.onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          // Clear debounce timer to prevent double triggering
          searchContext.clearDebounceTimer();
          if (searchContext.searchQuery.trim()) {
            eventHandlers.search?.(searchContext.searchQuery);
          }
        }
      };
    }
  }

  // aria-label - explicit or auto-generated for accessibility
  if (block.aria_label) {
    props["aria-label"] = block.aria_label;
  } else if (tag === "button" && !block.content) {
    // Auto-generate aria-label for buttons without text content
    const classStr = finalClassName || "";
    let autoLabel = "Button";

    // Detect button purpose from class names
    if (classStr.includes("left") || classStr.includes("prev")) {
      autoLabel = "Previous";
    } else if (classStr.includes("right") || classStr.includes("next")) {
      autoLabel = "Next";
    } else if (classStr.includes("close") || classStr.includes("dismiss")) {
      autoLabel = "Close";
    } else if (classStr.includes("menu") || classStr.includes("hamburger")) {
      autoLabel = "Menu";
    } else if (classStr.includes("search")) {
      autoLabel = "Search";
    } else if (classStr.includes("cart")) {
      autoLabel = "Cart";
    } else if (classStr.includes("slider") || classStr.includes("swiper")) {
      autoLabel = "Slide navigation";
    }

    props["aria-label"] = autoLabel;
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
            // For add_to_cart and buy_now actions, stop propagation to prevent parent link navigation
            if (eventConfig.action === "add_to_cart" || eventConfig.action === "buy_now") {
              props.onClick = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                handler();
              };
            } else {
              props.onClick = handler;
            }
            break;
          case "on_hover":
          case "on_mouse_enter":
            props.onMouseEnter = handler;
            break;
          case "on_mouse_leave":
            props.onMouseLeave = handler;
            break;
          case "on_submit":
            // Special handling for search submit - pass the actual query
            if (eventConfig.action === "search" && searchContext) {
              props.onSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                if (searchContext.searchQuery.trim()) {
                  eventHandlers.search?.(searchContext.searchQuery);
                }
              };
            } else {
              props.onSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                handler();
              };
            }
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

  // Special handling for images - use Next.js Image for optimization
  if (tag === "img") {
    const src = props.src as string;
    const alt = (props.alt as string) || "";

    // Check if this is an image that can be optimized by Next.js
    // Only includes domains configured in next.config.ts remotePatterns
    const isOptimizable =
      src &&
      (src.includes("cloudfront.net") ||
        src.includes("zatiq") || // cspell:disable-line
        src.includes("s3.") ||
        src.includes("s3.amazonaws.com") ||
        src.includes("ibb.co") ||
        src.includes("shopify.com") ||
        src.includes("cloudinary.com") ||
        src.includes("unsplash.com") ||
        src.includes("ufileos.com") ||
        src.includes("easykoro.com") ||
        src.includes("youtube.com") ||
        src.startsWith("/"));

    // Check if the image should use fill (full-size images in relative containers)
    // vs fixed dimensions (small icons, logos, inline images)
    const classStr = finalClassName || "";
    const shouldUseFill =
      (classStr.includes("w-full") && classStr.includes("h-full")) ||
      (classStr.includes("absolute") && classStr.includes("inset-0"));

    // Small/inline images should NOT use fill - they break layout
    const isSmallInlineImage =
      classStr.match(/\bh-\d+\b/) || // h-8, h-10, etc.
      classStr.match(/\bw-\d+\b/) || // w-8, w-10, etc.
      classStr.includes("object-contain") ||
      classStr.includes("max-h-") ||
      classStr.includes("max-w-");

    // Detect hero/LCP images that should load with priority (no lazy loading)
    // These are typically above-the-fold banner/hero images
    // Priority removes loading="lazy" and adds preload link
    const isHeroImage =
      block.priority === true ||
      block.data?.priority === true ||
      classStr.includes("hero") ||
      classStr.includes("banner") ||
      classStr.includes("swiper-slide") ||
      block.id?.includes("hero") ||
      block.id?.includes("banner") ||
      // Full-viewport images are typically hero images (above the fold)
      (classStr.includes("absolute") &&
        classStr.includes("inset-0") &&
        classStr.includes("object-cover"));

    if (isOptimizable && shouldUseFill && !isSmallInlineImage) {
      // Use Next.js Image with fill for responsive images
      // Hero images get priority loading, others get lazy loading
      // Next.js Image provides automatic WebP/AVIF conversion and compression
      return (
        <Image
          src={src}
          alt={alt}
          fill
          priority={isHeroImage}
          fetchPriority={isHeroImage ? "high" : "auto"}
          loading={isHeroImage ? "eager" : "lazy"}
          sizes={
            isHeroImage
              ? "100vw"
              : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          }
          className={finalClassName}
          style={{
            ...style,
            objectFit:
              (style?.objectFit as React.CSSProperties["objectFit"]) || "cover",
          }}
          quality={75}
        />
      );
    }

    // For small/inline images or non-fill images, use native img
    // This preserves layout for icons, logos, payment badges, etc.
    return createElement(tag, props);
  }

  // Special handling for other self-closing tags
  const selfClosingTags = ["input", "br", "hr", "meta", "link"];
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

  // Use Next.js Link for internal anchor tags to enable client-side navigation
  if (tag === "a" && props.href && isInternalUrl(String(props.href))) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, onClick, ...restProps } = props as Record<string, unknown>;

    // Create click handler to close mobile menu before navigation
    const handleLinkClick = () => {
      if (drawerContext?.drawerStates?.mobile_menu) {
        drawerContext.toggleDrawer("mobile_menu");
      }
    };

    return (
      <Link href={String(href)} {...restProps} onClick={handleLinkClick}>
        {children}
      </Link>
    );
  }

  // For non-anchor elements with navigate events, wrap in Link if URL is internal
  const navigateEvent = block.events?.on_click || block.events?.click;
  const hasNavigateEvent = navigateEvent?.action === "navigate";

  if (tag !== "a" && hasNavigateEvent && navigateEvent?.target) {
    // Get URL from navigate event target
    let elementUrl = "";
    const target = navigateEvent.target;

    if (typeof target === "string") {
      // Check if target is a binding path (contains ".")
      if (target.includes(".")) {
        const resolved = resolveBinding(target, mergedData, context);
        if (resolved && typeof resolved === "string") {
          elementUrl = resolved;
        }
      } else {
        // Direct URL in target
        elementUrl = target;
      }
    }

    // Also check block.url and block.bind_url
    if (!elementUrl && block.bind_url && typeof block.bind_url === "string") {
      const resolved = resolveBinding(block.bind_url, mergedData, context);
      if (resolved && typeof resolved === "string") {
        elementUrl = resolved;
      }
    }
    if (!elementUrl && block.url) {
      elementUrl = String(block.url);
    }

    if (elementUrl && isInternalUrl(elementUrl)) {
      // Create click handler to close mobile menu before navigation
      const handleLinkClick = () => {
        if (drawerContext?.drawerStates?.mobile_menu) {
          drawerContext.toggleDrawer("mobile_menu");
        }
      };

      // Link is just a navigation wrapper - styles go on the inner element only
      return (
        <Link href={elementUrl} onClick={handleLinkClick}>
          {createElement(
            tag,
            { className: props.className, style: props.style },
            children
          )}
        </Link>
      );
    }
  }

  // Check both "click" and "on_click" event names for button detection
  const clickEvent = block.events?.on_click || block.events?.click;

  // Special handling for search icon buttons - open search modal
  // Check if this is a search-related button by icon, id, or class
  const hasSearchIcon = block.icon?.toLowerCase() === "search";
  const hasSearchIdentifier =
    block.id?.toLowerCase().includes("search") ||
    block.class?.toLowerCase().includes("search") ||
    blockId?.toLowerCase().includes("search");

  // Check if any child block has a search icon (recursively checks nested blocks)
  const checkForSearchIcon = (blocks: Block[] | undefined): boolean => {
    if (!blocks) return false;
    return blocks.some((child) => {
      // Check if this child has a search icon
      const childHasSearchIcon =
        child.icon?.toLowerCase() === "search" ||
        (child.type === "icon" && child.icon?.toLowerCase() === "search");
      if (childHasSearchIcon) return true;
      // Recursively check nested blocks
      return checkForSearchIcon(child.blocks);
    });
  };
  const hasChildSearchIcon = checkForSearchIcon(block.blocks);

  const isSearchButton =
    (hasSearchIcon || hasSearchIdentifier || hasChildSearchIcon) &&
    clickEvent &&
    !block.placeholder;

  // If this is a search button, override the click handler to open search modal
  if (isSearchButton) {
    const searchClickHandler = () => {
      eventHandlers.search?.("");
    };
    props.onClick = searchClickHandler;

    return createElement(tag, props, children);
  }

  // Special handling for cart icon buttons - add badge with cart count
  // Only add badge to elements that actually have a cart icon (not to text labels)

  // Check if block directly has a cart-related icon
  const hasCartIcon =
    block.icon?.toLowerCase().includes("cart") ||
    block.icon?.toLowerCase().includes("shopping") ||
    block.icon?.toLowerCase().includes("bag") ||
    block.icon?.toLowerCase().includes("basket");

  // Check if any child block has a cart icon (for wrapper buttons containing icon)
  const hasChildCartIcon = block.blocks?.some(
    (child) =>
      child.type === "icon" &&
      (child.icon?.toLowerCase().includes("cart") ||
        child.icon?.toLowerCase().includes("shopping") ||
        child.icon?.toLowerCase().includes("bag") ||
        child.icon?.toLowerCase().includes("basket"))
  );

  // Only consider it a cart button if it has a cart icon (directly or in children)
  // AND has a click event to toggle the cart drawer
  const isCartToggle =
    clickEvent?.action === "toggle_drawer" &&
    (clickEvent?.target === "cart_drawer" ||
      clickEvent?.target === "cart" ||
      String(clickEvent?.target || "")
        .toLowerCase()
        .includes("cart"));

  const isCartButton = (hasCartIcon || hasChildCartIcon) && isCartToggle;

  if (isCartButton) {
    const cartCount = mergedData.cart_count as number | undefined;

    return createElement(
      tag,
      {
        ...props,
        className: `${finalClassName} relative overflow-visible`,
        style: {
          ...((props.style as React.CSSProperties) || {}),
          overflow: "visible",
        },
      },
      <>
        {children}
        {cartCount !== undefined && cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full z-50">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </>
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
  const existingDrawerContext = useDrawerContext();
  const existingSearchContext = useSearchContext();
  const existingAddToCartContext = useAddToCartContext();

  const initialDrawerStates = useMemo(() => {
    return collectDrawerStates(block);
  }, [block]);

  const [drawerStates, setDrawerStates] =
    useState<Record<string, boolean>>(initialDrawerStates);

  // Search input state with debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add-to-cart state
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Store access for add-to-cart
  const { getProductById, products: storeProducts } = useProductsStore();
  const { addProduct } = useCartStore();
  const { shopDetails } = useShopStore();

  // Fetch inventories if not already loaded - needed for add-to-cart functionality
  // This ensures products are available when user clicks "Add to cart" on custom sections
  useShopInventories(
    { shopUuid: shopDetails?.shop_uuid || "" },
    {
      enabled: !!shopDetails?.shop_uuid && storeProducts.length === 0,
      syncToStore: true,
    }
  );

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced search function - triggers search after 2 seconds of inactivity
  const setSearchQueryWithDebounce = useCallback(
    (query: string, onSearch: (q: string) => void) => {
      setSearchQuery(query);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer - trigger search after 2 seconds if query is not empty
      if (query.trim()) {
        debounceTimerRef.current = setTimeout(() => {
          onSearch(query);
        }, 300);
      }
    },
    []
  );

  // Clear the debounce timer (e.g., when Enter is pressed)
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

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

  // Add to cart handler - handles products with and without variants
  const handleAddToCart = useCallback(
    (productId: string, productData?: Record<string, unknown>) => {
      // Try to get the full product from store first
      let product = getProductById(productId);

      // If not in store, try to construct a basic product from the provided data
      if (!product && productData) {
        product = {
          id: Number(productId),
          shop_id: shopDetails?.id || 0,
          name: (productData.name as string) || "",
          slug: productId,
          image_url: (productData.image as string) || "",
          images: productData.image ? [productData.image as string] : [],
          price: (productData.price as number) || 0,
          old_price: (productData.original_price as number) || null,
          quantity: 999,
          is_active: true,
          has_variant: false,
          categories: [],
          variant_types: [],
          stocks: [],
          is_stock_manage_by_variant: false,
          reviews: [],
        } as Product;
      }

      if (!product) {
        toast.error("Product not found");
        return;
      }

      // Check if product has variants
      const hasVariants =
        product.has_variant &&
        product.variant_types &&
        product.variant_types.length > 0;

      if (hasVariants) {
        // Open variant selector modal
        setSelectedProduct(product);
        setIsVariantModalOpen(true);
      } else {
        // Add directly to cart without variants
        const cartProduct = {
          id: Number(product.id),
          shop_id: product.shop_id || 0,
          name: product.name,
          handle: product.slug,
          image_url: product.image_url || product.images?.[0] || "",
          images: product.images || [],
          price: product.price,
          quantity: product.quantity || 999,
          old_price: product.old_price || 0,
          is_active: product.is_active ?? true,
          has_variant: false,
          categories: product.categories || [],
          variant_types: [],
          stocks: [],
          is_stock_manage_by_variant: false,
          reviews: [],
          total_inventory_sold: 0,
          description: product.description,
          short_description: product.short_description,
          video_link: product.video_link,
          qty: 1,
          selectedVariants: {},
        };

        addProduct(cartProduct as Parameters<typeof addProduct>[0]);
        toast.success("Added to cart!");
      }
    },
    [getProductById, addProduct, shopDetails?.id]
  );

  const handleVariantModalClose = useCallback(() => {
    setIsVariantModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleVariantAddToCartSuccess = useCallback(() => {
    toast.success("Added to cart!");
  }, []);

  // Open variant modal directly (for use by AddToCartButtonRenderer)
  const handleOpenVariantModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsVariantModalOpen(true);
  }, []);

  const drawerContextValue = useMemo(
    () => ({ drawerStates, toggleDrawer }),
    [drawerStates, toggleDrawer]
  );

  const searchContextValue = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      setSearchQueryWithDebounce,
      clearDebounceTimer,
    }),
    [searchQuery, setSearchQueryWithDebounce, clearDebounceTimer]
  );

  const addToCartContextValue = useMemo(
    () => ({
      addToCart: handleAddToCart,
      openVariantModal: handleOpenVariantModal,
    }),
    [handleAddToCart, handleOpenVariantModal]
  );

  // Merge external eventHandlers with internal addToCart handler
  const mergedEventHandlers = useMemo(
    () => ({
      ...eventHandlers,
      addToCart: existingAddToCartContext?.addToCart || handleAddToCart,
    }),
    [eventHandlers, existingAddToCartContext, handleAddToCart]
  );

  // If already in existing contexts, just render internal
  if (
    existingDrawerContext &&
    existingSearchContext &&
    existingAddToCartContext
  ) {
    return (
      <BlockRendererInternal
        block={block}
        data={data}
        context={context}
        eventHandlers={mergedEventHandlers}
        className={className}
      />
    );
  }

  return (
    <DrawerContext.Provider value={existingDrawerContext || drawerContextValue}>
      <SearchContext.Provider
        value={existingSearchContext || searchContextValue}
      >
        <AddToCartContext.Provider
          value={existingAddToCartContext || addToCartContextValue}
        >
          <BlockRendererInternal
            block={block}
            data={data}
            context={context}
            eventHandlers={mergedEventHandlers}
            className={className}
          />
          {/* Variant Selector Modal - only render if we're the provider */}
          {!existingAddToCartContext && (
            <VariantSelectorModal
              isOpen={isVariantModalOpen}
              onClose={handleVariantModalClose}
              product={selectedProduct}
              onAddToCart={handleVariantAddToCartSuccess}
            />
          )}
        </AddToCartContext.Provider>
      </SearchContext.Provider>
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
