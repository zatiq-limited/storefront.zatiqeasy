/**
 * ========================================
 * COLLECTION BREADCRUMB 1
 * ========================================
 * Minimal elevated breadcrumb with hierarchical path
 * Shows: Home > Collections > Parent Category > Child Category > ...
 */

import React from "react";

interface BreadcrumbItem {
  id: number;
  name: string;
}

interface Collection {
  id: number;
  handle: string;
  title: string;
  category_id?: number;
  product_count?: number;
  breadcrumb?: BreadcrumbItem[];
}

interface CollectionBreadcrumb1Props {
  collection: Collection;
  settings?: {
    showHome?: boolean;
    showCollections?: boolean;
    showProductCount?: boolean;
    backgroundColor?: string;
    textColor?: string;
    activeColor?: string;
  };
}

const CollectionBreadcrumb1: React.FC<CollectionBreadcrumb1Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showHome = true,
    showCollections = true,
    showProductCount = true,
    backgroundColor = "#ffffff",
    textColor = "#6b7280",
    activeColor = "#111827",
  } = settings;

  // Get breadcrumb path from collection
  const breadcrumbPath = collection.breadcrumb || [];

  // Chevron separator component
  const Separator = () => (
    <svg
      className="w-3 h-3 text-gray-300 shrink-0"
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
  );

  return (
    <section
      className="py-3 border-b border-gray-100"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="flex items-center justify-between">
          {/* Breadcrumb Navigation */}
          <nav
            className="flex items-center gap-2 text-xs sm:text-sm flex-wrap"
            aria-label="Breadcrumb"
          >
            {/* Home */}
            {showHome && (
              <>
                <a
                  href="/"
                  className="group inline-flex items-center gap-1.5 transition-colors hover:opacity-80"
                  style={{ color: textColor }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="hidden sm:inline">Home</span>
                </a>
                <Separator />
              </>
            )}

            {/* Collections Link */}
            {showCollections && (
              <>
                <a
                  href="/collections"
                  className="transition-colors hover:opacity-80 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-current hover:after:w-full after:transition-all"
                  style={{ color: textColor }}
                >
                  Collections
                </a>
                <Separator />
              </>
            )}

            {/* Breadcrumb Path (all except the last item are clickable) */}
            {breadcrumbPath.map((item, index) => {
              const isLast = index === breadcrumbPath.length - 1;

              return (
                <React.Fragment key={item.id}>
                  {isLast ? (
                    // Current page (not clickable)
                    <span
                      className="font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
                      style={{ color: activeColor }}
                    >
                      {item.name}
                    </span>
                  ) : (
                    // Parent categories (clickable)
                    <>
                      <a
                        href={`/collections/${item.id}`}
                        className="transition-colors hover:opacity-80 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none"
                        style={{ color: textColor }}
                      >
                        {item.name}
                      </a>
                      <Separator />
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {/* Product Count Badge */}
            {showProductCount && collection.product_count !== undefined && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium ml-1">
                {collection.product_count}
              </span>
            )}
          </nav>

          {/* Back Button - Mobile */}
          {breadcrumbPath.length > 1 ? (
            <a
              href={`/collections/${
                breadcrumbPath[breadcrumbPath.length - 2].id
              }`}
              className="sm:hidden inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </a>
          ) : (
            <a
              href="/collections"
              className="sm:hidden inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionBreadcrumb1;
