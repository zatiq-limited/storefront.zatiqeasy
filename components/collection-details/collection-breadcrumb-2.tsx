/**
 * Collection Breadcrumb 2
 * Sticky navigation bar with hierarchical breadcrumb
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionBreadcrumb2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

export default function CollectionBreadcrumb2({
  settings = {},
  collection,
}: CollectionBreadcrumb2Props) {
  const s = convertSettingsKeys(settings);

  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-lg border-b"
      style={{
        backgroundColor: s.backgroundColor || "rgba(255, 255, 255, 0.8)",
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:opacity-70">
                Home
              </Link>
            </li>
            <li className="opacity-40 text-gray-600">/</li>
            <li>
              <Link href="/collections" className="text-gray-600 hover:opacity-70">
                Collections
              </Link>
            </li>
            <li className="opacity-40 text-gray-600">/</li>
            <li className="font-medium text-gray-900">{collection.name}</li>
          </ol>
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
            {collection.product_count} Products
          </div>
        </div>
      </div>
    </nav>
  );
}