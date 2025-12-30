import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PrivacyPolicyState {
  privacyPolicy: any;
  setPrivacyPolicy: (privacyPolicy: any) => void;
}

export const usePrivacyPolicyStore = create<PrivacyPolicyState>()(
  devtools(
    (set) => ({
      privacyPolicy: null,
      setPrivacyPolicy: (privacyPolicy) => set({ privacyPolicy }),
    }),
    {
      name: "privacy-policy-store",
    }
  )
);
