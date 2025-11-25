/**
 * ========================================
 * COLLECTION BREADCRUMB 2
 * ========================================
 * Navigation Command Center - Multi-function bar
 * Breadcrumb + Quick Actions + View Controls + Share
 */

import React, { useState } from "react";

interface Collection {
  id: number;
  handle: string;
  title: string;
  category_id?: number;
  product_count?: number;
}

interface CollectionBreadcrumb2Props {
  collection: Collection;
  settings?: {
    showHome?: boolean;
    showCategory?: boolean;
    showProductCount?: boolean;
    backgroundColor?: string;
  };
}

const CollectionBreadcrumb2: React.FC<CollectionBreadcrumb2Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showHome = true,
    showCategory = true,
    showProductCount = true,
    backgroundColor = "#fafafa",
  } = settings;

  return (
    <section className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="flex items-center justify-between py-3 gap-4">

          {/* Left: Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm min-w-0 flex-1" aria-label="Breadcrumb">
            {showHome && (
              <>
                <a
                  href="/"
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </a>
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}

            {showCategory && (
              <>
                <a
                  href="/collections"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 hidden sm:inline"
                >
                  Collections
                </a>
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}

            <span className="font-semibold text-gray-900 truncate">
              {collection.title}
            </span>

            {showProductCount && collection.product_count !== undefined && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex-shrink-0">
                {collection.product_count}
              </span>
            )}
          </nav>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionBreadcrumb2;
