/**
 * ========================================
 * COLLECTION BREADCRUMB 2
 * ========================================
 * Sticky navigation bar with hierarchical breadcrumb
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

interface CollectionBreadcrumb2Props {
  collection: Collection;
  settings?: {
    showHome?: boolean;
    showCollections?: boolean;
    showProductCount?: boolean;
    backgroundColor?: string;
    textColor?: string;
    activeColor?: string;
    badgeColor?: string;
    badgeTextColor?: string;
  };
}

const CollectionBreadcrumb2: React.FC<CollectionBreadcrumb2Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showHome = true,
    showCollections = true,
    showProductCount = true,
    backgroundColor = "rgba(255, 255, 255, 0.8)",
    textColor = "#4b5563",
    activeColor = "#111827",
    badgeColor = "#eef2ff",
    badgeTextColor = "#4338ca",
  } = settings;

  // Get breadcrumb path from collection
  const breadcrumbPath = collection.breadcrumb || [];

  // Chevron separator component
  const Separator = () => (
    <svg
      className="w-3 h-3 text-gray-400 shrink-0"
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
      className="sticky top-0 z-40 backdrop-blur-md border-b border-gray-200 shadow-sm"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Left: Breadcrumb Navigation */}
          <nav
            className="flex items-center gap-2 text-sm min-w-0 flex-1 flex-wrap"
            aria-label="Breadcrumb"
          >
            {/* Home */}
            {showHome && (
              <>
                <a
                  href="/"
                  className="inline-flex items-center gap-1 transition-colors hover:opacity-80 shrink-0"
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
                </a>
                <Separator />
              </>
            )}

            {/* Collections Link */}
            {showCollections && (
              <>
                <a
                  href="/collections"
                  className="transition-colors hover:opacity-80 shrink-0 hidden sm:inline"
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
                      className="font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
                      style={{ color: activeColor }}
                    >
                      {item.name}
                    </span>
                  ) : (
                    // Parent categories (clickable)
                    <>
                      <a
                        href={`/collections/${item.id}`}
                        className="transition-colors hover:opacity-80 truncate max-w-20 sm:max-w-[120px] md:max-w-none hidden sm:inline"
                        style={{ color: textColor }}
                      >
                        {item.name}
                      </a>
                      <span className="hidden sm:inline">
                        <Separator />
                      </span>
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {/* Product Count Badge */}
            {showProductCount && collection.product_count !== undefined && (
              <span
                className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ml-1"
                style={{ backgroundColor: badgeColor, color: badgeTextColor }}
              >
                {collection.product_count}
              </span>
            )}
          </nav>

          {/* Right: Back Button - Mobile */}
          {breadcrumbPath.length > 1 ? (
            <a
              href={`/collections/${
                breadcrumbPath[breadcrumbPath.length - 2].id
              }`}
              className="sm:hidden inline-flex items-center gap-1 text-xs font-medium shrink-0"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </a>
          ) : (
            <a
              href="/collections"
              className="sm:hidden inline-flex items-center gap-1 text-xs font-medium shrink-0"
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

export default CollectionBreadcrumb2;
