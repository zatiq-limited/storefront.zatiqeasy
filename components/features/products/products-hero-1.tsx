/**
 * ========================================
 * PRODUCTS HERO 1 - GRADIENT DESIGN
 * ========================================
 *
 * Gradient background hero with centered title and description
 */

import Link from "next/link";

interface ProductsHero1Settings {
  title?: string;
  description?: string;
  show_breadcrumb?: boolean;
  show_product_count?: boolean;
  gradient_start?: string;
  gradient_end?: string;
  title_font_family?: string;
  title_font_size?: string;
  title_font_weight?: string;
  title_color?: string;
  description_font_family?: string;
  description_font_size?: string;
  description_color?: string;
  breadcrumb_color?: string;
  product_count_color?: string;
  product_count_font_size?: string;
}

interface ProductsHero1Props {
  settings?: ProductsHero1Settings;
  productCount?: number;
  breadcrumbs?: Array<{ label: string; href: string }>;
  searchQuery?: string | null;
  category?: string | null;
}

export default function ProductsHero1({
  settings = {},
  productCount = 0,
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ],
  searchQuery,
  category,
}: ProductsHero1Props) {
  // Extract settings with defaults (snake_case from JSON)
  const title = settings.title;
  const description =
    settings.description ||
    "Discover our curated collection of premium products";
  const showBreadcrumb = settings.show_breadcrumb !== false;
  const showProductCount = settings.show_product_count !== false;
  const gradientStart = settings.gradient_start || "#EBF4FF";
  const gradientEnd = settings.gradient_end || "#F3E8FF";
  const titleFontFamily = settings.title_font_family || "inherit";
  const titleFontWeight = settings.title_font_weight || "font-bold";
  const titleColor = settings.title_color || "#111827";
  const descriptionFontFamily = settings.description_font_family || "inherit";
  const descriptionColor = settings.description_color || "#4B5563";
  const breadcrumbColor = settings.breadcrumb_color || "#6B7280";
  const productCountColor = settings.product_count_color || "#6B7280";
  const productCountFontSize = settings.product_count_font_size || "text-sm";

  // Dynamic title based on search or category
  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category
    ? `${category} Products`
    : title || "All Products";

  // Build gradient style
  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
  };

  // Build font styles
  const titleStyle: React.CSSProperties = {
    color: titleColor,
    fontFamily: titleFontFamily !== "inherit" ? titleFontFamily : undefined,
  };

  const descriptionStyle: React.CSSProperties = {
    color: descriptionColor,
    fontFamily:
      descriptionFontFamily !== "inherit" ? descriptionFontFamily : undefined,
  };

  const breadcrumbStyle: React.CSSProperties = {
    color: breadcrumbColor,
  };

  const productCountStyle: React.CSSProperties = {
    color: productCountColor,
  };

  return (
    <section style={gradientStyle}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav className="mb-4 pt-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2"
                      style={{ color: breadcrumbColor }}
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
                    <Link
                      href={crumb.href}
                      className="hover:opacity-80 transition-opacity"
                      style={breadcrumbStyle}
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title and Description */}
        <div className="text-center py-12 md:py-16">
          <h1
            className={`text-3xl md:text-4xl lg:text-5xl ${titleFontWeight} mb-4`}
            style={titleStyle}
          >
            {displayTitle}
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={descriptionStyle}
          >
            {description}
          </p>
          {showProductCount && productCount > 0 && (
            <p className={`mt-4 ${productCountFontSize}`} style={productCountStyle}>
              Showing {productCount} products
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
