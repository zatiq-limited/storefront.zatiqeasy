import { create } from "zustand";
import type { ThemeBuilderData, ThemeBuilderEditorState } from "@/lib/api/services/theme-builder.service";

interface ThemeBuilderState {
  // Data
  themeBuilderData: ThemeBuilderData | null;
  editorState: ThemeBuilderEditorState | null;
  
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
  editorState: null,
  isLoading: false,
  error: null,

  // Actions
  setThemeBuilderData: (data) => set({ 
    themeBuilderData: data,
    editorState: data?.editorState || null,
    error: null,
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set({
    themeBuilderData: null,
    editorState: null,
    isLoading: false,
    error: null,
  }),
}));
