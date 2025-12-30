import { create } from "zustand";

interface AboutUsState {
  aboutUs: Record<string, unknown> | null;
  setAboutUs: (aboutUs: Record<string, unknown>) => void;
}

export const useAboutUsStore = create<AboutUsState>((set) => ({
  aboutUs: null,
  setAboutUs: (aboutUs) => set({ aboutUs }),
}));