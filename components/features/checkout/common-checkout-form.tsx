"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCartStore, useCheckoutStore, useShopStore } from "@/stores";
import { useCartTotals } from "@/hooks";
import { ContactSection } from "./contact-section";
import { ShippingAddressSection } from "./shipping-address-section";
import { DeliveryZoneSection } from "./delivery-zone-section";
import { PaymentOptionsSection } from "./payment-options-section";
import { OrderSummarySection } from "./order-summary-section";
import { paymentService } from "@/lib/api";
import type { CheckoutFormData } from "@/types/checkout.types";
import type { ShopProfile } from "@/types/shop.types";
import type { Division, District, Upazila } from "@/types/shop.types";
import { PaymentType, OrderStatus } from "@/lib/payments/types";
import { validatePhoneNumberWithCountry } from "@/lib/utils/validation";
import { parsePhoneNumber, CountryCode } from "libphonenumber-js";
import { convertBanglaToLatin } from "@/lib/utils/bangla-to-latin";
import { toast } from "react-hot-toast";

interface ReceiptItem {
  name: string;
  inventory_id: number;
  quantity: number;
  price: number;
  total_price: number;
  image_url?: string;
  variants: Array<{
    variant_type_id: number;
    variant_id: number;
  }>;
}

interface OrderData {
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_charge: number;
  tax_amount: number;
  total_amount: number;
  payment_type: PaymentType;
  pay_now_amount: number;
  receipt_items: ReceiptItem[];
  type: "Online";
  status: OrderStatus;
  note: string;
}

interface CommonCheckoutFormProps {
  onSubmit?: (orderData: OrderData) => void;
}

export function CommonCheckoutForm({ onSubmit }: CommonCheckoutFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  // Get shop details
  const shopDetails = useShopStore((state) => state.shopDetails);

  // Get cart data
  const { products, totalPrice } = useCartTotals();
  const cartProducts = Object.values(products);

  // Checkout state from store (only used for selectedDivision/selectedDistrict)
  const { selectedDivision, selectedDistrict } = useCheckoutStore();

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [isAceeptTermsAndCondition, setIsAceeptTermsAndCondition] =
    useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneVerificationError, setShowPhoneVerificationError] =
    useState(false);
  const [promoCodeSearch, setPromoCodeSearch] = useState("");
  const [promoCodeMessage, setPromoCodeMessage] = useState("");
  const [isPromoLoading, setIsPromoLoading] = useState(false);
  const [fullPhoneNumber, setFullPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+880");
  const [selectedSpecificDeliveryZone, setSelectedSpecificDeliveryZone] =
    useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cod");
  const [discountAmount] = useState(0);

  // Location data state
  type LocationData = { id: number; name: string; bn_name: string };
  const [divisions, setDivisions] = useState<LocationData[]>([]);
  const [districts, setDistricts] = useState<Record<string, LocationData[]>>(
    {}
  );
  const [upazilas, setUpazilas] = useState<
    Record<string, Record<string, LocationData[]>>
  >({});

  // Constants
  const order_verification_enabled =
    shopDetails?.order_verification_enabled || false;
  const country_currency = shopDetails?.country_currency || "BDT";
  const country_code = shopDetails?.country_code || "BD";
  const delivery_option = shopDetails?.delivery_option || "inside_city";
  const shopLanguage = "en";

  // Delivery charge calculation
  const calculateDeliveryCharge = () => {
    const charges: Record<string, number> = {
      inside_city: 50,
      outside_city: 100,
      sub_city: 80,
    };
    return charges[delivery_option] || 100;
  };

  const deliveryCharge = calculateDeliveryCharge();
  const taxAmount = 0; // Can be implemented later
  const totaltax = taxAmount; // Alias to match old project
  const grandTotal = totalPrice + deliveryCharge + taxAmount - discountAmount;

  // Check if full online payment is required
  const isFullOnlinePayment = selectedPaymentMethod !== "cod";

  // Get pay now amount
  const getPayNowAmount = () => {
    if (selectedPaymentMethod === "cod") return 0;
    return grandTotal;
  };

  // Handle full online payment toggle (used by OrderSummarySection)
  const handleChange = (value: boolean) => {
    // This handles the full online payment checkbox toggle
    // The value represents whether full payment is selected
    console.log("Full online payment:", value);
  };

  // Handle promo code apply
  const handlePromoCodeApply = async (data: {
    shop_id: string;
    shop_promo_code: string;
  }) => {
    if (!data.shop_promo_code) return;

    setIsPromoLoading(true);
    try {
      // API call for promo code validation can be added here
      setPromoCodeMessage("Promo code applied successfully!");
    } catch (err) {
      console.error("Promo code error:", err);
      setPromoCodeMessage("Invalid promo code");
    } finally {
      setIsPromoLoading(false);
    }
  };

  // Fetch divisions/districts/upazilas data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch("/api/storefront/divisions");
        const data = await response.json();

        if (data.status && data.data) {
          // Process divisions
          const divisionsData = data.data.map((div: Division) => ({
            id: div.id,
            name: div.name,
            bn_name: div.bn_name,
          }));
          setDivisions(divisionsData);

          // Process districts grouped by division
          const districtsData: Record<string, LocationData[]> = {};
          data.data.forEach((div: Division) => {
            if (div.districts && Array.isArray(div.districts)) {
              districtsData[div.name] = div.districts.map((dist: District) => ({
                id: dist.id,
                name: dist.name,
                bn_name: dist.bn_name,
              }));
            }
          });
          setDistricts(districtsData);

          // Process upazilas grouped by division and district
          const upazilasData: Record<
            string,
            Record<string, LocationData[]>
          > = {};
          data.data.forEach((div: Division) => {
            upazilasData[div.name] = {};
            if (div.districts && Array.isArray(div.districts)) {
              div.districts.forEach((dist: District) => {
                if (dist.upazilas && Array.isArray(dist.upazilas)) {
                  upazilasData[div.name][dist.name] = dist.upazilas.map(
                    (upz: Upazila) => ({
                      id: upz.id,
                      name: upz.name,
                      bn_name: upz.bn_name,
                    })
                  );
                }
              });
            }
          });
          setUpazilas(upazilasData);
        }
      } catch (err) {
        console.error("Failed to fetch location data:", err);
      }
    };

    fetchLocationData();
  }, []);

  // Ensure mfs_provider is set in form data when self managed MFS is chosen
  useEffect(() => {
    const selfMfsData = shopDetails?.self_mfs;

    if (
      selectedPaymentMethod === "self_mfs" &&
      selfMfsData &&
      selfMfsData.mfs_provider
    ) {
      setValue("mfs_provider", selfMfsData.mfs_provider, {
        shouldDirty: true,
        shouldValidate: false,
      });
    } else {
      setValue("mfs_provider", "", {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [selectedPaymentMethod, setValue, shopDetails]);

  // Clear terms error when payment method changes to COD or terms are accepted
  useEffect(() => {
    if (selectedPaymentMethod === "cod" || isAceeptTermsAndCondition) {
      setShowTermsError(false);
    }
  }, [selectedPaymentMethod, isAceeptTermsAndCondition]);

  // Watch customer_phone and auto-validate to set fullPhoneNumber
  const customerPhone = watch("customer_phone");
  useEffect(() => {
    if (customerPhone && customerPhone.length >= 10) {
      try {
        const countryCode = selectedCountryCode.replace("+", "");
        const normalizedPhone = convertBanglaToLatin(customerPhone);
        const parsedNumber = parsePhoneNumber(
          normalizedPhone,
          (countryCode.length === 2 ? countryCode : "BD") as CountryCode
        );
        if (parsedNumber && parsedNumber.isValid()) {
          setFullPhoneNumber(parsedNumber.number);
        }
      } catch (error) {
        console.log("Phone parsing error:", error);
      }
    }
  }, [customerPhone, selectedCountryCode]);

  // Create a wrapper for phone validation that also sets fullPhoneNumber
  const validPhoneNumberWrapper = (
    phone: string,
    country: CountryCode
  ): boolean | string => {
    const result = validatePhoneNumberWithCountry(phone, country);

    // If validation passes, also update fullPhoneNumber
    if (result === true) {
      try {
        const countryCode = country.length > 2 ? country.slice(1, 3) : country;
        const normalizedPhoneNumber = convertBanglaToLatin(phone);
        const parsedNumber = parsePhoneNumber(
          normalizedPhoneNumber,
          countryCode as CountryCode
        );
        if (parsedNumber) {
          setFullPhoneNumber(parsedNumber.number);
        }
      } catch (error) {
        console.error("Error parsing phone number:", error);
      }
    }

    return result;
  };

  // Handle form submission with phone verification check
  const handleFormSubmit = async (data: CheckoutFormData) => {
    // Check if phone verification is required and not verified
    if (order_verification_enabled && !isPhoneVerified) {
      setShowPhoneVerificationError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Clear phone verification error if it was shown
    setShowPhoneVerificationError(false);

    // Check terms acceptance for non-COD payments
    if (selectedPaymentMethod !== "cod" && !isAceeptTermsAndCondition) {
      setShowTermsError(true);
      return;
    }

    setIsLoading(true);

    try {
      // Validate required fields
      // Use customer_phone from form data if fullPhoneNumber is not set
      const phoneToValidate = fullPhoneNumber || data.customer_phone;

      if (!phoneToValidate || !data.customer_name || !data.customer_address) {
        const missingFields = [];
        if (!phoneToValidate) missingFields.push("phone number");
        if (!data.customer_name) missingFields.push("name");
        if (!data.customer_address) missingFields.push("address");
        throw new Error(`Please fill in: ${missingFields.join(", ")}`);
      }

      if (cartProducts.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Prepare order items
      const receiptItems = cartProducts.map((item) => ({
        name: item.name,
        inventory_id: item.id,
        quantity: item.qty,
        price: item.price,
        total_price: item.price * item.qty,
        image_url: item.image_url,
        variants: item.selectedVariants
          ? Object.values(item.selectedVariants)
              .filter((v) => v?.variant_type_id && v?.variant_id)
              .map((v) => ({
                variant_type_id: v!.variant_type_id,
                variant_id: v!.variant_id,
              }))
          : [],
      }));

      // Payment type mapping
      const paymentMethodToType = (method: string): PaymentType => {
        const mapping: Record<string, PaymentType> = {
          cod: PaymentType.COD,
          bkash: PaymentType.BKASH,
          nagad: PaymentType.NAGAD,
          aamarpay: PaymentType.AAMARPAY,
          self_mfs: PaymentType.SELF_MFS,
        };
        return mapping[method] || PaymentType.COD;
      };

      // Create order payload
      const orderPayload = {
        shop_id: shopDetails?.id || 1,
        customer_name: data.customer_name,
        customer_phone: fullPhoneNumber || data.customer_phone,
        customer_address: data.customer_address,
        delivery_charge: deliveryCharge,
        tax_amount: taxAmount,
        total_amount: grandTotal,
        payment_type: paymentMethodToType(selectedPaymentMethod || "cod"),
        pay_now_amount: getPayNowAmount(),
        receipt_items: receiptItems,
        type: "Online" as const,
        status: OrderStatus.ORDER_PLACED,
        note: data.note || "",
      };

      // Create order
      const response = await paymentService.createOrder(orderPayload);

      if (response.success && response.data) {
        // Clear cart
        useCartStore.getState().clearCart();

        // Handle payment redirect (matching old project)
        if (response.data.payment_url) {
          // For online payment gateways
          window.location.replace(response.data.payment_url);
        } else if (response.data.receipt_url) {
          // For COD or completed payments - use receipt_url as the path
          window.location.href = `/receipt/${response.data.receipt_url}`;
        } else {
          // Fallback to receipt_id if receipt_url not available
          window.location.href = `/receipt/${response.data.receipt_id}`;
        }
      } else {
        throw new Error(response.error || "Failed to create order");
      }

      if (onSubmit) {
        await onSubmit(orderPayload);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Location data is now fetched from API via useEffect above

  // Use shop details as profile
  const profile = (shopDetails || {
    payment_methods: ["cod", "bkash", "nagad", "aamarpay"],
    specific_delivery_charges: {},
    self_mfs: null,
  }) as ShopProfile;

  // Shop ID
  const shopId = shopDetails?.id || 1;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="container flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 pt-6"
    >
      {/* Left section - Contact and Shipping Form */}
      <div className="flex-1 basis-full lg:basis-1/2 lg:pr-8 xl:pr-16">
        {/* Phone Verification Error */}
        {showPhoneVerificationError && order_verification_enabled && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Please verify your phone number before placing the order.
              </span>
            </div>
          </div>
        )}

        <ContactSection
          register={register}
          errors={errors}
          watch={watch}
          validPhoneNumber={validPhoneNumberWrapper}
          selectedCountryCode={selectedCountryCode}
          needPhoneVerification={order_verification_enabled || false}
          onCountryCodeChange={(code) => {
            setSelectedCountryCode(code);
            // Update full phone number when country code changes
            const phoneNumber = watch("customer_phone") || "";
            if (phoneNumber) {
              setFullPhoneNumber(code + phoneNumber);
            }
          }}
          onPhoneVerificationChange={(verified) => {
            setIsPhoneVerified(verified);
            if (verified) {
              setShowPhoneVerificationError(false);
            }
          }}
          shopId={shopId}
          fullPhoneNumber={fullPhoneNumber}
          profile={profile}
        />

        <ShippingAddressSection
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          country_code={country_code}
          delivery_option={delivery_option}
          divisions={divisions}
          districts={districts}
          upazilas={upazilas}
          selectedDivision={selectedDivision}
          selectedDistrict={selectedDistrict}
          shopLanguage={shopLanguage}
          isDisabled={order_verification_enabled && !isPhoneVerified}
        />

        <DeliveryZoneSection
          country_code={country_code}
          delivery_option={delivery_option}
          specificDeliveryCharges={profile.specific_delivery_charges}
          selectedSpecificDeliveryZone={selectedSpecificDeliveryZone}
          setSelectedSpecificDeliveryZone={setSelectedSpecificDeliveryZone}
          isDisabled={order_verification_enabled && !isPhoneVerified}
        />

        <PaymentOptionsSection
          paymentMethods={profile?.payment_methods || []}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          register={register}
          errors={errors}
          profile={profile}
          isAceeptTermsAndCondition={isAceeptTermsAndCondition}
          setIsAceeptTermsAndCondition={setIsAceeptTermsAndCondition}
          showTermsError={showTermsError}
          setShowTermsError={setShowTermsError}
          isDisabled={order_verification_enabled && !isPhoneVerified}
          selectedDeliveryZone={selectedSpecificDeliveryZone}
          selectedDistrict={selectedDistrict}
          deliveryOption={delivery_option}
        />
      </div>

      {/* Right section - Order Summary */}
      <div className="flex-1 basis-full lg:basis-1/3">
        <OrderSummarySection
          totalPrice={totalPrice}
          discountAmount={discountAmount}
          totaltax={totaltax}
          deliveryCharge={deliveryCharge}
          grandTotal={grandTotal}
          country_currency={country_currency}
          profile={profile}
          promoCodeSearch={promoCodeSearch}
          setPromoCodeSearch={setPromoCodeSearch}
          promoCodeMessage={promoCodeMessage}
          isPromoLoading={isPromoLoading}
          isLoading={isLoading}
          shopId={shopId}
          promoCodeMutate={handlePromoCodeApply}
          isFullOnlinePayment={isFullOnlinePayment}
          handleChange={handleChange}
          getPayNowAmount={getPayNowAmount}
          selectedPaymentMethod={selectedPaymentMethod}
          isAceeptTermsAndCondition={isAceeptTermsAndCondition}
          setIsAceeptTermsAndCondition={setIsAceeptTermsAndCondition}
          products={cartProducts}
          register={register}
          showTermsError={showTermsError}
          setShowTermsError={setShowTermsError}
          isDisabled={order_verification_enabled && !isPhoneVerified}
        />
      </div>
    </form>
  );
}
