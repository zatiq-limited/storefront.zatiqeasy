import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Types
interface ShopDetails {
  id?: string;
  shop_name: string;
  shop_description?: string;
  image_url?: string;
  baseUrl?: string;
  currency_code?: string;
  shop_email?: string;
  shop_phone?: string;
  message_on_top?: string;
  social_links?: Record<string, string>;
  shop_theme?: {
    theme?: string;
    enable_buy_now_on_product_card?: boolean;
    singleProductTheme?: boolean;
  };
  metadata?: {
    settings?: {
      shop_settings?: {
        enable_product_image_download?: boolean;
      };
    };
  };
}

interface ShopState {
  // Shop data
  shopDetails: ShopDetails | null;

  // Actions
  initializeShop: (shopData: Partial<ShopDetails>) => Promise<void>;
  updateShop: (updates: Partial<ShopDetails>) => void;
  clearShop: () => void;

  // Getters
  getShopDetails: () => ShopDetails | null;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // Initial state
      shopDetails: null,

      // Initialize shop with data
      initializeShop: async (shopData: Partial<ShopDetails>) => {
        // Merge with existing shop data
        const mergedShop = {
          ...get().shopDetails,
          ...shopData,
          shop_name: shopData.shop_name || get().shopDetails?.shop_name || '',
          baseUrl: shopData.baseUrl || `/merchant/${shopData.id}`
        } as ShopDetails;

        set({ shopDetails: mergedShop });

        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('shopDetails', JSON.stringify(mergedShop));
        }
      },

      // Update shop details
      updateShop: (updates: Partial<ShopDetails>) => {
        const currentShop = get().shopDetails;
        if (currentShop) {
          const updatedShop = { ...currentShop, ...updates };
          set({ shopDetails: updatedShop });

          // Update in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('shopDetails', JSON.stringify(updatedShop));
          }
        }
      },

      // Clear shop data
      clearShop: () => {
        set({ shopDetails: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('shopDetails');
        }
      },

      // Get shop details
      getShopDetails: () => {
        return get().shopDetails;
      }
    }),
    {
      name: 'shop-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(name);
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, value);
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        }
      })),
      partialize: (state) => ({
        shopDetails: state.shopDetails
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state && state.shopDetails) {
          console.log('Shop store rehydrated');
        }
      }
    }
  )
);

// Selectors for optimized subscriptions
export const selectShopDetails = (state: ShopState) => state.shopDetails;
export const selectShopName = (state: ShopState) => state.shopDetails?.shop_name;
export const selectShopCurrency = (state: ShopState) => state.shopDetails?.currency_code;

// Initialize shop from localStorage on app start
if (typeof window !== 'undefined') {
  const storedShop = localStorage.getItem('shopDetails');
  if (storedShop) {
    try {
      const shopData = JSON.parse(storedShop);
      useShopStore.setState({ shopDetails: shopData });
    } catch (error) {
      console.error('Failed to parse stored shop data:', error);
      localStorage.removeItem('shopDetails');
    }
  }
}