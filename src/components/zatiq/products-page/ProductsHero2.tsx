import React from "react";

/**
 * Settings interface matching snake_case format from products-page.json
 */
interface ProductsHero2Settings {
  // Content
  title?: string;
  description?: string;
  // Visibility
  show_breadcrumb?: boolean;
  show_product_count?: boolean;
  // Background
  background_image?: string;
  overlay_color?: string;
  overlay_opacity?: number;
  hero_height?: string;
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
  // Layout
  text_align?: string;
}

interface ProductsHero2Props {
  settings?: ProductsHero2Settings;
  productCount?: number;
  breadcrumbs?: Array<{ label: string; href: string }>;
  searchQuery?: string;
  category?: string;
}

const ProductsHero2: React.FC<ProductsHero2Props> = ({
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
    background_image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    overlay_color = "#000000",
    overlay_opacity = 50,
    hero_height = "h-[300px] md:h-[400px]",
    title_font_family = "inherit",
    title_font_size = "text-4xl md:text-6xl",
    title_font_weight = "font-bold",
    title_color = "#FFFFFF",
    description_font_family = "inherit",
    description_font_size = "text-lg",
    description_color = "#FFFFFFCC",
    breadcrumb_color = "#FFFFFFCC",
    product_count_color = "#FFFFFF99",
    product_count_font_size = "text-sm",
    text_align = "text-center md:text-left",
  } = settings;

  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category
    ? `${category}`
    : title || "All Products";

  // Build overlay style with opacity
  const overlayStyle: React.CSSProperties = {
    backgroundColor: overlay_color,
    opacity: overlay_opacity / 100,
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
    <section className={`relative ${hero_height} overflow-hidden`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background_image})` }}
      />
      <div className="absolute inset-0" style={overlayStyle} />
      <div className="relative z-10 h-full flex flex-col">
        {/* Breadcrumb at top */}
        {show_breadcrumb && (
          <div className="pt-2">
            <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg
                          className="w-4 h-4 mx-2"
                          style={{ color: breadcrumb_color, opacity: 0.6 }}
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
                          className="hover:opacity-100 transition-opacity"
                          style={{ ...breadcrumbStyle, opacity: 0.8 }}
                        >
                          {crumb.label}
                        </a>
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
          <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 w-full">
            <div className={text_align}>
              <h1
                className={`${title_font_size} ${title_font_weight} mb-4`}
                style={titleStyle}
              >
                {displayTitle}
              </h1>
              <p
                className={`${description_font_size} max-w-2xl`}
                style={descriptionStyle}
              >
                {description}
              </p>
              {show_product_count && productCount > 0 && (
                <p
                  className={`mt-4 ${product_count_font_size}`}
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
};

export default ProductsHero2;
