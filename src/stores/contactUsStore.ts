import { create } from "zustand";

interface ContactUsState {
  contactUs: Record<string, unknown> | null;
  setContactUs: (contactUs: Record<string, unknown>) => void;
}

export const useContactUsStore = create<ContactUsState>((set) => ({
  contactUs: null,
  setContactUs: (contactUs) => set({ contactUs }),
}));
