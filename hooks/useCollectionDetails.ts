import { useQuery } from "@tanstack/react-query";
import type { Section } from "@/lib/types";

// Collection type from collections.json
export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  banner_url?: string;
  product_count: number;
  children?: Collection[];
}

// Collection details page config response
interface CollectionDetailsPageConfig {
  seo: {
    title: string;
    description: string;
  };
  sections: Section[];
}

// Fetch collection by slug
async function fetchCollectionBySlug(slug: string): Promise<Collection> {
  const response = await fetch(`/api/storefront/v1/collections/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch collection");
  }
  return response.json();
}

// Fetch collection details page configuration
async function fetchCollectionDetailsPageConfig(): Promise<CollectionDetailsPageConfig> {
  const response = await fetch("/api/storefront/v1/page/collection-details");
  if (!response.ok) {
    throw new Error("Failed to fetch collection details page config");
  }
  return response.json();
}

export function useCollectionDetails(slug: string) {
  // Collection query
  const collectionQuery = useQuery({
    queryKey: ["collection", slug],
    queryFn: () => fetchCollectionBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Collection details page config query
  const pageConfigQuery = useQuery({
    queryKey: ["collection-details-page-config"],
    queryFn: fetchCollectionDetailsPageConfig,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return {
    collection: collectionQuery.data,
    sections: pageConfigQuery.data?.sections || [],
    seo: pageConfigQuery.data?.seo,
    isLoading: collectionQuery.isLoading || pageConfigQuery.isLoading,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error: collectionQuery.error || pageConfigQuery.error,
  };
}