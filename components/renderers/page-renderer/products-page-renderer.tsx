/**
 * ========================================
 * PRODUCTS PAGE RENDERER
 * ========================================
 *
 * Renders products page sections dynamically based on JSON configuration.
 * Uses modular sub-components for maintainability.
 */

"use client";

import type { Section, Pagination as PaginationType } from "@/lib/types";
import type { Product, ProductFilters } from "@/stores/productsStore";
import ProductsLayout, {
  type Category,
} from "./page-components/products/products-layout";
import ProductsHero1 from "./page-components/products/products-hero-1";
import ProductsHero2 from "./page-components/products/products-hero-2";
import BlockRenderer from "@/components/renderers/block-renderer";

interface ProductsPageRendererProps {
  sections: Section[];
  products: Product[];
  categories?: Category[];
  pagination: PaginationType | null;
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Section renderer - maps section types to components
 */
function renderSection(
  section: Section,
  props: {
    products: Product[];
    categories: Category[];
    pagination: PaginationType | null;
    filters: ProductFilters;
    onFiltersChange: (filters: Partial<ProductFilters>) => void;
    isLoading: boolean;
  }
) {
  if (section.enabled === false) return null;

  const { products, categories, pagination, filters, onFiltersChange, isLoading } =
    props;

  // Hero sections
  if (section.type === "products-hero-1") {
    return (
      <div
        key={section.id}
        data-section-id={section.id}
        data-section-type={section.type}
      >
        <ProductsHero1
          settings={section.settings}
          productCount={pagination?.total || products.length}
          searchQuery={filters.search}
          category={filters.category}
        />
      </div>
    );
  }

  if (section.type === "products-hero-2") {
    return (
      <div
        key={section.id}
        data-section-id={section.id}
        data-section-type={section.type}
      >
        <ProductsHero2
          settings={section.settings}
          productCount={pagination?.total || products.length}
          searchQuery={filters.search}
          category={filters.category}
        />
      </div>
    );
  }

  // Products layout sections
  if (section.type.includes("products-layout")) {
    return (
      <div
        key={section.id}
        data-section-id={section.id}
        data-section-type={section.type}
      >
        <ProductsLayout
          settings={section.settings}
          products={products}
          categories={categories}
          filters={filters}
          onFiltersChange={onFiltersChange}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // Custom sections use BlockRenderer
  if (section.type.includes("custom-sections")) {
    const block = section.blocks?.[0];
    if (!block) return null;

    return (
      <div
        key={section.id}
        data-section-id={section.id}
        data-section-type={section.type}
      >
        <BlockRenderer
          block={block as import("@/components/renderers/block-renderer").Block}
          data={(block.data as Record<string, unknown>) || {}}
        />
      </div>
    );
  }

  // Unknown section type - show warning in dev mode
  if (process.env.NEXT_PUBLIC_SYSTEM_ENV === "DEV") {
    return (
      <div
        key={section.id}
        className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4"
      >
        <p className="text-yellow-800 font-semibold">
          Component not found: {section.type}
        </p>
      </div>
    );
  }

  return null;
}

/**
 * Products Page Renderer
 *
 * Main component that renders the products page based on section configuration.
 */
export default function ProductsPageRenderer({
  sections,
  products,
  categories = [],
  pagination,
  filters,
  onFiltersChange,
  isLoading = false,
  className = "",
}: ProductsPageRendererProps) {
  const renderProps = {
    products,
    categories,
    pagination,
    filters,
    onFiltersChange,
    isLoading,
  };

  return (
    <div className={`zatiq-products-page ${className}`}>
      {sections.map((section) => renderSection(section, renderProps))}
    </div>
  );
}

// Re-export types for convenience
export type { Category };
