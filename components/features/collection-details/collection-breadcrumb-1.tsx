/**
 * Collection Breadcrumb 1
 * Minimal elevated breadcrumb with hierarchical path
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionBreadcrumb1Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionBreadcrumb1Settings {
  showHome?: boolean;
  showCollections?: boolean;
  showProductCount?: boolean;
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
}

export default function CollectionBreadcrumb1({
  settings = {},
  collection,
}: CollectionBreadcrumb1Props) {
  const s = convertSettingsKeys<CollectionBreadcrumb1Settings>(settings);

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: s.backgroundColor || "#ffffff",
        borderColor: `${s.textColor || "#e5e7eb"}20`,
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {s.showHome && (
            <>
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:opacity-70"
                  style={{ color: s.textColor || "#6b7280" }}
                >
                  Home
                </Link>
              </li>
              <li
                className="opacity-40"
                style={{ color: s.textColor || "#6b7280" }}
              >
                /
              </li>
            </>
          )}

          {s.showCollections && (
            <>
              <li>
                <Link
                  href="/collections"
                  className="transition-colors hover:opacity-70"
                  style={{ color: s.textColor || "#6b7280" }}
                >
                  Collections
                </Link>
              </li>
              <li
                className="opacity-40"
                style={{ color: s.textColor || "#6b7280" }}
              >
                /
              </li>
            </>
          )}

          <li
            className="font-medium truncate"
            style={{ color: s.activeColor || "#111827" }}
          >
            {collection.name}
            {s.showProductCount && (
              <span
                className="ml-2 text-xs font-normal px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${s.activeColor || "#111827"}10`,
                  color: s.activeColor || "#111827",
                }}
              >
                {collection.product_count} products
              </span>
            )}
          </li>
        </ol>
      </div>
    </nav>
  );
}