/**
 * Client-side API functions - Central export
 *
 * These functions can be safely used in Client Components
 */

// Cart API
export {
  getCartToken,
  setCartToken,
  clearCartToken,
  getCart,
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cart';

// Search API
export { searchProducts, getSearchSuggestions } from './search';
