/**
 * ========================================
 * PRODUCTS HERO 2 - BACKGROUND IMAGE DESIGN
 * ========================================
 *
 * Background image hero with overlay and flexible text alignment
 */

import Link from "next/link";

interface ProductsHero2Settings {
  title?: string;
  description?: string;
  show_breadcrumb?: boolean;
  show_product_count?: boolean;
  background_image?: string;
  overlay_color?: string;
  overlay_opacity?: number;
  hero_height?: string;
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
  text_align?: string;
}

interface ProductsHero2Props {
  settings?: ProductsHero2Settings;
  productCount?: number;
  breadcrumbs?: Array<{ label: string; href: string }>;
  searchQuery?: string | null;
  category?: string | null;
}

export default function ProductsHero2({
  settings = {},
  productCount = 0,
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ],
  searchQuery,
  category,
}: ProductsHero2Props) {
  // Extract settings with defaults (snake_case from JSON)
  const title = settings.title;
  const description =
    settings.description ||
    "Discover our curated collection of premium products";
  const showBreadcrumb = settings.show_breadcrumb !== false;
  const showProductCount = settings.show_product_count !== false;
  const backgroundImage =
    settings.background_image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80";
  const overlayColor = settings.overlay_color || "#000000";
  const overlayOpacity = settings.overlay_opacity ?? 50;
  const titleFontFamily = settings.title_font_family || "inherit";
  const titleFontWeight = settings.title_font_weight || "font-bold";
  const titleColor = settings.title_color || "#FFFFFF";
  const descriptionFontFamily = settings.description_font_family || "inherit";
  const descriptionColor = settings.description_color || "#FFFFFFCC";
  const breadcrumbColor = settings.breadcrumb_color || "#FFFFFFCC";
  const productCountColor = settings.product_count_color || "#FFFFFF99";
  const productCountFontSize = settings.product_count_font_size || "text-sm";
  const textAlign = settings.text_align || "text-center md:text-left";

  // Dynamic title based on search or category
  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category
    ? category
    : title || "All Products";

  // Build overlay style with opacity
  const overlayStyle: React.CSSProperties = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity / 100,
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

  // Determine text alignment classes
  const getTextAlignClass = () => {
    if (textAlign.includes("left")) return "text-center md:text-left";
    if (textAlign.includes("right")) return "text-center md:text-right";
    return "text-center";
  };

  const isLeftAligned = textAlign.includes("left");

  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={overlayStyle} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Breadcrumb at top */}
        {showBreadcrumb && (
          <div className="pt-4">
            <div className="container">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="w-4 h-4 mx-2"
                          style={{ color: breadcrumbColor, opacity: 0.6 }}
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
                          className="hover:opacity-100 transition-opacity"
                          style={{ ...breadcrumbStyle, opacity: 0.8 }}
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* Title Content - centered vertically in remaining space */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="container w-full">
            <div className={getTextAlignClass()}>
              <h1
                className={`text-3xl md:text-5xl lg:text-6xl ${titleFontWeight} mb-4`}
                style={titleStyle}
              >
                {displayTitle}
              </h1>
              <p
                className={`text-base md:text-lg max-w-2xl ${
                  isLeftAligned ? "" : "mx-auto"
                }`}
                style={descriptionStyle}
              >
                {description}
              </p>
              {showProductCount && productCount > 0 && (
                <p
                  className={`mt-4 ${productCountFontSize}`}
                  style={productCountStyle}
                >
                  {productCount} products found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
