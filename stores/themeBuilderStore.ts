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
  homePage: TransformedPage | null;
  
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
  isLoading: false,
  error: null,

  // Actions
  setThemeBuilderData: (data) => set({ 
    themeBuilderData: data,
    theme: data?.theme || null,
    homePage: data?.pages?.home || null,
    error: null,
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set({
    themeBuilderData: null,
    theme: null,
    homePage: null,
    isLoading: false,
    error: null,
  }),
}));
