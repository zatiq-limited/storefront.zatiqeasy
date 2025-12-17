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
 */
export function parseWrapper(wrapper: string): ParsedWrapper {
  if (!wrapper) {
    return { tag: "div", classes: [] };
  }

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

  if (basicTags.includes(wrapper.toLowerCase())) {
    return { tag: wrapper.toLowerCase(), classes: [] };
  }

  let tag = "div";
  let id: string | undefined;
  const classes: string[] = [];

  const tagMatch = wrapper.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
  if (tagMatch) {
    tag = tagMatch[1].toLowerCase();
  }

  const idMatch = wrapper.match(/#([^.#]+)/);
  if (idMatch) {
    id = idMatch[1];
  }

  const classMatches = wrapper.match(/\.([^.#]+)/g);
  if (classMatches) {
    classMatches.forEach((match) => {
      classes.push(match.substring(1));
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

function isBindingPath(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return BINDING_PREFIXES.some((prefix) => value.startsWith(prefix));
}

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

function isUrlConfig(value: unknown): value is { type: "url"; field: string } {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return obj.type === "url" && typeof obj.field === "string";
}

function isExpressionConfig(value: unknown): value is { expr: string } {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.expr === "string";
}

function isFieldTransformConfig(
  value: unknown
): value is { field: string; transform: string } {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.field === "string" && typeof obj.transform === "string";
}

function evaluateExpression(
  expr: string,
  data: Record<string, unknown>,
  context: Record<string, unknown>
): unknown {
  const mergedData = { ...data, ...context };

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

  if (isBindingPath(expr)) {
    return getValue(mergedData, expr);
  }

  return undefined;
}

/**
 * Convert snake_case style object to camelCase React CSSProperties
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

  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const cssKey = cssMap[key] || key;

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

  if (bindStyle && (data || context)) {
    Object.entries(bindStyle).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const cssKey = cssMap[key] || key;

      if (isUrlConfig(value)) {
        const url = resolveBinding(value.field, data || {}, context || {});
        if (url && typeof url === "string") {
          if (key === "background_image" || cssKey === "backgroundImage") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (result as any)["backgroundImage"] = `url(${url})`;
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (result as any)[cssKey] = `url(${url})`;
          }
        }
      } else if (isGradientConfig(value)) {
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
 */
export function getValue(data: Record<string, unknown>, path: string): unknown {
  if (!path || !data) return undefined;

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
 */
export function resolveBinding(
  bindPath: string,
  data: Record<string, unknown>,
  context: Record<string, unknown> = {}
): unknown {
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

    case "sliderPrev":
    case "slider_prev":
      return () => {
        if (handlers.sliderPrev) {
          handlers.sliderPrev(resolvedTarget);
        } else {
          const swiperRegistry = (window as unknown as Record<string, unknown>)
            .__swiperRegistry as
            | { prev: (target: string) => void }
            | undefined;
          swiperRegistry?.prev(resolvedTarget);
        }
      };

    case "sliderNext":
    case "slider_next":
      return () => {
        if (handlers.sliderNext) {
          handlers.sliderNext(resolvedTarget);
        } else {
          const swiperRegistry = (window as unknown as Record<string, unknown>)
            .__swiperRegistry as
            | { next: (target: string) => void }
            | undefined;
          swiperRegistry?.next(resolvedTarget);
        }
      };

    case "slider_goto":
      return () => {
        const index = Number(resolvedTarget);
        if (handlers.sliderGoto) {
          handlers.sliderGoto(index);
        } else {
          const swiperRegistry = (window as unknown as Record<string, unknown>)
            .__swiperRegistry as
            | { goto: (index: number, target: string) => void }
            | undefined;
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
