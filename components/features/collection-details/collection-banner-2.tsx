/**
 * Collection Banner 2
 * Editorial asymmetric layout with overlapping elements
 */

"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Collection } from "@/hooks/useCollectionDetails";
import Image from "next/image";

interface CollectionBanner2Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

export default function CollectionBanner2({
  settings = {},
  collection,
}: CollectionBanner2Props) {
  const s = convertSettingsKeys(settings);

  return (
    <section className="relative overflow-hidden py-16" style={{ backgroundColor: "#f9fafb" }}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="p-8 rounded-2xl shadow-xl bg-white">
              <div className="inline-flex items-center px-4 py-2 rounded-lg font-semibold mb-6 bg-green-50 text-green-600">
                {collection.product_count} Products Available
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-lg mb-8 leading-relaxed text-gray-600">
                  {collection.description}
                </p>
              )}
              <a
                href="#products"
                className="inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all hover:scale-105 bg-gray-900 text-white"
              >
                Explore Collection
              </a>
            </div>
          </div>

          {/* Image */}
          {collection.image_url && (
            <div>
              <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src={collection.image_url}
                  alt={collection.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}