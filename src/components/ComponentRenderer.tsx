/**
 * ========================================
 * COMPONENT RENDERER
 * ========================================
 *
 * Dynamic component rendering based on API response
 * Supports both section object and direct props
 */

import { getComponent } from "../lib/component-registry";
import type { Section } from "../lib/types";

interface ComponentRendererProps {
  // Option 1: Pass section object (homepage.json style)
  section?: Section;

  // Option 2: Pass props directly (theme.json style)
  type?: string;
  settings?: any;
  blocks?: any[];
  products?: any[];
  posts?: any[];
  reviews?: any[];
  testimonials?: any[];
  tabs?: any[];
  contact?: any;
  paymentIcons?: any[];
  enabled?: boolean;

  // Global settings for font inheritance
  globalSettings?: any;

  client?: "load" | "visible" | "idle" | "only";
  [key: string]: any; // Allow spread props
}

/**
 * Component Renderer
 * API response থেকে component type অনুযায়ী dynamic rendering করে
 */
export default function ComponentRenderer(props: ComponentRendererProps) {
  const {
    section,
    type: directType,
    client = "load",
    globalSettings,
    ...restProps
  } = props;

  // Determine if using section object or direct props
  const componentType = section?.type || directType;
  const enabled = section?.enabled !== false && restProps.enabled !== false;
  const componentId = section?.id || `component-${componentType}`;

  // Check if explicitly disabled
  if (!enabled) {
    return null;
  }

  if (!componentType) {
    console.error("ComponentRenderer: No component type provided");
    return null;
  }

  // Get component from registry
  const Component = getComponent(componentType);

  // Component not found - show error in development
  if (!Component) {
    if (import.meta.env.DEV) {
      return (
        <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
          <p className="text-red-800 font-semibold">
            Component not found: {componentType}
          </p>
          <p className="text-red-600 text-sm mt-1">
            Make sure the component is registered in component-registry.ts
          </p>
        </div>
      );
    }
    return null;
  }

  // Helper: Convert snake_case to camelCase
  const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  // Helper: Convert object keys from snake_case to camelCase
  const convertKeysToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertKeysToCamelCase(item));
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc: any, key) => {
        const camelKey = toCamelCase(key);
        acc[camelKey] = convertKeysToCamelCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  };

  // Prepare props for component
  let componentProps: any = {};

  if (section) {
    // Using section object (homepage.json style)
    // Extract data from blocks[0].data if available (V3.0 Schema)
    const blockData = section.blocks?.[0]?.data || {};

    // Get settings with snake_case to camelCase conversion
    const settingsRaw = section.settings || {};
    const settingsCamel = convertKeysToCamelCase(settingsRaw);

    // Get block data with snake_case to camelCase conversion
    const blockDataCamel = convertKeysToCamelCase(blockData);

    // Products can be at section level, block data level, or blocks[0].data.products
    const products =
      section.products || blockData.products || blockDataCamel.products || [];
    const productsCamel = convertKeysToCamelCase(products);

    componentProps = {
      // Spread settings first (camelCase)
      ...settingsCamel,
      // Then spread block data (camelCase) - this may override settings
      ...blockDataCamel,
      // Keep original objects too for backward compatibility
      settings: settingsRaw,
      blocks: section.blocks,
      // Products from various sources
      products: productsCamel,
      posts: section.posts || blockData.posts,
      reviews: section.reviews || blockData.reviews,
      testimonials: section.testimonials || blockData.testimonials,
      tabs: section.tabs || blockData.tabs,
      breadcrumbs: section.breadcrumbs,
      // Pass through product if provided (for single product pages)
      product: restProps.product,
      // Pass through checkout data (for checkout components)
      paymentMethods: restProps.paymentMethods,
      deliveryOptions: restProps.deliveryOptions,
      currency:
        settingsCamel.currency || blockDataCamel.currency || restProps.currency,
    };
  } else {
    // Using direct props (theme.json style)
    const {
      settings,
      blocks,
      products,
      posts,
      reviews,
      testimonials,
      tabs,
      contact,
      paymentIcons,
      enabled,
      ...spreadProps
    } = restProps;
    componentProps = {
      ...settings,
      ...spreadProps,
      settings,
      blocks,
      products,
      posts,
      reviews,
      testimonials,
      tabs,
      contact,
      paymentIcons,
    };
  }

  // Resolve font inheritance: if fontFamily is "inherit", use global font
  if (globalSettings?.typography?.fontFamily) {
    if (componentProps.fontFamily === "inherit") {
      componentProps.fontFamily = globalSettings.typography.fontFamily;
    }
    // Also check in settings object if it exists
    if (componentProps.settings?.fontFamily === "inherit") {
      componentProps.settings.fontFamily = globalSettings.typography.fontFamily;
    }
  }

  // Render component with all data
  return (
    <div
      data-section-id={componentId}
      data-section-type={componentType}
      className="zatiq-section"
    >
      <Component {...componentProps} />
    </div>
  );
}
