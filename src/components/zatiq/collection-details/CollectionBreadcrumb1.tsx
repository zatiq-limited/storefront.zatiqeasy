/**
 * ========================================
 * COLLECTION BREADCRUMB 1
 * ========================================
 * Minimal elevated breadcrumb with integrated metadata
 * Clean, modern, and unobtrusive
 */

import React from "react";

interface Collection {
  id: number;
  handle: string;
  title: string;
  category_id?: number;
  product_count?: number;
}

interface CollectionBreadcrumb1Props {
  collection: Collection;
  settings?: {
    showHome?: boolean;
    showCategory?: boolean;
    showProductCount?: boolean;
    backgroundColor?: string;
  };
}

const CollectionBreadcrumb1: React.FC<CollectionBreadcrumb1Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showHome = true,
    showCategory = true,
    showProductCount = true,
    backgroundColor = "#ffffff",
  } = settings;

  return (
    <section className="py-3 border-b border-gray-100" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            {showHome && (
              <>
                <a
                  href="/"
                  className="group inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="hidden sm:inline">Home</span>
                </a>
                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}

            {showCategory && (
              <>
                <a
                  href="/collections"
                  className="text-gray-500 hover:text-gray-900 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gray-900 hover:after:w-full after:transition-all"
                >
                  Collections
                </a>
                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}

            <span className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-none">
              {collection.title}
            </span>

            {/* Product Count Badge */}
            {showProductCount && collection.product_count !== undefined && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                {collection.product_count}
              </span>
            )}
          </nav>

          {/* Back Button - Mobile */}
          <a
            href="/collections"
            className="sm:hidden inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </a>
        </div>
      </div>
    </section>
  );
};

export default CollectionBreadcrumb1;
