"use client";

import { cn } from "@/lib/utils";
import { Square, SquareCheckBig } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface SelfMfsPaymentSectionProps {
  selectedPaymentMethod: string;
  profile: any;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isAceeptTermsAndCondition: boolean;
  setIsAceeptTermsAndCondition: (v: boolean) => void;
  className?: string;
  messageClassName?: string;
  paymentCustomMessage?: string;
  inputClassName?: string;
  showTermsError?: boolean;
  setShowTermsError?: (value: boolean) => void;
}

/**
 * Self managed MFS (Bkash / Nagad) payment instruction section.
 * Shows:
 *  - Generic shop payment message when payment method is not self_mfs
 *  - Detailed Bengali + English instruction, QR image and two inputs when self_mfs selected
 *  - Terms acceptance checkbox (scoped to self_mfs flow)
 */
export const SelfMfsPaymentSection: React.FC<SelfMfsPaymentSectionProps> = ({
  selectedPaymentMethod,
  profile,
  register,
  errors,
  isAceeptTermsAndCondition,
  setIsAceeptTermsAndCondition,
  className,
  messageClassName = "block text-red-500 tracking-[-.56px] whitespace-pre-line",
  paymentCustomMessage,
  inputClassName = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white",
  showTermsError,
  setShowTermsError,
}) => {
  const { t } = useTranslation();
  const isSelfMfs = selectedPaymentMethod === "self_mfs";
  const selfMfsData = profile?.self_mfs;

  if (!isSelfMfs) {
    return (
      <div
        className={cn(
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 mt-4",
          className
        )}
      >
        <p className={messageClassName}>
          {paymentCustomMessage ?? t("note_will_contact")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-4 px-4 mt-4 space-y-4",
        className
      )}
    >
      {!selfMfsData ? (
        <div className="text-red-500">
          <p className="block text-red-500 tracking-[-.56px]">
            {t("no_mfs_enabled")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center gap-2">
                  <SquareCheckBig size={18} className="text-blue-500" />
                  <span className="whitespace-nowrap">
                    {selfMfsData.mfs_provider === "bkash" ? t("bkash") : t("nagad")}{" "}
                    {t("payment_instruction")}
                  </span>
                </h3>

                {selfMfsData.mfs_instruction ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selfMfsData.mfs_instruction,
                    }}
                  />
                ) : (
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="font-medium">{t("dear_customer")},</p>
                    <p>
                      {t("order_thanks")}
                    </p>

                    <div className="mt-4">
                      <p className="font-semibold text-red-500">
                        {t("pay_with")}{" "}
                        {selfMfsData.mfs_provider === "bkash"
                          ? t("bkash")
                          : t("nagad")}
                      </p>
                      <ul className="list-disc ml-6 space-y-1 mt-2">
                        <li>
                          {selfMfsData.mfs_type == "personal" && t("personal")}
                          {selfMfsData.mfs_type == "agent" && t("agent")}
                          {selfMfsData.mfs_type == "merchant" &&
                            t("merchant")}{" "}
                          {t("number")}:
                          <span className="font-mono font-bold">
                            {" "}
                            {selfMfsData.mfs_phone}
                          </span>
                        </li>
                        <li>{t("type_amount")}</li>
                        <li>
                          {t("reference_instruction")}
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <p className="font-semibold text-red-500">
                        {t("payment_info_heading")}
                      </p>
                      <ul className="list-disc ml-6 space-y-1 mt-2">
                        <li>
                          {t("your_mobile_number")}
                        </li>
                        <li>{t("trxid_label")}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col xl:flex-row items-center gap-6 mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1 items-center text-center justify-center">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    {selfMfsData.mfs_qr_image_url && (
                      <Image
                        src={selfMfsData.mfs_qr_image_url}
                        alt="MFS QR"
                        width={100}
                        height={100}
                        className="w-24 h-32 bg-white inline-flex items-center justify-center object-cover"
                      />
                    )}
                    <p className="text-center mt-2 font-mono font-bold">
                      {selfMfsData.mfs_phone}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                    {t("scan_qr_with")}{" "}
                    {selfMfsData.mfs_provider === "bkash" ? t("bkash") : t("nagad")}{" "}
                    {t("app_to_pay")}
                  </p>
                  {selfMfsData.mfs_provider === "bkash" ? (
                    <div className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold truncate">
                      {t("bkash")} {t("payment")}
                    </div>
                  ) : (
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold truncate">
                      {t("nagad")} {t("payment")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form Section */}
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("payment_phone_label")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  placeholder={t("payment_phone_placeholder")}
                  {...register("mfs_phone", {
                    required: isSelfMfs
                      ? t("payment_phone_required")
                      : false,
                  })}
                />
                {errors && (errors as any).mfs_phone && (
                  <span className="block text-sm text-red-500 mt-1">
                    {(errors as any).mfs_phone.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("trxid_label")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  placeholder={t("trxid_placeholder")}
                  {...register("mfs_trx_id", {
                    required: isSelfMfs ? t("trxid_required") : false,
                  })}
                />
                {errors && (errors as any).mfs_trx_id && (
                  <span className="block text-sm text-red-500 mt-1">
                    {(errors as any).mfs_trx_id.message}
                  </span>
                )}
              </div>
            </div>

            <div
              className="flex items-start space-x-2 mt-4 cursor-pointer"
              onClick={() => {
                setIsAceeptTermsAndCondition(!isAceeptTermsAndCondition);
                if (setShowTermsError) {
                  setShowTermsError(false);
                }
              }}
            >
              <div className="mt-0.5">
                {isAceeptTermsAndCondition ? (
                  <SquareCheckBig size={20} className="text-blue-500" />
                ) : (
                  <Square size={20} className="text-gray-400" />
                )}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {t("merchant_liability")}{" "}
                <button
                  type="button"
                  className="text-blue-500 dark:text-blue-400 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open("/terms-and-conditions", "_blank");
                  }}
                >
                  {t("terms_and_conditions_link")}
                </button>
                .
              </div>
            </div>

            {/* Error message */}
            {showTermsError && !isAceeptTermsAndCondition && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {t("accept_terms_error")}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SelfMfsPaymentSection;
