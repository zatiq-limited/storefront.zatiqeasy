"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { CountryCode } from "libphonenumber-js";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CountryDropdown, Country } from "@/components/ui/country-dropdown";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { encryptData, decryptData } from "@/lib/utils/encrypt-decrypt";
import {
  saveVerifiedPhone,
  isPhoneVerified as checkPhoneVerified,
} from "@/lib/utils/storage";
import type { CheckoutFormData } from "@/types/checkout.types";
import type { ShopProfile } from "@/types/shop.types";

type ContactSectionProps = {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors;
  watch: UseFormWatch<CheckoutFormData>;
  validPhoneNumber: (
    value: string,
    countryCode: CountryCode
  ) => boolean | string;
  selectedCountryCode?: string;
  needPhoneVerification?: boolean;
  onCountryCodeChange?: (countryCode: string) => void;
  onPhoneVerificationChange?: (isVerified: boolean) => void;
  shopId?: number;
  fullPhoneNumber?: string;
  profile?: ShopProfile & {
    metadata?: {
      settings?: {
        shop_settings?: {
          show_email_for_place_order?: boolean;
        };
      };
    };
  };
};

export const ContactSection = ({
  register,
  errors,
  watch,
  validPhoneNumber,
  needPhoneVerification = false,
  onCountryCodeChange,
  onPhoneVerificationChange,
  shopId,
  fullPhoneNumber,
  profile,
}: ContactSectionProps) => {
  const { t } = useTranslation();

  // Check if email field should be shown
  const showEmailField =
    profile?.metadata?.settings?.shop_settings?.show_email_for_place_order !==
    false;

  // OTP verification states
  const formPhoneNumber = watch("customer_phone") || "";
  const [phoneNumber, setPhoneNumber] = useState(formPhoneNumber);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Country selection state - default to Bangladesh
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Sync phoneNumber state with form value
  useEffect(() => {
    if (formPhoneNumber) {
      setPhoneNumber(formPhoneNumber);
    }
  }, [formPhoneNumber]);

  // Initialize with Bangladesh as default country
  useEffect(() => {
    // Set Bangladesh as default if no country is selected
    if (!selectedCountry) {
      const defaultCountry: Country = {
        alpha2: "BD",
        alpha3: "BGD",
        countryCallingCodes: ["+880"],
        currencies: ["BDT"],
        name: "Bangladesh",
        status: "assigned",
        ioc: "BAN",
        languages: ["bn"],
      };
      setSelectedCountry(defaultCountry);

      // Notify parent component about default country code
      if (onCountryCodeChange) {
        onCountryCodeChange("+880");
      }
    }
  }, [selectedCountry, onCountryCodeChange]);

  // Check if phone number is already verified when component loads or phone changes
  useEffect(() => {
    const checkVerification = async () => {
      if (phoneNumber && shopId && needPhoneVerification) {
        try {
          // Normalize phone number: remove country code and leading zero
          const countryCallingCode =
            selectedCountry?.countryCallingCodes?.[0] || "+880";
          let normalizedPhone = fullPhoneNumber || phoneNumber;

          // Remove country code if present
          if (
            countryCallingCode &&
            normalizedPhone.startsWith(countryCallingCode)
          ) {
            normalizedPhone = normalizedPhone.replace(countryCallingCode, "");
          }

          // Remove leading zero if present (for Bangladesh numbers like 01533785541 -> 1533785541)
          if (normalizedPhone.startsWith("0")) {
            normalizedPhone = normalizedPhone.substring(1);
          }

          const isVerified = await checkPhoneVerified(shopId, normalizedPhone);
          setIsPhoneVerified(isVerified);

          // Reset OTP fields if phone is not verified
          if (!isVerified) {
            setShowOtpField(false);
            setIsOtpSent(false);
            setOtpCode("");
            setOtpError("");
          }
        } catch (error) {
          console.error("Error checking phone verification:", error);
          setIsPhoneVerified(false);
        }
      } else if (!phoneNumber) {
        // Reset verification state if phone number is cleared
        setIsPhoneVerified(false);
        setShowOtpField(false);
        setIsOtpSent(false);
        setOtpCode("");
        setOtpError("");
      }
    };

    checkVerification();
  }, [
    phoneNumber,
    shopId,
    needPhoneVerification,
    selectedCountry,
    fullPhoneNumber,
  ]);

  // Notify parent component when phone verification status changes
  useEffect(() => {
    if (onPhoneVerificationChange) {
      onPhoneVerificationChange(isPhoneVerified);
    }
  }, [isPhoneVerified, onPhoneVerificationChange]);

  // Timer effect for resend button
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0 && isOtpSent) {
      setCanResend(true);
    }
  }, [otpTimer, isOtpSent]);

  // Validate phone number and show OTP field
  const handlePhoneValidation = () => {
    const phoneValidationResult = validPhoneNumber(
      phoneNumber,
      (selectedCountry?.alpha2 as CountryCode) || "BD"
    );

    if (phoneValidationResult === true) {
      sendOtp();
    } else {
      setOtpError(
        typeof phoneValidationResult === "string"
          ? phoneValidationResult
          : "Please enter a valid phone number"
      );
    }
  };

  // Send OTP function
  const sendOtp = async () => {
    setIsSendingOtp(true);
    setOtpError("");
    try {
      // Extract phone number without country code
      const countryCallingCode =
        selectedCountry?.countryCallingCodes?.[0] || "";
      let phoneWithoutCountryCode = fullPhoneNumber || phoneNumber;

      if (
        countryCallingCode &&
        phoneWithoutCountryCode.startsWith(countryCallingCode)
      ) {
        phoneWithoutCountryCode = phoneWithoutCountryCode.replace(
          countryCallingCode,
          ""
        );
      }

      // Remove leading zero if present (for Bangladesh numbers like 01533785541 -> 1533785541)
      if (phoneWithoutCountryCode.startsWith("0")) {
        phoneWithoutCountryCode = phoneWithoutCountryCode.substring(1);
      }

      const payload = {
        shop_id: shopId,
        phone: phoneWithoutCountryCode,
      };

      const response = await fetch("/api/orders/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: encryptData(payload) }),
      });

      const data = await response.json();
      const decryptedData = decryptData(data) as {
        status?: boolean;
        message?: string;
      };

      if (decryptedData.status) {
        setIsOtpSent(true);
        setOtpTimer(60); // 1 minute timer
        setCanResend(false);
        setShowOtpField(true);
      } else {
        setOtpError(decryptedData.message || "Failed to send OTP");
      }
    } catch (error) {
      // Handle validation errors
      const err = error as {
        response?: {
          data?: { errors?: { phone?: string[] }; message?: string };
        };
      };
      if (err.response?.data?.errors?.phone) {
        setOtpError(err.response.data.errors.phone[0]);
      } else if (err.response?.data?.message) {
        setOtpError(err.response.data.message);
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP function
  const verifyOtp = async () => {
    if (otpCode.length !== 4) {
      setOtpError("Please enter a 4-digit OTP code");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      // Extract phone number without country code
      const countryCallingCode =
        selectedCountry?.countryCallingCodes?.[0] || "";
      let phoneWithoutCountryCode = fullPhoneNumber || phoneNumber;

      if (
        countryCallingCode &&
        phoneWithoutCountryCode.startsWith(countryCallingCode)
      ) {
        phoneWithoutCountryCode = phoneWithoutCountryCode.replace(
          countryCallingCode,
          ""
        );
      }

      // Remove leading zero if present (for Bangladesh numbers like 01533785541 -> 1533785541)
      if (phoneWithoutCountryCode.startsWith("0")) {
        phoneWithoutCountryCode = phoneWithoutCountryCode.substring(1);
      }

      const payload = {
        shop_id: shopId,
        phone: phoneWithoutCountryCode,
        otp: otpCode,
      };

      const response = await fetch("/api/orders/verify-phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: encryptData(payload) }),
      });

      const data = await response.json();
      const decryptedData = decryptData(data) as {
        status?: boolean;
        message?: string;
      };

      if (decryptedData.status) {
        setIsPhoneVerified(true);
        setOtpError("");

        // Save verified phone to localForage
        if (shopId) {
          try {
            await saveVerifiedPhone(
              shopId,
              phoneWithoutCountryCode,
              countryCallingCode,
              30 // Verification valid for 30 days
            );
          } catch (storageError) {
            console.error(
              "Error saving verified phone to storage:",
              storageError
            );
            // Don't show error to user as verification was successful
          }
        }
      } else {
        setOtpError(decryptedData.message || "Invalid OTP code");
      }
    } catch (error) {
      // Handle validation errors
      const err = error as {
        response?: {
          data?: { errors?: Record<string, string[]>; message?: string };
        };
      };
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        setOtpError(
          Array.isArray(firstError) ? firstError[0] : "Invalid OTP code"
        );
      } else if (err.response?.data?.message) {
        setOtpError(err.response.data.message);
      } else {
        setOtpError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend OTP function
  const resendOtp = () => {
    setOtpCode("");
    setCanResend(false);
    sendOtp();
  };

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Only reset verification states if phone verification is needed
    if (needPhoneVerification) {
      setShowOtpField(false);
      setIsOtpSent(false);
      setIsPhoneVerified(false);
      setOtpError("");
      setOtpCode("");
    }
  };

  // Handle country selection change
  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);

    // Notify parent component about country code change
    if (onCountryCodeChange && country.countryCallingCodes?.[0]) {
      onCountryCodeChange(country.countryCallingCodes[0]);
    }

    // Reset verification states when country changes if phone verification is needed
    if (needPhoneVerification && phoneNumber) {
      setShowOtpField(false);
      setIsOtpSent(false);
      setIsPhoneVerified(false);
      setOtpError("");
      setOtpCode("");
    }
  };

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold dark:text-gray-200">Contact</h2>
      </div>

      <div className="space-y-3">
        {/* Phone and Email Row */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Phone Number */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="customer_phone"
                className="block text-base font-medium text-gray-700 dark:text-gray-200"
              >
                {t("phone_number")} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-28 sm:w-32.5">
                  <CountryDropdown
                    defaultValue={selectedCountry?.alpha3}
                    onChange={handleCountryChange}
                    placeholder="Country"
                  />
                </div>
                <div className="flex flex-auto">
                  <input
                    id="customer_phone"
                    type="text"
                    maxLength={14}
                    placeholder={t("phone_number")}
                    value={phoneNumber}
                    className={`flex-1 grow px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-transparent dark:text-gray-200 ${
                      needPhoneVerification && isPhoneVerified
                        ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    {...register("customer_phone", {
                      required: "Phone number is required",
                      validate: (value: string) =>
                        validPhoneNumber(
                          value,
                          (selectedCountry?.alpha2 as CountryCode) || "BD"
                        ),
                      onChange: handlePhoneChange,
                    })}
                  />
                  {needPhoneVerification &&
                    !isPhoneVerified &&
                    !showOtpField && (
                      <button
                        type="button"
                        onClick={handlePhoneValidation}
                        disabled={!phoneNumber || isSendingOtp}
                        className="px-4 py-3 bg-blue-zatiq dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 min-w-20 cursor-pointer"
                      >
                        {isSendingOtp ? "..." : t("verify")}
                      </button>
                    )}

                  {needPhoneVerification && isPhoneVerified && (
                    <div className="flex items-center px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("verified")}
                    </div>
                  )}
                </div>
              </div>
              {errors && errors.customer_phone && (
                <span className="block text-sm text-red-500">
                  {errors.customer_phone.message as string}
                </span>
              )}
            </div>

            {/* OTP Verification Section */}
            {needPhoneVerification && showOtpField && !isPhoneVerified && (
              <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("otp_sent_message")}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <InputOTP
                    maxLength={4}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                    className="flex-1 grow text-black dark:text-white"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otpCode.length !== 4 || isVerifyingOtp}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-medium bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 min-w-25 cursor-pointer"
                  >
                    {isVerifyingOtp ? "..." : t("submit")}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("didnt_receive_code")}
                  </span>
                  <div className="flex items-center gap-2">
                    {otpTimer > 0 ? (
                      <span className="text-gray-500">
                        {t("resend_in")} {otpTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={!canResend || isSendingOtp}
                        className="text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                      >
                        {isSendingOtp ? t("sending") + "..." : t("resend")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {otpError && (
              <span className="block text-sm text-red-500">{otpError}</span>
            )}
          </div>

          {/* Email Input - Only show if enabled in shop settings */}
          {showEmailField && (
            <div className="flex-1 space-y-1">
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700 dark:text-gray-300"
              >
                {t("email_addressoptional")}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t("email_addressoptional")}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-transparent dark:text-gray-200"
                {...register("customer_email", {
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  required: false,
                })}
              />
              {errors && errors.email && (
                <span className="block text-sm text-red-500">
                  {t("invalid_email_address")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
