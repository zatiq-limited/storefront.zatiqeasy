/**
 * Centralized API Client
 * Single axios instance for all external API calls
 */

import axios from "axios";
import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";

// API base URL from environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.zatiqeasy.com";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Device-Type": "Web",
    "Application-Type": "Online_Shop",
  },
});

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
  ];

  return encryptedEndpoints.some((endpoint) => url.includes(endpoint));
}

/**
 * Check if response requires decryption
 */
function shouldDecrypt(url?: string): boolean {
  // Same endpoints that encrypt also decrypt
  return shouldEncrypt(url);
}

/**
 * Request interceptor
 * - Adds encryption for specific endpoints
 * - Can add auth tokens if needed
 */
apiClient.interceptors.request.use(
  (config) => {
    // Encrypt request payload if needed
    if (config.data && shouldEncrypt(config.url)) {
      const encryptedPayload = encryptData(config.data);
      config.data = { payload: encryptedPayload };
    }

    // Add auth token if available (for future use)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("zatiq_auth_token")
        : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("Request interceptor error:", error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Decrypts responses from encrypted endpoints
 * - Handles common error cases
 */
apiClient.interceptors.response.use(
  (response) => {
    // Decrypt response if needed
    if (shouldDecrypt(response.config.url)) {
      try {
        response.data = decryptData(response.data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to decrypt response:", error);
        }
        // Return original data if decryption fails
      }
    }

    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("zatiq_auth_token");
        // Optionally redirect to login
        // window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      if (process.env.NODE_ENV === "development") {
        console.error("Access forbidden:", error.response.data);
      }
    }

    if (error.response?.status >= 500) {
      // Server error
      if (process.env.NODE_ENV === "development") {
        console.error("Server error:", error.response.data);
      }
    }

    // Network error (no response)
    if (!error.response) {
      if (process.env.NODE_ENV === "development") {
        console.error("Network error:", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
