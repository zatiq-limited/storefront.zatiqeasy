/**
 * ========================================
 * BLOCK UTILITIES
 * ========================================
 *
 * Utility functions for V3.0 Schema Block Renderer
 */

import type { CSSProperties } from 'react';

// Types
export interface ParsedWrapper {
  tag: string;
  id?: string;
  classes: string[];
}

export interface Condition {
  field: string;
  op: 'equals' | 'not_equals' | 'not_empty' | 'empty' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
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
    return { tag: 'div', classes: [] };
  }

  // Handle basic HTML tags
  const basicTags = ['div', 'span', 'section', 'nav', 'header', 'footer', 'article', 'aside',
                     'main', 'a', 'button', 'input', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                     'p', 'ul', 'ol', 'li', 'form', 'label', 'svg', 'br'];

  // Check if it's just a simple tag
  if (basicTags.includes(wrapper.toLowerCase())) {
    return { tag: wrapper.toLowerCase(), classes: [] };
  }

  // Parse complex wrapper like "div#id.class1.class2"
  let tag = 'div';
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
    classMatches.forEach(match => {
      classes.push(match.substring(1)); // Remove the leading .
    });
  }

  return { tag, id, classes };
}

/**
 * Convert snake_case style object to camelCase React CSSProperties
 */
export function convertStyleToCSS(style?: BlockStyle): CSSProperties {
  if (!style) return {};

  const cssMap: Record<string, string> = {
    background_color: 'backgroundColor',
    border_color: 'borderColor',
    border_radius: 'borderRadius',
    border_width: 'borderWidth',
    font_size: 'fontSize',
    font_weight: 'fontWeight',
    font_family: 'fontFamily',
    line_height: 'lineHeight',
    letter_spacing: 'letterSpacing',
    text_align: 'textAlign',
    text_decoration: 'textDecoration',
    text_transform: 'textTransform',
    box_shadow: 'boxShadow',
    min_width: 'minWidth',
    max_width: 'maxWidth',
    min_height: 'minHeight',
    max_height: 'maxHeight',
    z_index: 'zIndex',
    flex_direction: 'flexDirection',
    justify_content: 'justifyContent',
    align_items: 'alignItems',
    flex_wrap: 'flexWrap',
    grid_template_columns: 'gridTemplateColumns',
    grid_template_rows: 'gridTemplateRows',
    gap: 'gap',
    row_gap: 'rowGap',
    column_gap: 'columnGap',
  };

  const result: CSSProperties = {};

  Object.entries(style).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const cssKey = cssMap[key] || key;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any)[cssKey] = value;
  });

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
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
  const keys = normalizedPath.split('.');

  let current: unknown = data;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
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
    case 'equals':
      return actualValue === expectedValue;

    case 'not_equals':
      return actualValue !== expectedValue;

    case 'not_empty':
      if (Array.isArray(actualValue)) return actualValue.length > 0;
      if (typeof actualValue === 'string') return actualValue.trim() !== '';
      return actualValue !== null && actualValue !== undefined;

    case 'empty':
      if (Array.isArray(actualValue)) return actualValue.length === 0;
      if (typeof actualValue === 'string') return actualValue.trim() === '';
      return actualValue === null || actualValue === undefined;

    case 'gt':
      return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue > expectedValue;

    case 'lt':
      return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue < expectedValue;

    case 'gte':
      return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue >= expectedValue;

    case 'lte':
      return typeof actualValue === 'number' && typeof expectedValue === 'number' && actualValue <= expectedValue;

    case 'contains':
      if (typeof actualValue === 'string' && typeof expectedValue === 'string') {
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
  const resolvedTarget = target?.startsWith?.('item.') || target?.startsWith?.('product.') || target?.startsWith?.('slide.')
    ? String(resolveBinding(target, data, context) || target)
    : target;

  switch (action) {
    case 'navigate':
      return () => {
        if (handlers.navigate) {
          handlers.navigate(resolvedTarget);
        } else {
          // Default: use window.location
          if (resolvedTarget.startsWith('/') || resolvedTarget.startsWith('http')) {
            window.location.href = resolvedTarget;
          }
        }
      };

    case 'toggle_drawer':
      return () => handlers.toggleDrawer?.(resolvedTarget);

    case 'toggle_theme':
      return () => handlers.toggleTheme?.();

    case 'search':
      return () => handlers.search?.(resolvedTarget);

    case 'slider_prev':
      return () => handlers.sliderPrev?.(resolvedTarget);

    case 'slider_next':
      return () => handlers.sliderNext?.(resolvedTarget);

    case 'slider_goto':
      return () => handlers.sliderGoto?.(Number(resolvedTarget));

    case 'toggle_accordion':
      return () => handlers.toggleAccordion?.(resolvedTarget);

    case 'toggle_dropdown':
      return () => handlers.toggleDropdown?.(resolvedTarget);

    case 'set_style':
      return () => handlers.setStyle?.(resolvedTarget, value);

    default:
      console.warn(`Unknown event action: ${action}`);
      return undefined;
  }
}

/**
 * Generate a unique key for block rendering
 */
export function generateBlockKey(block: Record<string, unknown>, index: number): string {
  const id = block.id as string | undefined;
  const wrapper = block.wrapper as string | undefined;
  const type = block.type as string | undefined;

  if (id) return id;
  if (wrapper) {
    const parsed = parseWrapper(wrapper);
    if (parsed.id) return parsed.id;
  }

  return `block-${type || 'element'}-${index}`;
}

/**
 * Check if a block is a special type that needs custom rendering
 */
export function getBlockType(block: Record<string, unknown>): string {
  const type = block.type as string | undefined;

  if (type === 'repeater') return 'repeater';
  if (type === 'swiper') return 'swiper';
  if (type === 'marquee') return 'marquee';
  if (type === 'icon') return 'icon';
  if (type === 'icon_button') return 'icon_button';
  if (type === 'nav_button') return 'nav_button';
  if (type === 'text_input') return 'text_input';

  return 'element';
}
