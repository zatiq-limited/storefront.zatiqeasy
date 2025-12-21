/**
 * Collection Subcategories 2
 * Card layout with overlay text
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";

interface CollectionSubcategories2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface SettingsType {
  showTitle?: boolean;
  title?: string;
  showProductCount?: boolean;
}

export default function CollectionSubcategories2({
  settings = {},
  collection,
}: CollectionSubcategories2Props) {
  const s = convertSettingsKeys<SettingsType>(settings);

  const subcategories = collection.children || [];

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <section style={{ backgroundColor: "#f9fafb" }}>
      <div className="container mx-auto px-4 py-12">
        {s.showTitle && s.title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "#181D25" }}>
            {s.title}
          </h2>
        )}

        <div className="grid gap-6 grid-cols-4 md:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/collections/${subcategory.slug}`}
              className="group relative h-48 rounded-xl overflow-hidden transition-all hover:scale-105"
            >
              {subcategory.image_url && (
                <Image
                  src={subcategory.image_url}
                  alt={subcategory.name}
                  fill
                  className="object-cover"
                />
              )}
              <div
                className="absolute inset-0 flex flex-col justify-end p-6"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                }}
              >
                <h3 className="text-lg font-semibold mb-1 text-white">
                  {subcategory.name}
                </h3>
                {s.showProductCount && (
                  <p className="text-sm text-white">
                    {subcategory.product_count} products
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}