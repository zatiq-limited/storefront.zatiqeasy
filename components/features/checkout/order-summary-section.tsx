"use client";

import { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Circle, CircleCheck, Square, SquareCheckBig } from "lucide-react";
import { useMemo } from "react";
import type { CheckoutFormData } from "@/types/checkout.types";
import type { ShopProfile } from "@/types/shop.types";
import type { CartProduct } from "@/types/cart.types";
import { CommonCheckoutCartDetails } from "./common-checkout-cart-details";

type OrderSummarySectionProps = {
  totalPrice: number;
  discountAmount: number;
  totaltax: number;
  deliveryCharge: number;
  grandTotal: number;
  country_currency: string;
  profile: ShopProfile;
  promoCodeSearch: string;
  setPromoCodeSearch: (value: string) => void;
  promoCodeMessage: string;
  isPromoLoading: boolean;
  isLoading: boolean;
  shopId: number;
  promoCodeMutate: (data: { shop_id: string; shop_promo_code: string }) => void;
  isFullOnlinePayment: boolean;
  handleChange: (value: boolean) => void;
  getPayNowAmount: (formatted: boolean) => string | number;
  selectedPaymentMethod: string;
  isAceeptTermsAndCondition: boolean;
  setIsAceeptTermsAndCondition: (value: boolean) => void;
  products: CartProduct[];
  register: UseFormRegister<CheckoutFormData>;
  showTermsError?: boolean;
  setShowTermsError?: (value: boolean) => void;
  isDisabled?: boolean;
};

export function OrderSummarySection({
  totalPrice,
  discountAmount,
  totaltax,
  deliveryCharge,
  grandTotal,
  country_currency,
  profile,
  promoCodeSearch,
  setPromoCodeSearch,
  promoCodeMessage,
  isPromoLoading,
  isLoading,
  shopId,
  promoCodeMutate,
  isFullOnlinePayment,
  handleChange,
  getPayNowAmount,
  selectedPaymentMethod,
  isAceeptTermsAndCondition,
  setIsAceeptTermsAndCondition,
  products,
  register,
  showTermsError,
  setShowTermsError,
  isDisabled = false,
}: OrderSummarySectionProps) {
  const { t } = useTranslation();

  // Calculate total weight and weight-based extra charge for display only
  const { totalWeight, weightBasedExtraCharge } = useMemo(() => {
    let totalWeight = 0;

    // Convert products object to array if needed
    const productsArray: CartProduct[] = Array.isArray(products)
      ? products
      : Object.values(products || {});

    productsArray.forEach((item) => {
      const itemWeight = parseFloat(String(item.weight || 0));
      const itemQty = item.qty || 1;
      totalWeight += itemWeight * itemQty;
    });

    let weightBasedExtraCharge = 0;
    const weightBasedCharges =
      profile?.metadata?.settings?.delivery_support?.weight_based_charges;

    if (
      weightBasedCharges &&
      Array.isArray(weightBasedCharges) &&
      totalWeight > 0
    ) {
      const sortedCharges = [...weightBasedCharges].sort(
        (a, b) => b.weight - a.weight
      );
      const applicableCharge = sortedCharges.find(
        (wbc) => totalWeight >= wbc.weight
      );

      if (applicableCharge) {
        weightBasedExtraCharge = applicableCharge.extra_charge;
      }
    }

    return { totalWeight, weightBasedExtraCharge };
  }, [products, profile]);

  // Check if promo code is enabled in shop settings
  const isPromoCodeEnabled =
    profile?.metadata?.settings?.shop_settings
      ?.enable_promo_code_for_place_order !== false;

  return (
    <div className="flex-1 basis-full lg:basis-1/3 lg:sticky lg:top-8 lg:self-start">
      {/* Cart Details */}
      <CommonCheckoutCartDetails />
      {/* Promo Code and Order Summary Card */}
      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent rounded-lg p-4 md:p-6 space-y-4 mt-6">
        {/* Promo Code Section - Only show if enabled */}
        {isPromoCodeEnabled && (
          <>
            {/* Promo Code Input */}
            <div
              className={`flex items-start gap-3 max-w-full ${
                isDisabled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <input
                type="text"
                disabled={isDisabled}
                className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-transparent dark:text-gray-200 disabled:cursor-not-allowed max-w-[70%] sm:max-w-full h-12"
                placeholder={t("promo_code")}
                onChange={(e) => {
                  setPromoCodeSearch(e.target.value);
                }}
              />
              <button
                type="button"
                disabled={
                  !promoCodeSearch || isPromoLoading || isLoading || isDisabled
                }
                className="px-6 py-3 bg-blue-zatiq rounded-lg text-sm text-white font-medium disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center h-12"
                onClick={() => {
                  promoCodeMutate({
                    shop_id: shopId.toString(),
                    shop_promo_code: promoCodeSearch,
                  });
                }}
              >
                {isPromoLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {t("apply")}
              </button>
            </div>

            {/* Promo Code Message */}
            {promoCodeSearch && promoCodeMessage && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg py-2 px-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {promoCodeMessage}
                </p>
              </div>
            )}
          </>
        )}

        {/* Order Summary */}
        <div className="space-y-3">
          {/* Summary Items */}
          <SummaryDataItem
            label={t("sub_total")}
            value={` ${totalPrice.toLocaleString()} ${country_currency}`}
          />

          {discountAmount > 0 && (
            <SummaryDataItem
              label={t("discount")}
              value={` - ${discountAmount.toLocaleString()} ${country_currency}`}
              className="text-green-600"
            />
          )}

          <SummaryDataItem
            label={`${t("vat_tax")} (${profile.vat_tax ?? 0}%)`}
            value={` ${totaltax.toLocaleString()} ${country_currency}`}
          />

          {/* Delivery Charge - show breakdown if weight-based charge applies */}
          <SummaryDataItem
            label={t("delivery_charge")}
            labelAlert={
              profile?.is_delivery_charge_not_refundable ? "Non-refundable" : ""
            }
            value={` ${deliveryCharge.toLocaleString()} ${country_currency}`}
          />

          {/* Weight-based Extra Charge */}
          {weightBasedExtraCharge > 0 && (
            <SummaryDataItem
              label={`Weight Extra (${totalWeight.toFixed(2)} kg)`}
              labelAlert=""
              value={` ${weightBasedExtraCharge.toLocaleString()} ${country_currency}`}
            />
          )}

          <div className="border-t border-gray-300 dark:border-gray-600"></div>
          <SummaryDataItem
            label={t("total")}
            value={` ${grandTotal.toLocaleString()} ${country_currency}`}
            className="text-lg font-semibold"
          />
        </div>

        {/* Advanced Payment Options */}
        {(profile.advance_payment_type ?? "Full Payment") != "Full Payment" &&
          (selectedPaymentMethod == "aamarpay" ||
            selectedPaymentMethod == "bkash" ||
            selectedPaymentMethod == "zatiq_seller_pay" ||
            selectedPaymentMethod == "self_mfs") && (
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
              <div
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => {
                  handleChange(true);
                }}
              >
                {isFullOnlinePayment ? (
                  <CircleCheck
                    size={20}
                    className="text-blue-zatiq dark:text-white"
                  />
                ) : (
                  <Circle
                    size={20}
                    className="text-gray-400 dark:text-gray-500"
                  />
                )}
                <label className="font-medium text-base text-blue-zatiq dark:text-white cursor-pointer">
                  {t("pay_full_amount")}
                </label>
              </div>

              <div
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => {
                  handleChange(false);
                }}
              >
                {!isFullOnlinePayment ? (
                  <CircleCheck
                    size={20}
                    className="text-blue-zatiq dark:text-white"
                  />
                ) : (
                  <Circle
                    size={20}
                    className="text-gray-400 dark:text-gray-500"
                  />
                )}
                <label className="font-medium text-base text-blue-zatiq dark:text-white cursor-pointer">
                  {t("advanced_amount")} ({getPayNowAmount(true)}{" "}
                  {country_currency})
                </label>
              </div>
            </div>
          )}

        {/* Terms and Conditions Checkbox */}
        {selectedPaymentMethod != "cod" &&
          selectedPaymentMethod !== "self_mfs" && (
            <label
              className="flex items-start gap-3 pt-4 border-t border-gray-300 dark:border-gray-600 cursor-pointer"
              onClick={() => {
                setIsAceeptTermsAndCondition(!isAceeptTermsAndCondition);
              }}
            >
              <div className="mt-0.5">
                {isAceeptTermsAndCondition ? (
                  <SquareCheckBig size={20} className="text-blue-zatiq" />
                ) : (
                  <Square size={20} className="text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("i_accept_the")}{" "}
                <a
                  href={`${profile.baseUrl}/privacy-policy`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-zatiq hover:underline font-medium"
                >
                  {t("privacy_policy")}
                </a>
                {", "}
                <a
                  href={`${profile.baseUrl}/terms-and-conditions`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-zatiq hover:underline font-medium"
                >
                  {t("terms_and_conditions")}
                </a>{" "}
                {t("and")}{" "}
                <a
                  href={`${profile.baseUrl}/return-policy`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-zatiq hover:underline font-medium"
                >
                  {t("refund_return_cancellation_policy")}
                </a>
                .
              </p>
            </label>
          )}

        {/* Error message for non-self_mfs payment methods */}
        {showTermsError &&
          selectedPaymentMethod !== "cod" &&
          selectedPaymentMethod !== "self_mfs" &&
          !isAceeptTermsAndCondition && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Please accept the terms and conditions to proceed with your
                order.
              </p>
            </div>
          )}
      </div>

      {/* Notes Section */}
      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent rounded-lg p-4 md:p-6 mt-6">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {t("add_note")}
        </h4>
        <textarea
          {...register("note")}
          disabled={isDisabled}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-transparent dark:text-gray-200 resize-none disabled:cursor-not-allowed"
          placeholder={t("delivery_instruction")}
        />
      </div>

      {/* Confirm Order Button */}
      <div className="pt-4">
        <button
          disabled={isLoading || products.length < 1 || isDisabled}
          type="submit"
          className="w-full px-6 py-4 bg-blue-zatiq text-base text-white font-medium rounded-lg disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            if (!isAceeptTermsAndCondition && selectedPaymentMethod !== "cod") {
              e.preventDefault();
              setShowTermsError?.(true);
              return;
            }
            setShowTermsError?.(false);
          }}
        >
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {t("confirm_order")}
        </button>
      </div>
    </div>
  );
}

const SummaryDataItem = ({
  label,
  labelAlert,
  value,
  className,
}: {
  label: string;
  labelAlert?: string;
  value: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 font-medium tracking-[-0.64px]",
        className
      )}
    >
      <div className=" font-normal md:text-[16px] text-[#6B7280] dark:text-gray-400">
        {label}{" "}
        {labelAlert && <span className="text-red-500">({labelAlert})</span>}
      </div>
      <div className="flex-1 w-full text-right md:text-[16px] font-semibold text-[#4B5563] dark:text-gray-300">
        {value}
      </div>
    </div>
  );
};
