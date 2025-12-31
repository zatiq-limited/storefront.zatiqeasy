import React from 'react';
import type { Product } from '@/stores/productsStore';

interface ProductBreadcrumb1Settings {
  showHome?: boolean;
  showCategory?: boolean;
  linkColor?: string;
  textColor?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface ProductBreadcrumb1Props {
  settings: ProductBreadcrumb1Settings;
  product: Product;
}

const ProductBreadcrumb1 = ({ settings, product }: ProductBreadcrumb1Props) => {
  const {
    showHome = true,
    showCategory = true,
    linkColor = '#6B7280',
    textColor = '#111827',
    viewMode = 'desktop',
  } = settings;
  // Helper to get container padding class based on viewMode
  const getContainerPaddingClass = () => {
    if (viewMode === 'mobile') return 'px-4';
    if (viewMode === 'tablet') return 'px-6';
    return 'px-4';
  };
  // Product data is now passed as prop

  return (
    <nav className="bg-gray-50 border-t">
      <div className={`container mx-auto ${getContainerPaddingClass()} py-3`}>
        <ol className="flex items-center space-x-2 text-sm">
          {showHome && (
            <>
              <li>
                <span className="hover:opacity-80 cursor-pointer" style={{ color: linkColor }}>
                  Home
                </span>
              </li>
              <li>
                <span style={{ color: linkColor }}>/</span>
              </li>
            </>
          )}
          <li>
            <span className="hover:opacity-80 cursor-pointer" style={{ color: linkColor }}>
              Products
            </span>
          </li>
          {showCategory && product.categories?.[0] && (
            <>
              <li>
                <span style={{ color: linkColor }}>/</span>
              </li>
              <li>
                <span className="hover:opacity-80 cursor-pointer" style={{ color: linkColor }}>
                  {product.categories[0].name}
                </span>
              </li>
            </>
          )}
          <li>
            <span style={{ color: linkColor }}>/</span>
          </li>
          <li className="font-medium truncate max-w-[200px]" style={{ color: textColor }}>
            {product.name}
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default ProductBreadcrumb1;
