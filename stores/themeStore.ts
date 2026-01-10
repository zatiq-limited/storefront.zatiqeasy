import { create } from "zustand";

interface ThemeState {
  theme: Record<string, unknown> | null;
  setTheme: (theme: Record<string, unknown>) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: null,
  setTheme: (theme) => set({ theme }),
}));
