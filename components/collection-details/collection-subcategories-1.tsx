/**
 * Collection Subcategories 1
 * Horizontal scrollable grid with circle images
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionSubcategories1Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionSubcategories1Settings {
  title?: string;
  showTitle?: boolean;
  columns?: string;
  columnsMobile?: string;
  columnsTablet?: string;
  showProductCount?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  hoverColor?: string;
}

export default function CollectionSubcategories1({
  settings = {},
  collection,
}: CollectionSubcategories1Props) {
  const s = convertSettingsKeys<CollectionSubcategories1Settings>(settings);

  const subcategories = collection.children || [];

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <section style={{ backgroundColor: s.backgroundColor || "#ffffff" }}>
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        {s.showTitle && s.title && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: s.titleColor || "#181D25" }}
          >
            {s.title}
          </h2>
        )}

        {/* Subcategories Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="grid gap-6 grid-cols-6 md:grid-cols-4 sm:grid-cols-3 min-w-max">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/collections/${subcategory.slug}`}
                className="group flex flex-col items-center text-center transition-all hover:scale-105"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 rounded-full overflow-hidden bg-gray-100">
                  {subcategory.image_url && (
                    <Image
                      src={subcategory.image_url}
                      alt={subcategory.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  )}
                </div>
                <h3
                  className="text-sm font-medium mb-1 transition-colors"
                  style={{
                    color: s.textColor || "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = s.hoverColor || "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = s.textColor || "#374151";
                  }}
                >
                  {subcategory.name}
                </h3>
                {s.showProductCount && (
                  <p
                    className="text-xs opacity-60"
                    style={{ color: s.textColor || "#374151" }}
                  >
                    {subcategory.product_count} products
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}