import { create } from 'zustand';
import type {
  Division,
  District,
  Upazila,
  PaymentMethod,
  PromoCode,
} from '@/types';

interface CheckoutState {
  // Location selection
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedDeliveryZone: string;

  // Location data (from API)
  divisions: Division[];
  districts: Record<string, District[]>;
  upazilas: Record<string, Record<string, Upazila[]>>;

  // Payment
  selectedPaymentMethod: PaymentMethod;
  isFullOnlinePayment: boolean;

  // Promo
  promoCode: PromoCode | null;
  promoCodeSearch: string;
  promoCodeMessage: string;
  discountAmount: number;

  // Customer
  fullPhoneNumber: string;
  countryCallingCode: string;
  isPhoneVerified: boolean;

  // Terms
  acceptedTerms: boolean;

  // Form step (for multi-step checkout)
  currentStep: number;
}

interface CheckoutActions {
  // Location
  setSelectedDivision: (division: string) => void;
  setSelectedDistrict: (district: string) => void;
  setSelectedUpazila: (upazila: string) => void;
  setSelectedDeliveryZone: (zone: string) => void;
  setDivisions: (divisions: Division[]) => void;

  // Payment
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  setIsFullOnlinePayment: (isFull: boolean) => void;

  // Promo
  setPromoCode: (code: PromoCode | null) => void;
  setPromoCodeSearch: (search: string) => void;
  setPromoCodeMessage: (message: string) => void;
  setDiscountAmount: (amount: number) => void;
  clearPromoCode: () => void;

  // Customer
  setFullPhoneNumber: (phone: string) => void;
  setCountryCallingCode: (code: string) => void;
  setIsPhoneVerified: (verified: boolean) => void;

  // Terms
  setAcceptedTerms: (accepted: boolean) => void;

  // Step
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Reset
  resetCheckout: () => void;
}

const initialState: CheckoutState = {
  selectedDivision: '',
  selectedDistrict: '',
  selectedUpazila: '',
  selectedDeliveryZone: 'Others',
  divisions: [],
  districts: {},
  upazilas: {},
  selectedPaymentMethod: 'cod',
  isFullOnlinePayment: true,
  promoCode: null,
  promoCodeSearch: '',
  promoCodeMessage: '',
  discountAmount: 0,
  fullPhoneNumber: '',
  countryCallingCode: '+880',
  isPhoneVerified: false,
  acceptedTerms: false,
  currentStep: 1,
};

export const useCheckoutStore = create<CheckoutState & CheckoutActions>(
  (set) => ({
    ...initialState,

    // Location actions
    setSelectedDivision: (division) =>
      set({
        selectedDivision: division,
        selectedDistrict: '',
        selectedUpazila: '',
      }),

    setSelectedDistrict: (district) =>
      set({
        selectedDistrict: district,
        selectedUpazila: '',
      }),

    setSelectedUpazila: (upazila) => set({ selectedUpazila: upazila }),

    setSelectedDeliveryZone: (zone) => set({ selectedDeliveryZone: zone }),

    setDivisions: (divisions) => {
      const districts: Record<string, District[]> = {};
      const upazilas: Record<string, Record<string, Upazila[]>> = {};

      divisions.forEach((div) => {
        districts[div.name] = div.districts || [];
        upazilas[div.name] = {};
        div.districts?.forEach((dist) => {
          upazilas[div.name][dist.name] = dist.upazilas || [];
        });
      });

      set({ divisions, districts, upazilas });
    },

    // Payment actions
    setSelectedPaymentMethod: (method) =>
      set({ selectedPaymentMethod: method }),

    setIsFullOnlinePayment: (isFull) => set({ isFullOnlinePayment: isFull }),

    // Promo actions
    setPromoCode: (code) => set({ promoCode: code }),

    setPromoCodeSearch: (search) => set({ promoCodeSearch: search }),

    setPromoCodeMessage: (message) => set({ promoCodeMessage: message }),

    setDiscountAmount: (amount) => set({ discountAmount: amount }),

    clearPromoCode: () =>
      set({
        promoCode: null,
        promoCodeSearch: '',
        promoCodeMessage: '',
        discountAmount: 0,
      }),

    // Customer actions
    setFullPhoneNumber: (phone) => set({ fullPhoneNumber: phone }),

    setCountryCallingCode: (code) => set({ countryCallingCode: code }),

    setIsPhoneVerified: (verified) => set({ isPhoneVerified: verified }),

    // Terms
    setAcceptedTerms: (accepted) => set({ acceptedTerms: accepted }),

    // Step actions
    setCurrentStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () =>
      set((state) => ({
        currentStep: Math.max(1, state.currentStep - 1),
      })),

    // Reset
    resetCheckout: () => set(initialState),
  })
);

// Selectors
export const selectSelectedLocation = (state: CheckoutState & CheckoutActions) => ({
  division: state.selectedDivision,
  district: state.selectedDistrict,
  upazila: state.selectedUpazila,
  deliveryZone: state.selectedDeliveryZone,
});

export const selectAvailableDistricts = (state: CheckoutState & CheckoutActions) =>
  state.districts[state.selectedDivision] || [];

export const selectAvailableUpazilas = (state: CheckoutState & CheckoutActions) =>
  state.upazilas[state.selectedDivision]?.[state.selectedDistrict] || [];

export const selectHasPromoCode = (state: CheckoutState & CheckoutActions) =>
  state.promoCode !== null;

export const selectIsCheckoutReady = (state: CheckoutState & CheckoutActions) =>
  state.acceptedTerms &&
  state.selectedPaymentMethod &&
  (state.selectedDivision || state.selectedDeliveryZone !== 'Others');
