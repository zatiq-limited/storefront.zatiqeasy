import React from "react";

interface Product {
  name: string;
  product_code?: string;
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductBreadcrumb2Props {
  settings?: {
    showHome?: boolean;
    showCategory?: boolean;
  };
  product: Product;
}

const ProductBreadcrumb2: React.FC<ProductBreadcrumb2Props> = ({
  settings = {},
  product,
}) => {
  const { showHome = true, showCategory = true } = settings;

  return (
    <nav className="bg-white border-b border-t">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-2">
        <ol className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap">
          {showHome && (
            <li className="flex items-center">
              <a
                href="/"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </a>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          )}
          <li className="flex items-center">
            <a href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
              Products
            </a>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          {showCategory && product.category && (
            <li className="flex items-center">
              <a
                href={`/products?category=${product.category.slug}`}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {product.category.name}
              </a>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          )}
          <li className="text-blue-600 font-medium truncate max-w-[250px]">
            {product.name}
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default ProductBreadcrumb2;
