"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type PaymentOptionsSectionProps = {
  paymentMethods: string[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  profile: any;
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
  // Check if COD is enabled based on delivery zone or district
  const isCodEnabled = () => {
    const deliverySupport = profile?.metadata?.settings?.delivery_support;

    // If no delivery_support metadata, default to enabled
    if (!deliverySupport) return true;

    // Check zone-specific COD if delivery_option is "zones" and a zone is selected
    if (deliveryOption === "zones" && selectedDeliveryZone) {
      const zoneCodEnabled = deliverySupport?.zone_cod_enabled?.[selectedDeliveryZone];
      return zoneCodEnabled !== undefined ? zoneCodEnabled : true;
    }

    // For district-wise delivery, check if the selected district has a zone COD setting
    if (deliveryOption === "districts" && selectedDistrict) {
      const zoneCodEnabled = deliverySupport?.zone_cod_enabled?.[selectedDistrict];
      if (zoneCodEnabled !== undefined) {
        return zoneCodEnabled;
      }
      const defaultCodEnabled = deliverySupport?.default_cod_enabled;
      return defaultCodEnabled !== undefined ? defaultCodEnabled : true;
    }

    // For other cases or when no district/zone selected, check default COD setting
    const defaultCodEnabled = deliverySupport?.default_cod_enabled;
    return defaultCodEnabled !== undefined ? defaultCodEnabled : true;
  };

  // Filter payment methods to exclude COD if disabled
  const filteredPaymentMethods = paymentMethods.filter((method) => {
    if (method === 'cod') {
      return isCodEnabled();
    }
    return true;
  });

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'cod':
        return {
          name: 'Cash on Delivery',
          description: 'Pay when you receive your order',
          icon: '💵'
        };
      case 'bkash':
        return {
          name: 'bKash',
          description: 'Pay with bKash mobile banking',
          icon: '📱'
        };
      case 'nagad':
        return {
          name: 'Nagad',
          description: 'Pay with Nagad mobile banking',
          icon: '📱'
        };
      case 'aamarpay':
        return {
          name: 'AamarPay',
          description: 'Pay with credit/debit card or mobile banking',
          icon: '💳'
        };
      case 'self_mfs':
        return {
          name: 'Mobile Banking',
          description: 'Pay with selected mobile banking service',
          icon: '📱'
        };
      default:
        return {
          name: method,
          description: 'Pay with this method',
          icon: '💳'
        };
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
    // Clear terms error when switching to COD
    if (method === 'cod' && setShowTermsError) {
      setShowTermsError(false);
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setIsAceeptTermsAndCondition(checked);
    // Clear terms error when accepting
    if (checked && setShowTermsError) {
      setShowTermsError(false);
    }
  };

  const isOnlinePayment = selectedPaymentMethod !== 'cod';

  return (
    <div className={`mb-6 md:mb-8 ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}>
      <h2 className="text-2xl font-semibold mb-3 md:mb-4 dark:text-gray-200">
        Payment Method
      </h2>

      <div className="space-y-3">
        {filteredPaymentMethods.map((method) => {
          const info = getPaymentMethodInfo(method);
          return (
            <label
              key={method}
              className={cn(
                "flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200",
                selectedPaymentMethod === method
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              )}
            >
              <input
                type="radio"
                name="payment_method"
                value={method}
                checked={selectedPaymentMethod === method}
                onChange={() => handlePaymentMethodChange(method)}
                disabled={isDisabled}
                className="mr-3 text-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center flex-1">
                <span className="text-2xl mr-3">{info.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {info.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {info.description}
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Terms and Conditions for non-COD payments */}
      {isOnlinePayment && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={isAceeptTermsAndCondition}
                onCheckedChange={handleTermsChange}
                disabled={isDisabled}
              />
              <div className="space-y-1">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300"
                >
                  I agree to the Terms and Conditions
                </label>
                <p className="text-xs text-muted-foreground">
                  By placing this order, you agree to our{" "}
                  <a href="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
            {showTermsError && (
              <p className="text-sm text-red-500 dark:text-red-400">
                You must accept the terms and conditions to proceed with online payment
              </p>
            )}
          </div>
        </div>
      )}

      {filteredPaymentMethods.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No payment methods available for your selected location
        </div>
      )}
    </div>
  );
}