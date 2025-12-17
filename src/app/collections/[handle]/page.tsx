/**
 * ========================================
 * COLLECTION DETAIL PAGE
 * ========================================
 *
 * Single collection page with products
 */

import { notFound } from "next/navigation";
import { getCollectionWithProducts } from "@/api/server";
import CollectionDetailsPageRenderer from "@/components/CollectionDetailsPageRenderer";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { handle } = await params;
  const data = await getCollectionWithProducts(handle);

  if (!data) {
    notFound();
  }

  return (
    <CollectionDetailsPageRenderer
      sections={[]}
      collection={data.collection as any}
      products={data.products as any}
    />
  );
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const data = await getCollectionWithProducts(handle);

  return {
    title: `${data?.collection?.title || "Collection"} | Zatiq Store`,
    description: data?.collection?.description || "Collection details",
  };
}
