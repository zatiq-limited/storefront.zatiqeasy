import React from "react";

interface ProductsHero1Props {
  title?: string;
  description?: string;
  productCount?: number;
  settings?: {
    showBreadcrumb?: boolean;
    showProductCount?: boolean;
    backgroundGradient?: string;
  };
  breadcrumbs?: Array<{ label: string; href: string }>;
  searchQuery?: string;
  category?: string;
}

const ProductsHero1: React.FC<ProductsHero1Props> = ({
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
    backgroundGradient = "from-blue-50 to-purple-50",
  } = settings;

  // Dynamic title based on search or category
  const displayTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : category
    ? `${category} Products`
    : title || "All Products";

  return (
    <section className={`bg-gradient-to-r ${backgroundGradient}`}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <nav className="mb-4 pt-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 mx-2 text-gray-400"
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
                    <span className="text-gray-600 font-medium">{crumb.label}</span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {displayTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
          {showProductCount && productCount > 0 && (
            <p className="mt-4 text-sm text-gray-500">
              Showing {productCount} products
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsHero1;
