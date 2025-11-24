import React from "react";

interface Product {
  name: string;
  product_code?: string;
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductBreadcrumb1Props {
  settings?: {
    showHome?: boolean;
    showCategory?: boolean;
  };
  product: Product;
}

const ProductBreadcrumb1: React.FC<ProductBreadcrumb1Props> = ({
  settings = {},
  product,
}) => {
  const { showHome = true, showCategory = true } = settings;

  return (
    <nav className="bg-gray-50 border-t">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {showHome && (
            <>
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
            </>
          )}
          <li>
            <a href="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </a>
          </li>
          {showCategory && product.category && (
            <>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <a
                  href={`/products?category=${product.category.slug}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {product.category.name}
                </a>
              </li>
            </>
          )}
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default ProductBreadcrumb1;
