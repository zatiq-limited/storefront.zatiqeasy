/**
 * ========================================
 * COLLECTION DETAIL PAGE
 * ========================================
 *
 * Dynamic collection page showing collection details, subcategories, and products
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import collectionsData from "@/data/api-responses/collections.json";
import collectionDetailsPageData from "@/data/api-responses/collection-details-page.json";
import CollectionDetailsPageRenderer from "@/components/renderers/page-renderer/collection-details-page-renderer";
import type { Collection } from "@/hooks/useCollections";

// Find collection by slug (including nested search)
const findCollectionBySlug = (
  collections: Collection[],
  slug: string
): Collection | null => {
  for (const collection of collections) {
    if (collection.slug === slug) {
      return collection;
    }
    // Search in children recursively
    if (collection.children) {
      const found = findCollectionBySlug(collection.children, slug);
      if (found) return found;
    }
  }
  return null;
};

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = findCollectionBySlug(collectionsData.data.collections, slug);

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  return {
    title: `${collection.name} | Zatiq Easy Store`,
    description: collection.description || `Browse ${collection.name} collection`,
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: collection.image_url ? [collection.image_url] : [],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = findCollectionBySlug(collectionsData.data.collections, slug);

  if (!collection) {
    notFound();
  }

  const sections = collectionDetailsPageData.sections;

  return (
    <main className="zatiq-collection-details-page min-h-screen">
      <CollectionDetailsPageRenderer
        sections={sections}
        collection={collection}
        isLoading={false}
      />
    </main>
  );
}