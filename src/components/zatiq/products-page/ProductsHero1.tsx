import React from "react";

/**
 * Settings interface matching snake_case format from products-page.json
 */
interface ProductsHero1Settings {
  // Content
  title?: string;
  description?: string;
  // Visibility
  show_breadcrumb?: boolean;
  show_product_count?: boolean;
  // Gradient colors
  gradient_start?: string;
  gradient_end?: string;
  // Typography - Title
  title_font_family?: string;
  title_font_size?: string;
  title_font_weight?: string;
  title_color?: string;
  // Typography - Description
  description_font_family?: string;
  description_font_size?: string;
  description_color?: string;
  // Typography - Breadcrumb & Product Count
  breadcrumb_color?: string;
  product_count_color?: string;
  product_count_font_size?: string;
}

interface ProductsHero1Props {
  settings?: ProductsHero1Settings;
  productCount?: number;
  breadcrumbs?: Array<{ label: string; href: string }>;
  searchQuery?: string;
  category?: string;
}

const ProductsHero1: React.FC<ProductsHero1Props> = ({
  settings = {},
  productCount = 0,
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ],
  searchQuery,
  category,
}) => {
  // Extract settings with defaults (snake_case from JSON)
  const {
    title,
    description = "Discover our curated collection of premium products",
    show_breadcrumb = true,
    show_product_count = true,
    gradient_start = "#EBF4FF",
    gradient_end = "#F3E8FF",
    title_font_family = "inherit",
    title_font_size = "text-4xl md:text-5xl",
    title_font_weight = "font-bold",
    title_color = "#111827",
    description_font_family = "inherit",
    description_font_size = "text-lg",
    description_color = "#4B5563",
    breadcrumb_color = "#6B7280",
    product_count_color = "#6B7280",
    product_count_font_size = "text-sm",
  } = settings;

  // Dynamic title based on search or category
  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category
    ? `${category} Products`
    : title || "All Products";

  // Build gradient style
  const gradientStyle = {
    background: `linear-gradient(to right, ${gradient_start}, ${gradient_end})`,
  };

  // Build font styles
  const titleStyle: React.CSSProperties = {
    color: title_color,
    fontFamily: title_font_family !== "inherit" ? title_font_family : undefined,
  };

  const descriptionStyle: React.CSSProperties = {
    color: description_color,
    fontFamily: description_font_family !== "inherit" ? description_font_family : undefined,
  };

  const breadcrumbStyle: React.CSSProperties = {
    color: breadcrumb_color,
  };

  const productCountStyle: React.CSSProperties = {
    color: product_count_color,
  };

  return (
    <section style={gradientStyle}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Breadcrumb */}
        {show_breadcrumb && (
          <nav className="mb-4 pt-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2"
                      style={{ color: breadcrumb_color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium" style={breadcrumbStyle}>
                      {crumb.label}
                    </span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="hover:opacity-80 transition-opacity"
                      style={breadcrumbStyle}
                    >
                      {crumb.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title and Description */}
        <div className="text-center py-12 md:py-16">
          <h1
            className={`${title_font_size} ${title_font_weight} mb-4`}
            style={titleStyle}
          >
            {displayTitle}
          </h1>
          <p
            className={`${description_font_size} max-w-2xl mx-auto`}
            style={descriptionStyle}
          >
            {description}
          </p>
          {show_product_count && productCount > 0 && (
            <p
              className={`mt-4 ${product_count_font_size}`}
              style={productCountStyle}
            >
              Showing {productCount} products
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsHero1;
