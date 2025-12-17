/**
 * Server-only collection API functions
 */
import 'server-only';

import { serverFetch } from '../shared';
import type { Collection, CollectionWithProducts, Product } from '../types';

/**
 * Get all collections
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    const collections = await serverFetch<Collection[]>(
      '/api/storefront/v1/collections',
      { revalidate: 300 }
    );
    console.log('[API] Collections loaded from API');
    return collections;
  } catch {
    console.error('[API] Collections API failed');
    return [];
  }
}

/**
 * Get single collection by handle
 */
export async function getCollection(handle: string): Promise<Collection | null> {
  try {
    const data = await serverFetch<CollectionWithProducts>(
      `/api/storefront/v1/collections/${handle}`,
      { revalidate: 300 }
    );
    console.log(`[API] Collection loaded: ${handle}`);
    return data.collection;
  } catch {
    console.error(`[API] Collection API failed: ${handle}`);
    return null;
  }
}

/**
 * Get collection with products
 */
export async function getCollectionWithProducts(
  handle: string
): Promise<{ collection: Collection; products: Product[] } | null> {
  try {
    const data = await serverFetch<CollectionWithProducts>(
      `/api/storefront/v1/collections/${handle}`,
      { revalidate: 300 }
    );
    console.log(`[API] Collection with products loaded: ${handle}`);
    return data;
  } catch {
    console.error(`[API] Collection API failed: ${handle}`);
    return null;
  }
}
