import { create } from "zustand";

interface PrivacyPolicyState {
  privacyPolicy: Record<string, unknown> | null;
  setPrivacyPolicy: (privacyPolicy: Record<string, unknown>) => void;
}

export const usePrivacyPolicyStore = create<PrivacyPolicyState>((set) => ({
  privacyPolicy: null,
  setPrivacyPolicy: (privacyPolicy) => set({ privacyPolicy }),
}));