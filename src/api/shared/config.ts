/**
 * API Configuration
 */

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  shopId: process.env.NEXT_PUBLIC_SHOP_ID || 'shop_demo_12345',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  timeout: 10000, // 10 seconds default timeout
} as const;

/**
 * Debug function to log current API configuration
 */
export function logAPIConfig(): void {
  console.log('=== API Configuration ===');
  console.log('Base URL:', API_CONFIG.baseUrl);
  console.log('Shop ID:', API_CONFIG.shopId);
  console.log('Has API Key:', !!API_CONFIG.apiKey);
  console.log('Using Mock Data:', API_CONFIG.useMockData);
  console.log('========================');
}
