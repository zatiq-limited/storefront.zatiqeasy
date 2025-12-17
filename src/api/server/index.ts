/**
 * Server-only API functions - Central export
 *
 * These functions should only be used in Server Components
 * They use 'server-only' directive to ensure they're not bundled for client
 */

// Theme API
export { getShopConfig, getTheme } from './theme';

// Page API
export {
  getHomepageData,
  getProductsPageData,
  getSingleProductPageData,
  getCollectionsPageData,
  getCheckoutPageData,
  getAboutPageData,
  getContactPageData,
  getOrderSuccessPageData,
  getPrivacyPolicyPageData,
  getPageData,
} from './pages';

// Products API
export {
  getProducts,
  getProduct,
  getFeaturedProducts,
  searchProducts,
} from './products';

// Collections API
export {
  getCollections,
  getCollection,
  getCollectionWithProducts,
} from './collections';
