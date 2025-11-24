import React from "react";

interface ProductsHeader2Props {
  title?: string;
  description?: string;
  productCount?: number;
  settings?: {
    showBreadcrumb?: boolean;
    showProductCount?: boolean;
    backgroundImage?: string;
    overlayOpacity?: string;
  };
  breadcrumbs?: Array<{ label: string; href: string }>;
  searchQuery?: string;
  category?: string;
}

const ProductsHeader2: React.FC<ProductsHeader2Props> = ({
  title,
  description = "Discover our curated collection of premium products",
  productCount = 0,
  settings = {},
  breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ],
  searchQuery,
  category,
}) => {
  const {
    showBreadcrumb = true,
    showProductCount = true,
    backgroundImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    overlayOpacity = "bg-black/50",
  } = settings;

  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category
    ? `${category}`
    : title || "All Products";

  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {showBreadcrumb && (
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 mx-2 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-white font-medium">{crumb.label}</span>
                    ) : (
                      <a href={crumb.href} className="text-white/80 hover:text-white transition-colors">{crumb.label}</a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{displayTitle}</h1>
            <p className="text-lg text-white/80 max-w-2xl">{description}</p>
            {showProductCount && productCount > 0 && (
              <p className="mt-4 text-sm text-white/60">{productCount} products found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsHeader2;
