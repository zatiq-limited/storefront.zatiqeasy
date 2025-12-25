import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type {
  SingleProductPage,
  LandingPageState,
  LandingPageActions,
} from '@/types/landing-page.types';

// Checkout form data that persists across sessions
interface CheckoutFormData {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  division?: string;
  district?: string;
  upazila?: string;
  address?: string;
  note?: string;
}

interface LandingStoreState extends LandingPageState {
  // Checkout form data (persisted)
  checkoutFormData: CheckoutFormData;
  // Order state
  orderPlaced: boolean;
  orderId: string | null;
  trackLink: string | null;
}

interface LandingStoreActions extends LandingPageActions {
  setCheckoutFormData: (data: Partial<CheckoutFormData>) => void;
  clearCheckoutFormData: () => void;
  setOrderPlaced: (orderId: string, trackLink?: string) => void;
  clearOrderState: () => void;
}

const initialState: LandingStoreState = {
  pageData: null,
  primaryColor: '#541DFF',
  secondaryColor: '#000000',
  checkoutFormData: {},
  orderPlaced: false,
  orderId: null,
  trackLink: null,
};

export const useLandingStore = create<LandingStoreState & LandingStoreActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Set landing page data
        setPageData: (data: SingleProductPage) => {
          set({
            pageData: data,
            primaryColor: data.theme_data?.[0]?.color?.primary_color || '#541DFF',
            secondaryColor: data.theme_data?.[0]?.color?.secondary_color || '#000000',
          });
        },

        // Set primary color
        setPrimaryColor: (color: string) => {
          set({ primaryColor: color });
        },

        // Set secondary color
        setSecondaryColor: (color: string) => {
          set({ secondaryColor: color });
        },

        // Set checkout form data (partial update)
        setCheckoutFormData: (data: Partial<CheckoutFormData>) => {
          set((state) => ({
            checkoutFormData: {
              ...state.checkoutFormData,
              ...data,
            },
          }));
        },

        // Clear checkout form data
        clearCheckoutFormData: () => {
          set({ checkoutFormData: {} });
        },

        // Set order placed state
        setOrderPlaced: (orderId: string, trackLink?: string) => {
          set({
            orderPlaced: true,
            orderId,
            trackLink: trackLink || null,
          });
        },

        // Clear order state
        clearOrderState: () => {
          set({
            orderPlaced: false,
            orderId: null,
            trackLink: null,
          });
        },

        // Reset entire store
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'landing-storage',
        storage: createJSONStorage(() => localStorage),
        // Only persist checkout form data and order state
        partialize: (state) => ({
          checkoutFormData: state.checkoutFormData,
          orderPlaced: state.orderPlaced,
          orderId: state.orderId,
          trackLink: state.trackLink,
        }),
      }
    ),
    { name: 'LandingStore' }
  )
);

// Selectors for optimized re-renders
export const selectPageData = (state: LandingStoreState) => state.pageData;
export const selectPrimaryColor = (state: LandingStoreState) => state.primaryColor;
export const selectSecondaryColor = (state: LandingStoreState) => state.secondaryColor;
export const selectCheckoutFormData = (state: LandingStoreState) => state.checkoutFormData;
export const selectOrderPlaced = (state: LandingStoreState) => state.orderPlaced;
export const selectOrderId = (state: LandingStoreState) => state.orderId;
export const selectTrackLink = (state: LandingStoreState) => state.trackLink;

// Derived selectors
export const selectInventory = (state: LandingStoreState) => state.pageData?.inventory;
export const selectThemeData = (state: LandingStoreState) => state.pageData?.theme_data?.[0];
export const selectBanners = (state: LandingStoreState) => state.pageData?.theme_data?.[0]?.banners;
export const selectProductVideos = (state: LandingStoreState) => state.pageData?.theme_data?.[0]?.product_videos;
export const selectProductImages = (state: LandingStoreState) => state.pageData?.theme_data?.[0]?.product_image;
export const selectMessageOnTop = (state: LandingStoreState) => state.pageData?.theme_data?.[0]?.message_on_top;

export default useLandingStore;
