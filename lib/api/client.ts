/**
 * Centralized API Client
 * Single fetch-based instance for all external API calls
 */

import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";

// API base URL from environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://easybill.zatiq.tech";

// Get default headers
function getDefaultHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
    Referer: "https://shop.zatiqeasy.com",
    "User-Agent":
      typeof window !== "undefined"
        ? window.navigator.userAgent
        : "NextJS Server",
  };
}

/**
 * Check if endpoint requires encryption
 */
function shouldEncrypt(url?: string): boolean {
  if (!url) return false;

  // Endpoints that require encryption
  const encryptedEndpoints = [
    "/api/v1/live/receipts",
    "/api/v1/live/pendingPayment",
    "/api/v1/live/inventories",
    "/api/v1/receipts/view/",
  ];

  return encryptedEndpoints.some((endpoint) => url.includes(endpoint));
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("zatiq_auth_token");
  }
  return null;
}

/**
 * Build full URL
 */
function buildUrl(endpoint: string, baseURL?: string): string {
  const base = baseURL || API_BASE_URL;
  // If endpoint is already a full URL, return it
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  // Remove leading slash from endpoint if present, and ensure base doesn't have trailing slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${cleanBase}/${cleanEndpoint}`;
}

/**
 * Handle API errors
 */
class ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Core fetch function with encryption/decryption
 */
async function fetchWithEncryption<T = unknown>(
  endpoint: string,
  options: RequestInit & {
    params?: Record<string, unknown>;
    requiresEncryption?: boolean;
    skipDecryption?: boolean;
    baseURL?: string;
  } = {}
): Promise<{ data: T }> {
  const {
    method = "GET",
    headers = {},
    body,
    params,
    requiresEncryption,
    skipDecryption = false,
    baseURL,
  } = options;

  // Build URL with query string
  let url = buildUrl(endpoint, baseURL);
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Determine if encryption is needed
  const shouldEnc = requiresEncryption ?? shouldEncrypt(endpoint);

  // Prepare body
  let processedBody: BodyInit | undefined;
  if (body) {
    if (shouldEnc) {
      const encryptedPayload = encryptData(body as unknown as Record<string, unknown>);
      processedBody = JSON.stringify({ payload: encryptedPayload });
    } else {
      processedBody = JSON.stringify(body);
    }
  }

  // Prepare headers
  const requestHeaders: HeadersInit = {
    ...getDefaultHeaders(),
    ...headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    (requestHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: processedBody,
    });

    // Parse response as JSON
    const responseData = await response.json().catch(() => ({}));

    // Handle decryption - ONLY if payload exists (error responses don't have payload)
    if (!skipDecryption && shouldEnc && responseData?.payload) {
      try {
        const decrypted = decryptData(responseData.payload);
        return { data: decrypted as T };
      } catch (error) {
        console.error("Failed to decrypt response:", error);
        // Return original data if decryption fails
      }
    }

    // Handle error responses
    if (!response.ok) {
      const error = new ApiError(
        response.statusText || "Request failed",
        response.status,
        response.statusText,
        responseData
      );

      // Handle specific error cases
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("zatiq_auth_token");
        }
      }

      if (response.status === 403) {
        if (process.env.NODE_ENV === "development") {
          console.error("Access forbidden:", responseData);
        }
      }

      if (response.status >= 500) {
        if (process.env.NODE_ENV === "development") {
          console.error("Server error:", responseData);
        }
      }

      throw error;
    }

    return { data: responseData as T };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network error
    if (error instanceof TypeError) {
      if (process.env.NODE_ENV === "development") {
        console.error("Network error:", error.message);
      }
      throw new ApiError("Network error", undefined, undefined, undefined);
    }

    throw error;
  }
}

/**
 * GET request
 */
async function get<T = unknown>(
  endpoint: string,
  options?: Omit<Parameters<typeof fetchWithEncryption>[1], "body" | "method">
): Promise<{ data: T }> {
  return fetchWithEncryption<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request
 */
async function post<T = unknown>(
  endpoint: string,
  data?: unknown,
  options?: Omit<Parameters<typeof fetchWithEncryption>[1], "method">
): Promise<{ data: T }> {
  return fetchWithEncryption<T>(endpoint, { ...options, method: "POST", body: data as BodyInit });
}

/**
 * PUT request
 */
async function put<T = unknown>(
  endpoint: string,
  data?: unknown,
  options?: Omit<Parameters<typeof fetchWithEncryption>[1], "method">
): Promise<{ data: T }> {
  return fetchWithEncryption<T>(endpoint, { ...options, method: "PUT", body: data as BodyInit });
}

/**
 * PATCH request
 */
async function patch<T = unknown>(
  endpoint: string,
  data?: unknown,
  options?: Omit<Parameters<typeof fetchWithEncryption>[1], "method">
): Promise<{ data: T }> {
  return fetchWithEncryption<T>(endpoint, { ...options, method: "PATCH", body: data as BodyInit });
}

/**
 * DELETE request
 */
async function del<T = unknown>(
  endpoint: string,
  options?: Omit<Parameters<typeof fetchWithEncryption>[1], "body" | "method">
): Promise<{ data: T }> {
  return fetchWithEncryption<T>(endpoint, { ...options, method: "DELETE" });
}

// API client object matching axios interface
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
  request: fetchWithEncryption,
};

// Export individual methods
export { get, post, put, patch, del as delete };

export default apiClient;
