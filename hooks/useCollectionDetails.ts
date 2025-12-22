"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Section } from "@/lib/types";

// Collection type from collections.json
export interface CollectionDetails {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
  banner_url?: string;
  product_count: number;
  children?: CollectionDetails[];
}

interface CollectionResponse {
  success: boolean;
  data: {
    collection: CollectionDetails;
  };
}

interface CollectionDetailsPageConfigResponse {
  sections: Array<{
    id: string;
    type: string;
    enabled: boolean;
    settings: Record<string, unknown>;
  }>;
}

// Fetch single collection by slug
async function fetchCollection(slug: string): Promise<CollectionResponse> {
  const res = await fetch(`/api/storefront/v1/collections/${slug}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Collection not found");
    }
    throw new Error("Failed to fetch collection");
  }
  return res.json();
}

// Fetch collection details page configuration
async function fetchCollectionDetailsPageConfig(): Promise<CollectionDetailsPageConfigResponse> {
  const res = await fetch("/api/storefront/v1/page/collection-details");
  if (!res.ok) throw new Error("Failed to fetch collection details page config");
  return res.json();
}

export function useCollectionDetails(slug: string) {
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Collection query
  const collectionQuery = useQuery({
    queryKey: ["collection", slug],
    queryFn: () => fetchCollection(slug),
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

  // Handle errors and not found
  useEffect(() => {
    if (collectionQuery.error) {
      const errorMessage = (collectionQuery.error as Error).message;
      if (errorMessage.includes("not found")) {
        setNotFound(true);
      } else {
        setError(errorMessage);
      }
    } else {
      setError(null);
      setNotFound(false);
    }
  }, [collectionQuery.error]);

  return {
    collection: collectionQuery.data?.data?.collection,
    sections: pageConfigQuery.data?.sections || [],
    isLoading: collectionQuery.isLoading,
    isPageConfigLoading: pageConfigQuery.isLoading,
    error,
    notFound,
  };
}