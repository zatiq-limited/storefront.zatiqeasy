/**
 * Server-only page data API functions
 */
import 'server-only';

import { serverFetch } from '../shared';
import type {
  HomepageData,
  ProductsPageData,
  ProductDetailPageData,
  CollectionsPageData,
  CheckoutPageData,
  PageData,
  ProductFilters,
} from '../types';

/**
 * Get homepage data
 */
export async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const response = await serverFetch<HomepageData>(
      `/api/storefront/v1/page/home`,
      { revalidate: 60 } // Cache for 1 minute
    );
    console.log('[API] Homepage data loaded from API');
    return response;
  } catch {
    console.error('[API] Homepage API failed - trying local file');

    try {
      const localFile = await import('@/data/api-responses/homepage.json');
      console.log('[API] Homepage data loaded from local file');
      const imported = localFile.default || localFile;
      return (imported?.data || imported) as unknown as HomepageData;
    } catch (localError) {
      console.error('[API] Local homepage.json also failed:', localError);
      return null;
    }
  }
}

/**
 * Get products page data (sections + products)
 */
export async function getProductsPageData(
  params?: ProductFilters
): Promise<ProductsPageData | null> {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.category) queryParams.category = params.category;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;

    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString
      ? `/api/storefront/v1/page/products?${queryString}`
      : `/api/storefront/v1/page/products`;

    const response = await serverFetch<ProductsPageData>(endpoint, {
      cache: 'no-store', // Dynamic data
    });
    console.log('[API] Products page data loaded from API');
    return response;
  } catch {
    console.error('[API] Products page API failed - falling back to local file');
    try {
      const localProductsPage = await import(
        '@/data/api-responses/products-page.json'
      );
      console.log('[API] Products page data loaded from local file');
      const imported = localProductsPage.default || localProductsPage;
      const result = (imported?.data || imported) as unknown as ProductsPageData;
      console.log('[API] Products page sections:', result?.sections?.length || 0);
      return result;
    } catch (localError) {
      console.error('[API] Local products-page.json also failed:', localError);
      return null;
    }
  }
}

/**
 * Get single product page data
 */
export async function getSingleProductPageData(
  handle?: string
): Promise<ProductDetailPageData | null> {
  if (!handle) return null;

  try {
    const response = await serverFetch<ProductDetailPageData>(
      `/api/storefront/v1/page/single-product/${handle}`,
      { revalidate: 60 }
    );
    console.log('[API] Single product page data loaded from API');
    return response;
  } catch {
    console.error('[API] Single product page API failed - trying local file');

    try {
      const localFile = await import(
        `@/data/api-responses/single-product-${handle}.json`
      );
      console.log(`[API] Single product page loaded from local file`);
      const imported = localFile.default || localFile;
      return imported as unknown as ProductDetailPageData;
    } catch {
      console.error(`[API] Local file not found`);
      return null;
    }
  }
}

/**
 * Get collections page data
 */
export async function getCollectionsPageData(): Promise<CollectionsPageData | null> {
  try {
    const response = await serverFetch<CollectionsPageData>(
      `/api/storefront/v1/page/collections`,
      { revalidate: 300 }
    );
    console.log('[API] Collections page data loaded from API');
    return response;
  } catch {
    console.error('[API] Collections page API failed');
    return null;
  }
}

/**
 * Get checkout page data
 */
export async function getCheckoutPageData(): Promise<CheckoutPageData | null> {
  try {
    const response = await serverFetch<CheckoutPageData>(
      `/api/storefront/v1/page/checkout`,
      { cache: 'no-store' }
    );
    console.log('[API] Checkout page data loaded from API');
    return response;
  } catch {
    console.error('[API] Checkout page API failed');
    return null;
  }
}

/**
 * Get about page data
 */
export async function getAboutPageData(): Promise<PageData | null> {
  try {
    const response = await serverFetch<PageData>(
      `/api/storefront/v1/page/about-us`,
      { revalidate: 3600 }
    );
    console.log('[API] About page data loaded from API');
    return response;
  } catch {
    console.error('[API] About page API failed');
    return null;
  }
}

/**
 * Get contact page data
 */
export async function getContactPageData(): Promise<PageData | null> {
  try {
    const response = await serverFetch<PageData>(
      `/api/storefront/v1/page/contact-us`,
      { revalidate: 3600 }
    );
    console.log('[API] Contact page data loaded from API');
    return response;
  } catch {
    console.error('[API] Contact page API failed');
    return null;
  }
}

/**
 * Get order success page data
 */
export async function getOrderSuccessPageData(): Promise<PageData | null> {
  try {
    const response = await serverFetch<PageData>(
      `/api/storefront/v1/page/order-success`,
      { cache: 'no-store' }
    );
    console.log('[API] Order success page data loaded from API');
    return response;
  } catch {
    console.error('[API] Order success page API failed');
    return null;
  }
}

/**
 * Get privacy policy page data
 */
export async function getPrivacyPolicyPageData(): Promise<PageData | null> {
  try {
    const response = await serverFetch<PageData>(
      `/api/storefront/v1/page/privacy-policy`,
      { revalidate: 3600 }
    );
    console.log('[API] Privacy policy page data loaded from API');
    return response;
  } catch {
    console.error('[API] Privacy policy page API failed');
    return null;
  }
}

/**
 * Get generic page data
 */
export async function getPageData(
  pageType: 'index' | 'product' | 'collection' | 'cart'
): Promise<PageData | null> {
  try {
    const data = await serverFetch<PageData>(
      `/api/storefront/v1/page/${pageType}`,
      { revalidate: 300 }
    );
    console.log(`[API] Page data loaded for ${pageType}`);
    return data;
  } catch {
    console.error(`[API] Page API failed for ${pageType}`);
    return null;
  }
}
