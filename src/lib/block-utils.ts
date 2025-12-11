/**
 * ========================================
 * BLOCK UTILITIES
 * ========================================
 *
 * Utility functions for V3.0 Schema Block Renderer
 */

import type { CSSProperties } from "react";

// Types
export interface ParsedWrapper {
  tag: string;
  id?: string;
  classes: string[];
}

export interface Condition {
  field: string;
  op:
    | "equals"
    | "not_equals"
    | "not_empty"
    | "empty"
    | "gt"
    | "lt"
    | "gte"
    | "lte"
    | "contains";
  value: unknown;
}

export interface BlockEvent {
  action: string;
  target: string;
  value?: unknown;
}

export interface BlockStyle {
  background_color?: string;
  background?: string;
  color?: string;
  border_color?: string;
  border_radius?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  [key: string]: unknown;
}

/**
 * Parse wrapper string to extract tag, id, and classes
 * Examples:
 *   "div" → { tag: "div", classes: [] }
 *   "div#myId" → { tag: "div", id: "myId", classes: [] }
 *   "section#hero.container" → { tag: "section", id: "hero", classes: ["container"] }
 *   "nav#navbar-1-123456" → { tag: "nav", id: "navbar-1-123456", classes: [] }
 */
export function parseWrapper(wrapper: string): ParsedWrapper {
  if (!wrapper) {
    return { tag: "div", classes: [] };
  }

  // Handle basic HTML tags
  const basicTags = [
    "div",
    "span",
    "section",
    "nav",
    "header",
    "footer",
    "article",
    "aside",
    "main",
    "a",
    "button",
    "input",
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "ul",
    "ol",
    "li",
    "form",
    "label",
    "svg",
    "br",
  ];

  // Check if it's just a simple tag
  if (basicTags.includes(wrapper.toLowerCase())) {
    return { tag: wrapper.toLowerCase(), classes: [] };
  }

  // Parse complex wrapper like "div#id.class1.class2"
  let tag = "div";
  let id: string | undefined;
  const classes: string[] = [];

  // Extract tag (everything before # or .)
  const tagMatch = wrapper.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
  if (tagMatch) {
    tag = tagMatch[1].toLowerCase();
  }

  // Extract id (everything after # until . or end)
  const idMatch = wrapper.match(/#([^.#]+)/);
  if (idMatch) {
    id = idMatch[1];
  }

  // Extract classes (everything after each .)
  const classMatches = wrapper.match(/\.([^.#]+)/g);
  if (classMatches) {
    classMatches.forEach((match) => {
      classes.push(match.substring(1)); // Remove the leading .
    });
  }

  return { tag, id, classes };
}

// Common iterator prefixes used for binding detection
const BINDING_PREFIXES = [
  "slide.",
  "item.",
  "product.",
  "category.",
  "review.",
  "post.",
  "brand.",
];

/**
 * Check if a value is a binding path (e.g., 'slide.button_bg_color')
 */
function isBindingPath(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return BINDING_PREFIXES.some((prefix) => value.startsWith(prefix));
}

/**
 * Check if a value is a gradient config object
 */
function isGradientConfig(value: unknown): value is {
  type: "gradient";
  direction?: string;
  start: string;
  end: string;
} {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    obj.type === "gradient" &&
    typeof obj.start === "string" &&
    typeof obj.end === "string"
  );
}

/**
 * Check if a value is an expression config object
 */
function isExpressionConfig(value: unknown): value is { expr: string } {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.expr === "string";
}

/**
 * Check if a value is a field + transform config object
 * e.g., { field: "overlay_opacity", transform: "divide_100" }
 */
function isFieldTransformConfig(
  value: unknown
): value is { field: string; transform: string } {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.field === "string" && typeof obj.transform === "string";
}

/**
 * Evaluate a simple expression with data bindings
 * Supports: slide.property / number, slide.property * number, etc.
 */
function evaluateExpression(
  expr: string,
  data: Record<string, unknown>,
  context: Record<string, unknown>
): unknown {
  // Simple expression parser for common patterns like "slide.overlay_opacity / 100"
  const mergedData = { ...data, ...context };

  // Handle division: "slide.overlay_opacity / 100"
  const divMatch = expr.match(
    /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*\/\s*(\d+(?:\.\d+)?)$/
  );
  if (divMatch) {
    const value = getValue(mergedData, divMatch[1]);
    const divisor = parseFloat(divMatch[2]);
    if (typeof value === "number" && !isNaN(divisor)) {
      return value / divisor;
    }
  }

  // Handle multiplication: "slide.overlay_opacity * 100"
  const mulMatch = expr.match(
    /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*\*\s*(\d+(?:\.\d+)?)$/
  );
  if (mulMatch) {
    const value = getValue(mergedData, mulMatch[1]);
    const multiplier = parseFloat(mulMatch[2]);
    if (typeof value === "number" && !isNaN(multiplier)) {
      return value * multiplier;
    }
  }

  // Handle simple binding path
  if (isBindingPath(expr)) {
    return getValue(mergedData, expr);
  }

  return undefined;
}

/**
 * Convert snake_case style object to camelCase React CSSProperties
 * Optionally resolves binding paths if data and context are provided
 * Also handles bind_style for dynamic style bindings including gradients
 */
export function convertStyleToCSS(
  style?: BlockStyle,
  data?: Record<string, unknown>,
  context?: Record<string, unknown>,
  bindStyle?: Record<string, unknown>
): CSSProperties {
  if (!style && !bindStyle) return {};

  const cssMap: Record<string, string> = {
    background_color: "backgroundColor",
    border_color: "borderColor",
    border_radius: "borderRadius",
    border_width: "borderWidth",
    font_size: "fontSize",
    font_weight: "fontWeight",
    font_family: "fontFamily",
    line_height: "lineHeight",
    letter_spacing: "letterSpacing",
    text_align: "textAlign",
    text_decoration: "textDecoration",
    text_transform: "textTransform",
    box_shadow: "boxShadow",
    min_width: "minWidth",
    max_width: "maxWidth",
    min_height: "minHeight",
    max_height: "maxHeight",
    z_index: "zIndex",
    flex_direction: "flexDirection",
    justify_content: "justifyContent",
    align_items: "alignItems",
    flex_wrap: "flexWrap",
    grid_template_columns: "gridTemplateColumns",
    grid_template_rows: "gridTemplateRows",
    gap: "gap",
    row_gap: "rowGap",
    column_gap: "columnGap",
  };

  const result: CSSProperties = {};

  // Process regular style object
  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const cssKey = cssMap[key] || key;

      // Check if value is a binding path and resolve it
      let resolvedValue = value;
      if (isBindingPath(value) && (data || context)) {
        const bound = resolveBinding(
          value as string,
          data || {},
          context || {}
        );
        if (bound !== undefined && bound !== null) {
          resolvedValue = bound;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[cssKey] = resolvedValue;
    });
  }

  // Process bind_style for dynamic bindings (gradients, expressions, etc.)
  if (bindStyle && (data || context)) {
    Object.entries(bindStyle).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const cssKey = cssMap[key] || key;

      // Handle gradient type
      if (isGradientConfig(value)) {
        const startColor = resolveBinding(
          value.start,
          data || {},
          context || {}
        );
        const endColor = resolveBinding(value.end, data || {}, context || {});
        const direction = value.direction || "to right";

        if (startColor && endColor) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[
            cssKey
          ] = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
        }
      } else if (isExpressionConfig(value)) {
        // Handle expression config like { expr: "slide.overlay_opacity / 100" }
        const evaluated = evaluateExpression(
          value.expr,
          data || {},
          context || {}
        );
        if (evaluated !== undefined && evaluated !== null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[cssKey] = evaluated;
        }
      } else if (isFieldTransformConfig(value)) {
        // Handle field + transform config like { field: "overlay_opacity", transform: "divide_100" }
        const fieldValue = resolveBinding(
          value.field,
          data || {},
          context || {}
        );
        if (
          fieldValue !== undefined &&
          fieldValue !== null &&
          typeof fieldValue === "number"
        ) {
          let transformedValue: unknown = fieldValue;
          switch (value.transform) {
            case "divide_100":
              transformedValue = fieldValue / 100;
              break;
            case "multiply_100":
              transformedValue = fieldValue * 100;
              break;
            case "percent":
              transformedValue = `${fieldValue}%`;
              break;
            case "px":
              transformedValue = `${fieldValue}px`;
              break;
            default:
              transformedValue = fieldValue;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[cssKey] = transformedValue;
        }
      } else if (typeof value === "string") {
        // Handle any string value as a binding path in bind_style
        // bind_style is explicitly for dynamic bindings, so any string is a data path
        const bound = resolveBinding(value, data || {}, context || {});
        if (bound !== undefined && bound !== null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any)[cssKey] = bound;
        }
      }
    });
  }

  return result;
}

/**
 * Get value from nested object path
 * Examples:
 *   getValue({ a: { b: 1 } }, "a.b") → 1
 *   getValue({ items: [{ name: "test" }] }, "items[0].name") → "test"
 */
export function getValue(data: Record<string, unknown>, path: string): unknown {
  if (!path || !data) return undefined;

  // Handle array index notation like "items[0].name"
  const normalizedPath = path.replace(/\[(\d+)\]/g, ".$1");
  const keys = normalizedPath.split(".");

  let current: unknown = data;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

/**
 * Resolve a binding value from data context
 * Handles paths like "item.url", "product.name", "cart_count"
 */
export function resolveBinding(
  bindPath: string,
  data: Record<string, unknown>,
  context: Record<string, unknown> = {}
): unknown {
  // Merge context with data (context takes precedence for iterator variables)
  const mergedData = { ...data, ...context };
  return getValue(mergedData, bindPath);
}

/**
 * Evaluate a condition against data
 */
export function evaluateCondition(
  condition: Condition,
  data: Record<string, unknown>,
  context: Record<string, unknown> = {}
): boolean {
  const { field, op, value: expectedValue } = condition;
  const actualValue = resolveBinding(field, data, context);

  switch (op) {
    case "equals":
      return actualValue === expectedValue;

    case "not_equals":
      return actualValue !== expectedValue;

    case "not_empty":
      if (Array.isArray(actualValue)) return actualValue.length > 0;
      if (typeof actualValue === "string") return actualValue.trim() !== "";
      return actualValue !== null && actualValue !== undefined;

    case "empty":
      if (Array.isArray(actualValue)) return actualValue.length === 0;
      if (typeof actualValue === "string") return actualValue.trim() === "";
      return actualValue === null || actualValue === undefined;

    case "gt":
      return (
        typeof actualValue === "number" &&
        typeof expectedValue === "number" &&
        actualValue > expectedValue
      );

    case "lt":
      return (
        typeof actualValue === "number" &&
        typeof expectedValue === "number" &&
        actualValue < expectedValue
      );

    case "gte":
      return (
        typeof actualValue === "number" &&
        typeof expectedValue === "number" &&
        actualValue >= expectedValue
      );

    case "lte":
      return (
        typeof actualValue === "number" &&
        typeof expectedValue === "number" &&
        actualValue <= expectedValue
      );

    case "contains":
      if (
        typeof actualValue === "string" &&
        typeof expectedValue === "string"
      ) {
        return actualValue.includes(expectedValue);
      }
      if (Array.isArray(actualValue)) {
        return actualValue.includes(expectedValue);
      }
      return false;

    default:
      console.warn(`Unknown condition operator: ${op}`);
      return true;
  }
}

/**
 * Create event handler based on block event configuration
 */
export function createEventHandler(
  event: BlockEvent,
  data: Record<string, unknown>,
  context: Record<string, unknown>,
  handlers: {
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
  }
): (() => void) | undefined {
  const { action, target, value } = event;

  // Resolve target if it's a binding
  const resolvedTarget =
    target?.startsWith?.("item.") ||
    target?.startsWith?.("product.") ||
    target?.startsWith?.("slide.")
      ? String(resolveBinding(target, data, context) || target)
      : target;

  switch (action) {
    case "navigate":
      return () => {
        if (handlers.navigate) {
          handlers.navigate(resolvedTarget);
        } else {
          // Default: use window.location
          if (
            resolvedTarget.startsWith("/") ||
            resolvedTarget.startsWith("http")
          ) {
            window.location.href = resolvedTarget;
          }
        }
      };

    case "toggle_drawer":
      return () => handlers.toggleDrawer?.(resolvedTarget);

    case "toggle_theme":
      return () => handlers.toggleTheme?.();

    case "search":
      return () => handlers.search?.(resolvedTarget);

    case "slider_prev":
      return (e?: React.MouseEvent) => {
        // First try the handler passed from parent (works for elements inside Swiper)
        if (handlers.sliderPrev) {
          handlers.sliderPrev(resolvedTarget);
        } else {
          // Fallback to global swiper registry (works for elements outside Swiper)
          // Try to find the closest swiper to the clicked element
          const swiperRegistry = (window as unknown as Record<string, unknown>)
            .__swiperRegistry as
            | {
                prev: (target: string) => void;
                findClosest?: (
                  element: HTMLElement | null
                ) => { slidePrev: () => void } | undefined;
              }
            | undefined;

          // If we have the event, try to find the swiper in the same section
          if (e?.currentTarget && swiperRegistry) {
            const element = e.currentTarget as HTMLElement;
            const section = element.closest('section[id^="hero-"]');
            if (section) {
              // Use section ID as target to find the right swiper
              const sectionId = section.id;
              swiperRegistry.prev(sectionId);
              return;
            }
          }

          swiperRegistry?.prev(resolvedTarget);
        }
      };

    case "slider_next":
      return (e?: React.MouseEvent) => {
        // First try the handler passed from parent (works for elements inside Swiper)
        if (handlers.sliderNext) {
          handlers.sliderNext(resolvedTarget);
        } else {
          // Fallback to global swiper registry (works for elements outside Swiper)
          const swiperRegistry = (window as unknown as Record<string, unknown>)
            .__swiperRegistry as
            | {
                next: (target: string) => void;
              }
            | undefined;

          // If we have the event, try to find the swiper in the same section
          if (e?.currentTarget && swiperRegistry) {
            const element = e.currentTarget as HTMLElement;
            const section = element.closest('section[id^="hero-"]');
            if (section) {
              // Use section ID as target to find the right swiper
              const sectionId = section.id;
              swiperRegistry.next(sectionId);
              return;
            }
          }

          swiperRegistry?.next(resolvedTarget);
        }
      };

    case "slider_goto":
      return (e?: React.MouseEvent) => {
        const index = Number(resolvedTarget);
        // First try the handler passed from parent
        if (handlers.sliderGoto) {
          handlers.sliderGoto(index);
        } else {
          // Fallback to global swiper registry
          const swiperRegistry = (window as unknown as Record<string, unknown>)
            .__swiperRegistry as
            | {
                goto: (index: number, target: string) => void;
              }
            | undefined;

          // If we have the event, try to find the swiper in the same section
          if (e?.currentTarget && swiperRegistry) {
            const element = e.currentTarget as HTMLElement;
            const section = element.closest('section[id^="hero-"]');
            if (section) {
              swiperRegistry.goto(index, section.id);
              return;
            }
          }

          swiperRegistry?.goto(index, resolvedTarget);
        }
      };

    case "toggle_accordion":
      return () => handlers.toggleAccordion?.(resolvedTarget);

    case "toggle_dropdown":
      return () => handlers.toggleDropdown?.(resolvedTarget);

    case "set_style":
      return () => handlers.setStyle?.(resolvedTarget, value);

    default:
      console.warn(`Unknown event action: ${action}`);
      return undefined;
  }
}

/**
 * Generate a unique key for block rendering
 */
export function generateBlockKey(
  block: Record<string, unknown>,
  index: number
): string {
  const id = block.id as string | undefined;
  const wrapper = block.wrapper as string | undefined;
  const type = block.type as string | undefined;

  if (id) return id;
  if (wrapper) {
    const parsed = parseWrapper(wrapper);
    if (parsed.id) return parsed.id;
  }

  return `block-${type || "element"}-${index}`;
}

/**
 * Check if a block is a special type that needs custom rendering
 */
export function getBlockType(block: Record<string, unknown>): string {
  const type = block.type as string | undefined;

  if (type === "repeater") return "repeater";
  if (type === "swiper") return "swiper";
  if (type === "marquee") return "marquee";
  if (type === "icon") return "icon";
  if (type === "icon_button") return "icon_button";
  if (type === "nav_button") return "nav_button";
  if (type === "text_input") return "text_input";

  return "element";
}
