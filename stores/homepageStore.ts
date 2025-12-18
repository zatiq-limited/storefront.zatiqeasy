import { create } from "zustand";

interface HomepageState {
  homepage: Record<string, unknown> | null;
  setHomepage: (homepage: Record<string, unknown>) => void;
}

export const useHomepageStore = create<HomepageState>((set) => ({
  homepage: null,
  setHomepage: (homepage) => set({ homepage }),
}));