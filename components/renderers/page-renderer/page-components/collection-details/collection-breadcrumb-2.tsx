/**
 * Collection Breadcrumb 2
 * Premium sticky navigation with path indicators and actions
 * Enhanced design matching Astro version
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";

interface CollectionBreadcrumb2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionBreadcrumb2Settings {
  showHome?: boolean;
  showCollections?: boolean;
  showProductCount?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showSort?: boolean;
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  accentColor?: string;
  shadowSize?: string;
  borderRadius?: string;
}

export default function CollectionBreadcrumb2({
  settings = {},
  collection,
}: CollectionBreadcrumb2Props) {
  const s = convertSettingsKeys<CollectionBreadcrumb2Settings>(settings);

  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300"
      style={{
        backgroundColor: s.backgroundColor
          ? `${s.backgroundColor}F8`
          : "#ffffffF8",
        borderColor: `${s.textColor || "#e5e7eb"}20`,
        boxShadow: s.shadowSize === "none"
          ? "none"
          : s.shadowSize === "sm"
          ? "0 1px 3px rgba(0,0,0,0.05)"
          : s.shadowSize === "lg"
          ? "0 8px 32px rgba(0,0,0,0.1)"
          : "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: `${s.textColor || "#e5e7eb"}10` }}>
          <ol className="flex items-center space-x-1 sm:space-x-3">
            {s.showHome && (
              <>
                <li>
                  <Link
                    href="/"
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{ color: s.textColor || "#6b7280" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = s.activeColor || "#111827";
                      e.currentTarget.style.backgroundColor = `${s.activeColor || "#111827"}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = s.textColor || "#6b7280";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg
                      className="w-4 h-4 transform transition-transform group-hover:scale-110"
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
                    <span className="font-medium hidden sm:inline">Home</span>
                  </Link>
                </li>
                <li
                  className="text-xs"
                  style={{ color: `${s.textColor || "#9ca3af"}60` }}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
              </>
            )}

            {s.showCollections && (
              <>
                <li>
                  <Link
                    href="/collections"
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{ color: s.textColor || "#6b7280" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = s.activeColor || "#111827";
                      e.currentTarget.style.backgroundColor = `${s.activeColor || "#111827"}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = s.textColor || "#6b7280";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg
                      className="w-4 h-4 transform transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="font-medium hidden sm:inline">Collections</span>
                  </Link>
                </li>
                <li
                  className="text-xs"
                  style={{ color: `${s.textColor || "#9ca3af"}60` }}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
              </>
            )}

            <li>
              <div
                className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                style={{
                  color: s.activeColor || "#111827",
                  backgroundColor: `${s.activeColor || "#111827"}06`,
                  border: `1px solid ${s.activeColor || "#111827"}15`,
                }}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="font-semibold truncate max-w-[150px] sm:max-w-xs">
                  {collection.name}
                </span>
              </div>
            </li>
          </ol>

          {/* Product Count Badge */}
          {s.showProductCount && collection.product_count && (
            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${s.accentColor || "#3b82f6"}10`,
                color: s.accentColor || "#3b82f6",
                border: `1px solid ${s.accentColor || "#3b82f6"}20`,
              }}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>{collection.product_count} Products</span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            {/* Search */}
            {s.showSearch && (
              <button
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  color: s.textColor || "#6b7280",
                  backgroundColor: `${s.textColor || "#6b7280"}08`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = s.activeColor || "#111827";
                  e.currentTarget.style.backgroundColor = `${s.activeColor || "#111827"}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = s.textColor || "#6b7280";
                  e.currentTarget.style.backgroundColor = `${s.textColor || "#6b7280"}08`;
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}

            {/* Filter */}
            {s.showFilter && (
              <button
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  color: s.textColor || "#6b7280",
                  backgroundColor: `${s.textColor || "#6b7280"}08`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = s.activeColor || "#111827";
                  e.currentTarget.style.backgroundColor = `${s.activeColor || "#111827"}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = s.textColor || "#6b7280";
                  e.currentTarget.style.backgroundColor = `${s.textColor || "#6b7280"}08`;
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
            )}

            {/* Sort */}
            {s.showSort && (
              <button
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  color: s.textColor || "#6b7280",
                  backgroundColor: `${s.textColor || "#6b7280"}08`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = s.activeColor || "#111827";
                  e.currentTarget.style.backgroundColor = `${s.activeColor || "#111827"}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = s.textColor || "#6b7280";
                  e.currentTarget.style.backgroundColor = `${s.textColor || "#6b7280"}08`;
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="hidden sm:flex items-center space-x-4 text-xs" style={{ color: s.textColor || "#6b7280" }}>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.accentColor || "#3b82f6" }}></div>
              <span>In Stock</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.accentColor || "#3b82f6" }}></div>
              <span>New Arrivals</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.accentColor || "#3b82f6" }}></div>
              <span>On Sale</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}