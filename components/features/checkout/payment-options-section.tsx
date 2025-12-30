"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { CodIcon } from "@/components/ui/icons/cod-icon";
import { BkashPaymentIcon } from "@/components/ui/icons/bkash-payment-icon";
import { NagadIcon } from "@/components/ui/icons/nagad-icon";
import { SelfMFSIcon } from "@/components/ui/icons/self-mfs-icon";
import { SellerPayIcon } from "@/components/ui/icons/seller-pay-icon";
import SelfMfsPaymentSection from "./self-mfs-payment-section";
import { DELIVERY_OPTION } from "@/lib/constants/delivery";

// Helper to get payment method i18n key
const getPaymentMethodName = (method: string): string => {
  switch (method) {
    case "bkash":
      return "bkash";
    case "nagad":
      return "nagad";
    case "zatiq_seller_pay":
      return "Zatiq Secure Purchase";
    case "aamarpay":
      return "AamarPay(Cards/MFS)";
    case "self_mfs":
      return "self_mfs";
    case "cod":
    default:
      return "cash_on_delivery";
  }
};

import type { CheckoutFormData } from "@/types/checkout.types";
import type { ShopProfile } from "@/types/shop.types";

type PaymentOptionsSectionProps = {
  paymentMethods: string[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors;
  profile: ShopProfile;
  isAceeptTermsAndCondition: boolean;
  setIsAceeptTermsAndCondition: (value: boolean) => void;
  showTermsError?: boolean;
  setShowTermsError?: (value: boolean) => void;
  isDisabled?: boolean;
  selectedDeliveryZone?: string | null;
  selectedDistrict?: string | null;
  deliveryOption?: string;
};

export function PaymentOptionsSection({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  register,
  errors,
  profile,
  isAceeptTermsAndCondition,
  setIsAceeptTermsAndCondition,
  showTermsError,
  setShowTermsError,
  isDisabled = false,
  selectedDeliveryZone = null,
  selectedDistrict = null,
  deliveryOption,
}: PaymentOptionsSectionProps) {
  const { t } = useTranslation();

  // Check if COD is enabled based on delivery zone or district
  const isCodEnabled = () => {
    const deliverySupport = profile?.metadata?.settings?.delivery_support;

    // If no delivery_support metadata, default to enabled
    if (!deliverySupport) return true;

    // Check zone-specific COD if delivery_option is "zones" and a zone is selected
    if (deliveryOption === DELIVERY_OPTION.ZONES && selectedDeliveryZone) {
      const zoneCodEnabled =
        deliverySupport?.zone_cod_enabled?.[selectedDeliveryZone];
      // Use explicit check - if zone setting exists, use it; otherwise default to true
      return zoneCodEnabled !== undefined ? zoneCodEnabled : true;
    }

    // For district-wise delivery, check if the selected district has a zone COD setting
    if (deliveryOption === DELIVERY_OPTION.DISTRICTS && selectedDistrict) {
      const zoneCodEnabled =
        deliverySupport?.zone_cod_enabled?.[selectedDistrict];
      // If district has a specific zone COD setting, use it
      if (zoneCodEnabled !== undefined) {
        return zoneCodEnabled;
      }
      // Otherwise, fall back to default COD setting
      const defaultCodEnabled = deliverySupport?.default_cod_enabled;
      return defaultCodEnabled !== undefined ? defaultCodEnabled : true;
    }

    // For upazila-wise delivery, check if the selected district has a zone COD setting
    if (deliveryOption === DELIVERY_OPTION.UPAZILAS && selectedDistrict) {
      const zoneCodEnabled =
        deliverySupport?.zone_cod_enabled?.[selectedDistrict];
      // If district has a specific zone COD setting, use it
      if (zoneCodEnabled !== undefined) {
        return zoneCodEnabled;
      }
      // Otherwise, fall back to default COD setting
      const defaultCodEnabled = deliverySupport?.default_cod_enabled;
      return defaultCodEnabled !== undefined ? defaultCodEnabled : true;
    }

    // For other cases or when no district/zone selected, check default COD setting
    const defaultCodEnabled = deliverySupport?.default_cod_enabled;
    return defaultCodEnabled !== undefined ? defaultCodEnabled : true;
  };

  // Filter payment methods to exclude COD if disabled
  const filteredPaymentMethods = paymentMethods.filter((method) => {
    if (method === "cod") {
      return isCodEnabled();
    }
    return true;
  });

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    // Clear terms error when switching to COD
    if (method === "cod" && setShowTermsError) {
      setShowTermsError(false);
    }
  };

  return (
    <>
      {/* Payment Options Section */}
      <div
        className={`mb-6 md:mb-8 space-y-3 ${
          isDisabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">
          {t("payment_options")}
        </h4>
        <div className="flex flex-wrap gap-3 w-full">
          {!paymentMethods?.length && isCodEnabled() && (
            <button
              onClick={() => !isDisabled && setSelectedPaymentMethod("cod")}
              type="button"
              disabled={isDisabled}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-blue-zatiq text-sm font-medium flex items-center gap-2 md:gap-3 ring-2 ${
                selectedPaymentMethod === "cod"
                  ? "ring-blue-zatiq bg-blue-50 dark:bg-blue-900/20"
                  : "ring-gray-300 dark:ring-gray-600"
              } rounded-full transition-all disabled:cursor-not-allowed`}
            >
              <CodIcon />
              {t("cash_on_delivery")}
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 w-full">
            {filteredPaymentMethods?.map((paymentMethod: string) => (
              <button
                key={paymentMethod}
                onClick={() => {
                  if (!isDisabled) handlePaymentMethodChange(paymentMethod);
                }}
                type="button"
                disabled={isDisabled}
                className={cn(
                  "px-4 sm:px-6 py-3 sm:py-4 text-sm capitalize gap-2 md:gap-3 border-2 rounded-lg transition-colors w-full flex flex-col items-start cursor-pointer disabled:cursor-not-allowed",
                  selectedPaymentMethod === paymentMethod
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                )}
              >
                <div className="flex justify-between w-full items-center text-black dark:text-white">
                  <p>{t(getPaymentMethodName(paymentMethod))}</p>
                  {paymentMethod === selectedPaymentMethod ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 0C3.58897 0 0 3.58897 0 8C0 12.411 3.58897 16 8 16C12.411 16 16 12.411 16 8C16 3.58897 12.411 0 8 0ZM12.4712 5.89474L7.3584 10.9674C7.05764 11.2682 6.57644 11.2882 6.25564 10.9875L3.54887 8.5213C3.22807 8.22055 3.20802 7.7193 3.48872 7.3985C3.78947 7.07769 4.29073 7.05764 4.61153 7.3584L6.75689 9.32331L11.3283 4.75188C11.6491 4.43108 12.1504 4.43108 12.4712 4.75188C12.792 5.07268 12.792 5.57393 12.4712 5.89474Z"
                        fill="#3465F0"
                      />
                    </svg>
                  ) : null}
                </div>
                {paymentMethod === "zatiq_seller_pay" && <SellerPayIcon />}
                {paymentMethod === "cod" && <CodIcon />}
                {paymentMethod === "bkash" && <BkashPaymentIcon />}
                {paymentMethod === "nagad" && <NagadIcon />}
                {paymentMethod === "self_mfs" && <SelfMFSIcon />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Self MFS Payment Section */}
      {selectedPaymentMethod === "self_mfs" && (
        <input type="hidden" {...register("mfs_provider")} value="self_mfs" />
      )}
      <SelfMfsPaymentSection
        selectedPaymentMethod={selectedPaymentMethod}
        profile={profile}
        register={register}
        errors={errors}
        isAceeptTermsAndCondition={isAceeptTermsAndCondition}
        setIsAceeptTermsAndCondition={setIsAceeptTermsAndCondition}
        paymentCustomMessage={
          profile.payment_custom_message ??
          `Note: ${`We'll `} contact you once the order is confirmed`
        }
        messageClassName="block text-red-500 tracking-[-.56px] whitespace-pre-line"
        showTermsError={showTermsError}
        setShowTermsError={setShowTermsError}
      />
    </>
  );
}
