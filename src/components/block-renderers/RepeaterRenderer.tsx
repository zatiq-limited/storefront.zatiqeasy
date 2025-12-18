/**
 * ========================================
 * REPEATER RENDERER
 * ========================================
 *
 * Handles V3.0 Schema repeater blocks
 * Iterates over data arrays and renders templates
 */

"use client";

import React, { useMemo } from "react";
import { resolveBinding, generateBlockKey } from "@/lib/block-utils";
import type { Block, BlockRendererProps } from "../BlockRenderer";

// Avoid circular import - import BlockRenderer dynamically
const BlockRenderer = React.lazy(() => import("../BlockRenderer"));

export interface RepeaterRendererProps {
  block: Block;
  data: Record<string, unknown>;
  context: Record<string, unknown>;
  eventHandlers?: BlockRendererProps["eventHandlers"];
}

/**
 * Repeater Renderer Component
 * Handles blocks with type: 'repeater'
 *
 * Example block:
 * {
 *   type: 'repeater',
 *   source: 'menu_items',
 *   iterator: 'item',
 *   index: 'idx',
 *   template: { wrapper: 'a', bind_content: 'item.label', ... }
 * }
 */
export default function RepeaterRenderer({
  block,
  data,
  context,
  eventHandlers,
}: RepeaterRendererProps) {
  const { source, iterator = "item", index: indexName, template } = block;

  // Merge block.data with incoming data (block.data takes precedence)
  const mergedData = useMemo(() => {
    const blockData = (block.data as Record<string, unknown>) || {};
    return { ...data, ...blockData };
  }, [data, block.data]);

  if (!source || !template) {
    console.warn("RepeaterRenderer: Missing source or template");
    return null;
  }

  // Get the source array from mergedData first, then context
  let sourceArray = resolveBinding(source, mergedData, context);

  // If not found directly, try as a top-level key in mergedData
  if (!Array.isArray(sourceArray)) {
    sourceArray = mergedData[source];
  }

  // Still not found? Try context
  if (!Array.isArray(sourceArray)) {
    sourceArray = context[source];
  }

  if (!Array.isArray(sourceArray)) {
    if (import.meta.env.DEV) {
      console.warn(`RepeaterRenderer: Source "${source}" is not an array`, {
        data: mergedData,
        context,
      });
    }
    return null;
  }

  return renderItems(
    sourceArray,
    iterator,
    indexName,
    template,
    mergedData,
    context,
    eventHandlers
  );
}

/**
 * Render the repeated items
 */
function renderItems(
  items: unknown[],
  iterator: string,
  indexName: string | undefined,
  template: Block,
  data: Record<string, unknown>,
  context: Record<string, unknown>,
  eventHandlers: BlockRendererProps["eventHandlers"]
): React.ReactElement {
  return (
    <React.Suspense fallback={null}>
      <>
        {items.map((item, idx) => {
          // Create new context with iterator variable
          const itemContext: Record<string, unknown> = {
            ...context,
            [iterator]: item,
          };

          // Add index if specified
          if (indexName) {
            itemContext[indexName] = idx;
          }

          // Generate unique key
          const itemKey = generateItemKey(item, idx, iterator);

          return (
            <BlockRenderer
              key={itemKey}
              block={template}
              data={data}
              context={itemContext}
              eventHandlers={eventHandlers}
            />
          );
        })}
      </>
    </React.Suspense>
  );
}

/**
 * Generate a unique key for a repeated item
 */
function generateItemKey(
  item: unknown,
  index: number,
  iterator: string
): string {
  // Try to use item's id or unique identifier
  if (item && typeof item === "object") {
    const itemObj = item as Record<string, unknown>;
    if (itemObj.id) return `${iterator}-${itemObj.id}`;
    if (itemObj.label) return `${iterator}-${itemObj.label}-${index}`;
    if (itemObj.name) return `${iterator}-${itemObj.name}-${index}`;
    if (itemObj.url) return `${iterator}-${itemObj.url}-${index}`;
  }

  return `${iterator}-${index}`;
}
