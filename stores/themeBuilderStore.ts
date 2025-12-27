import { create } from "zustand";
import type { 
  ThemeBuilderData, 
  TransformedTheme, 
  TransformedPage 
} from "@/lib/api/services/theme-builder.service";

interface ThemeBuilderState {
  // Data
  themeBuilderData: ThemeBuilderData | null;
  theme: TransformedTheme | null;
  
  // All pages (matching PageType in merchant panel)
  homePage: TransformedPage | null;
  productsPage: TransformedPage | null;
  productDetailsPage: TransformedPage | null;
  collectionsPage: TransformedPage | null;
  collectionDetailsPage: TransformedPage | null;
  aboutPage: TransformedPage | null;
  contactPage: TransformedPage | null;
  privacyPolicyPage: TransformedPage | null;
  cartPage: TransformedPage | null;
  checkoutPage: TransformedPage | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setThemeBuilderData: (data: ThemeBuilderData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useThemeBuilderStore = create<ThemeBuilderState>((set) => ({
  // Initial state
  themeBuilderData: null,
  theme: null,
  homePage: null,
  productsPage: null,
  productDetailsPage: null,
  collectionsPage: null,
  collectionDetailsPage: null,
  aboutPage: null,
  contactPage: null,
  privacyPolicyPage: null,
  cartPage: null,
  checkoutPage: null,
  isLoading: false,
  error: null,

  // Actions
  setThemeBuilderData: (data) => set({ 
    themeBuilderData: data,
    theme: data?.theme || null,
    homePage: data?.pages?.home || null,
    productsPage: data?.pages?.products || null,
    productDetailsPage: data?.pages?.productDetails || null,
    collectionsPage: data?.pages?.collections || null,
    collectionDetailsPage: data?.pages?.collectionDetails || null,
    aboutPage: data?.pages?.about || null,
    contactPage: data?.pages?.contact || null,
    privacyPolicyPage: data?.pages?.privacyPolicy || null,
    cartPage: data?.pages?.cart || null,
    checkoutPage: data?.pages?.checkout || null,
    error: null,
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set({
    themeBuilderData: null,
    theme: null,
    homePage: null,
    productsPage: null,
    productDetailsPage: null,
    collectionsPage: null,
    collectionDetailsPage: null,
    aboutPage: null,
    contactPage: null,
    privacyPolicyPage: null,
    cartPage: null,
    checkoutPage: null,
    isLoading: false,
    error: null,
  }),
}));
