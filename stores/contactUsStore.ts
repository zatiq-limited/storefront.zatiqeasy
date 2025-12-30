import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ContactUsState {
  contactUs: any;
  setContactUs: (contactUs: any) => void;
}

export const useContactUsStore = create<ContactUsState>()(
  devtools(
    (set) => ({
      contactUs: null,
      setContactUs: (contactUs) => set({ contactUs }),
    }),
    {
      name: "contact-us-store",
    }
  )
);