import React from "react";

interface ProductsEmpty1Props {
  settings?: {
    title?: string;
    description?: string;
    showCategorySuggestions?: boolean;
    buttonText?: string;
    buttonLink?: string;
  };
  categories?: Array<{ id: string; name: string; href: string }>;
}

const ProductsEmpty1: React.FC<ProductsEmpty1Props> = ({
  settings = {},
  categories = [
    { id: "1", name: "Men's Fashion", href: "/products?category=mens-fashion" },
    { id: "2", name: "Women's Fashion", href: "/products?category=womens-fashion" },
    { id: "3", name: "Accessories", href: "/products?category=accessories" },
    { id: "4", name: "New Arrivals", href: "/products?category=new-arrivals" },
  ],
}) => {
  const {
    title = "No products found",
    description = "Try adjusting your search or filter criteria",
    showCategorySuggestions = true,
    buttonText = "View All Products",
    buttonLink = "/products",
  } = settings;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>

          {/* Title & Description */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">{description}</p>

          {/* CTA Button */}
          <a
            href={buttonLink}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            {buttonText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Category Suggestions */}
        {showCategorySuggestions && categories.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Shop by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={category.href}
                  className="p-6 border border-gray-200 rounded-xl text-center hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h4>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsEmpty1;
