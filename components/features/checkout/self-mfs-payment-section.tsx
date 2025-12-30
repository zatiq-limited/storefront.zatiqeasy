"use client";

import { cn } from "@/lib/utils";
import { Square, SquareCheckBig } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

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
          {paymentCustomMessage ??
            `Note: We'll contact you once the order is confirmed`}
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
            ** Please contact with the seller. No mobile financial services
            (MFS) is enabled for this shop. **
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
                    {selfMfsData.mfs_provider === "bkash" ? "Bkash" : "Nagad"}{" "}
                    Payment Instruction
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
                    <p className="font-medium">প্রিয় গ্রাহক,</p>
                    <p>
                      আমাদের শপ থেকে অর্ডার করার জন্য ধন্যবাদ! আপনার অর্ডার
                      কনফার্ম করতে নিচের ধাপগুলো অনুসরণ করুন 👇
                    </p>

                    <div className="mt-4">
                      <p className="font-semibold text-red-500">
                        {selfMfsData.mfs_provider === "bkash"
                          ? "বিকাশে"
                          : "নগদে"}{" "}
                        পেমেন্ট করুন
                      </p>
                      <ul className="list-disc ml-6 space-y-1 mt-2">
                        <li>
                          {selfMfsData.mfs_type == "personal" && "পারসোনাল"}
                          {selfMfsData.mfs_type == "agent" && "এজেন্ট"}
                          {selfMfsData.mfs_type == "merchant" &&
                            "মার্চেন্ট"}{" "}
                          নাম্বার:
                          <span className="font-mono font-bold">
                            {" "}
                            {selfMfsData.mfs_phone}
                          </span>
                        </li>
                        <li>টাইপ করুন: [অর্ডারের টাকা]</li>
                        <li>
                          পেমেন্টের সময় &quot;রেফারেন্স&quot; ঘরে আপনার নাম দিন
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <p className="font-semibold text-red-500">
                        পেমেন্ট করার পর ইনফরমেশন দিন
                      </p>
                      <ul className="list-disc ml-6 space-y-1 mt-2">
                        <li>
                          আপনার মোবাইল নাম্বার (যে নাম্বার থেকে পেমেন্ট করেছেন)
                        </li>
                        <li>TrxID (Transaction ID)</li>
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
                    পেমেন্ট করতে{" "}
                    {selfMfsData.mfs_provider === "bkash" ? "বিকাশ" : "নগদ"}{" "}
                    অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন
                  </p>
                  {selfMfsData.mfs_provider === "bkash" ? (
                    <div className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold truncate">
                      বিকাশ পেমেন্ট
                    </div>
                  ) : (
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold truncate">
                      নগদ পেমেন্ট
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
                  Your payment phone number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  placeholder="Type here. . ."
                  {...register("mfs_phone", {
                    required: isSelfMfs
                      ? "Payment phone number is required"
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
                  TrxID (Transaction ID) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  placeholder="Type here. . ."
                  {...register("mfs_trx_id", {
                    required: isSelfMfs ? "Transaction ID is required" : false,
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
                Merchant receives payments directly. The website provider
                carries no liability. By proceeding you accept{" "}
                <button
                  type="button"
                  className="text-blue-500 dark:text-blue-400 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open("/terms-and-conditions", "_blank");
                  }}
                >
                  terms and conditions
                </button>
                .
              </div>
            </div>

            {/* Error message */}
            {showTermsError && !isAceeptTermsAndCondition && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Please accept the terms and conditions to proceed with your
                  order.
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
