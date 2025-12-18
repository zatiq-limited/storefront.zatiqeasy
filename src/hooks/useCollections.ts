import { useQuery } from "@tanstack/react-query";

// Types
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

interface CollectionsResponse {
  success: boolean;
  data: {
    collections: Collection[];
  };
}

interface CollectionsPageConfigResponse {
  success: boolean;
  data: {
    template: string;
    sections: Array<{
      id: string;
      type: string;
      enabled: boolean;
      settings: Record<string, unknown>;
    }>;
    seo: Record<string, unknown>;
  };
}

// Fetch collections list
async function fetchCollections(): Promise<CollectionsResponse> {
  const res = await fetch("/api/storefront/v1/collections");
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

// Fetch collections page configuration
async function fetchCollectionsPageConfig(): Promise<CollectionsPageConfigResponse> {
  const res = await fetch("/api/storefront/v1/page/collections");
  if (!res.ok) throw new Error("Failed to fetch collections page config");
  return res.json();
}

export function useCollections() {
  // Collections query
  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Collections page config query - fetched once and cached longer
  const pageConfigQuery = useQuery({
    queryKey: ["collections-page-config"],
    queryFn: fetchCollectionsPageConfig,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return {
    // Queries
    collectionsQuery,
    pageConfigQuery,

    // Data (from query for reactivity)
    collections: collectionsQuery.data?.data?.collections || [],
    sections: pageConfigQuery.data?.data?.sections || [],
    seo: pageConfigQuery.data?.data?.seo || {},

    // State
    isLoading: collectionsQuery.isLoading || pageConfigQuery.isLoading,
    isCollectionsLoading: collectionsQuery.isLoading,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error: collectionsQuery.error || pageConfigQuery.error,

    // Actions
    refetch: () => {
      collectionsQuery.refetch();
      pageConfigQuery.refetch();
    },
  };
}
