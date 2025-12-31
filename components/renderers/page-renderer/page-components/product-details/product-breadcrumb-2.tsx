import React from 'react';
import type { Product } from '@/stores/productsStore';

interface ProductBreadcrumb2Settings {
  showHome?: boolean;
  showCategory?: boolean;
  linkColor?: string;
  activeColor?: string;
  iconColor?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

interface ProductBreadcrumb2Props {
  settings: ProductBreadcrumb2Settings;
  product: Product;
}

const ProductBreadcrumb2 = ({ settings, product }: ProductBreadcrumb2Props) => {
  const {
    showHome = true,
    showCategory = true,
    linkColor = '#6B7280',
    activeColor = '#2563EB',
    iconColor = '#9CA3AF',
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
    <nav className="bg-white border-b border-t">
      <div className={`container mx-auto ${getContainerPaddingClass()} py-2`}>
        <ol className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap">
          {showHome && (
            <li className="flex items-center">
              <span
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-colors"
                style={{ color: linkColor }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </span>
              <svg
                className="w-4 h-4 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: iconColor }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          )}
          <li className="flex items-center">
            <span className="cursor-pointer hover:opacity-80 transition-colors" style={{ color: linkColor }}>
              Products
            </span>
            <svg
              className="w-4 h-4 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: iconColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          {showCategory && product.categories?.[0] && (
            <li className="flex items-center">
              <span className="cursor-pointer hover:opacity-80 transition-colors" style={{ color: linkColor }}>
                {product.categories[0].name}
              </span>
              <svg
                className="w-4 h-4 mx-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: iconColor }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          )}
          <li className="font-medium truncate max-w-[250px]" style={{ color: activeColor }}>
            {product.name}
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default ProductBreadcrumb2;
