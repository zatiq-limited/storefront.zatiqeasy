/**
 * Type-safe fetch client for API calls
 */

import { API_CONFIG } from './config';
import { APIError, TimeoutError, NetworkError } from './errors';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Generic fetch client with timeout, error handling, and type safety
 */
export async function fetchClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Shop-Id': API_CONFIG.shopId,
    ...(API_CONFIG.apiKey && { 'X-API-Key': API_CONFIG.apiKey }),
    ...(options.headers as Record<string, string>),
  };

  try {
    console.log(`[API] Calling: ${endpoint}`);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    const result: APIResponse<T> = await response.json();

    if (!result.success) {
      throw new APIError(
        result.message || 'API request failed',
        undefined,
        endpoint
      );
    }

    console.log(`[API] Success: ${endpoint}`);
    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof APIError) {
      // Only log in verbose mode
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_API === 'true') {
        console.error(`[API Error] ${error.endpoint}:`, error.message);
      }
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(endpoint);
    }

    // Network errors are expected when backend is not running - don't spam console
    throw new NetworkError(
      error instanceof Error ? error.message : 'Unknown error',
      endpoint
    );
  }
}

/**
 * Fetch client for server-side use only (with caching options)
 */
export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions & { cache?: RequestCache; revalidate?: number } = {}
): Promise<T> {
  const { cache = 'force-cache', revalidate, ...fetchOptions } = options;

  const nextOptions: { cache?: RequestCache; next?: { revalidate: number } } = {};

  if (revalidate !== undefined) {
    nextOptions.next = { revalidate };
  } else {
    nextOptions.cache = cache;
  }

  return fetchClient<T>(endpoint, {
    ...fetchOptions,
    ...nextOptions,
  } as FetchOptions);
}
