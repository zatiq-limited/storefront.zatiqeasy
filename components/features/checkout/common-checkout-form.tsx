"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCartStore, useCheckoutStore, useShopStore } from "@/stores";
import { useCartTotals } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactSection } from "./contact-section";
import { ShippingAddressSection } from "./shipping-address-section";
import { DeliveryZoneSection } from "./delivery-zone-section";
import { PaymentOptionsSection } from "./payment-options-section";
import { OrderSummarySection } from "./order-summary-section";
import { createOrder } from "@/lib/payments/api";
import { PaymentType, OrderStatus } from "@/lib/payments/types";
import { validatePhoneNumber } from "@/lib/payments/utils";

interface CommonCheckoutFormProps {
  className?: string;
  onSubmit?: (orderData: any) => void;
}

export function CommonCheckoutForm({
  className,
  onSubmit,
}: CommonCheckoutFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Get shop details
  const shopDetails = useShopStore((state) => state.shopDetails);

  // Get cart data
  const { products, totalPrice } = useCartTotals();
  const cartProducts = Object.values(products);

  // Checkout state
  const {
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedDeliveryZone,
    selectedPaymentMethod,
    acceptedTerms,
    discountAmount,
  } = useCheckoutStore();

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

  // Form values
  const formValues = watch();

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
  const grandTotal = totalPrice + deliveryCharge + taxAmount - discountAmount;

  // Check if full online payment is required
  const isFullOnlinePayment = selectedPaymentMethod !== "cod";

  // Get pay now amount
  const getPayNowAmount = () => {
    if (selectedPaymentMethod === "cod") return 0;
    return grandTotal;
  };

  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setValue(field, value);
  };

  // Handle promo code apply
  const handlePromoCodeApply = async () => {
    if (!promoCodeSearch) return;

    setIsPromoLoading(true);
    try {
      // API call for promo code validation can be added here
      setPromoCodeMessage("Promo code applied successfully!");
    } catch (error) {
      setPromoCodeMessage("Invalid promo code");
    } finally {
      setIsPromoLoading(false);
    }
  };

  // Clear terms error when payment method changes to COD or terms are accepted
  useEffect(() => {
    if (selectedPaymentMethod === "cod" || isAceeptTermsAndCondition) {
      setShowTermsError(false);
    }
  }, [selectedPaymentMethod, isAceeptTermsAndCondition]);

  // Handle form submission with phone verification check
  const handleFormSubmit = async (data: any) => {
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
      if (!fullPhoneNumber || !data.customer_name || !data.customer_address) {
        throw new Error("Please fill in all required fields");
      }

      if (!validatePhoneNumber(fullPhoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      if (cartProducts.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Prepare order items
      const receiptItems = cartProducts.map((item) => ({
        name: item.name,
        price: item.price * item.qty,
        image_url: item.image_url,
        inventory_id: item.id,
        qty: item.qty,
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
        customer_phone: fullPhoneNumber,
        customer_address: data.customer_address,
        delivery_charge: deliveryCharge,
        tax_amount: taxAmount,
        total_amount: grandTotal,
        payment_type: paymentMethodToType(selectedPaymentMethod || "cod"),
        pay_now_amount: getPayNowAmount(),
        receipt_items: receiptItems,
        type: "Online" as const,
        status: OrderStatus.ORDER_PLACED,
        note: data.order_note || "",
      };

      // Create order
      const response = await createOrder(orderPayload);

      if (response.success && response.data) {
        // Clear cart
        useCartStore.getState().clearCart();

        // Handle payment redirect
        if (response.data.payment_url) {
          window.location.replace(response.data.payment_url);
        } else if (response.data.receipt_url) {
          window.location.href = `/receipt/${response.data.receipt_id}`;
        } else {
          window.location.href = `/receipt/${response.data.receipt_id}`;
        }
      } else {
        throw new Error(response.error || "Failed to create order");
      }

      if (onSubmit) {
        await onSubmit(orderPayload);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for locations (should be fetched from API)
  const divisions = [
    { id: 1, name: "Dhaka" },
    { id: 2, name: "Chattogram" },
    { id: 3, name: "Khulna" },
    { id: 4, name: "Rajshahi" },
    { id: 5, name: "Sylhet" },
    { id: 6, name: "Barishal" },
    { id: 7, name: "Rangpur" },
    { id: 8, name: "Mymensingh" },
  ];

  const districts = [
    { id: 1, division_id: 1, name: "Dhaka" },
    { id: 2, division_id: 1, name: "Gazipur" },
    { id: 3, division_id: 1, name: "Narayanganj" },
  ];

  const upazilas = [
    { id: 1, district_id: 1, name: "Dhanmondi" },
    { id: 2, district_id: 1, name: "Mirpur" },
    { id: 3, district_id: 1, name: "Uttara" },
  ];

  // Mock profile data
  const profile = {
    payment_methods: shopDetails?.payment_methods || [
      "cod",
      "bkash",
      "nagad",
      "aamarpay",
    ],
    specific_delivery_charges: [],
    self_mfs: null,
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="container flex flex-col lg:flex-row justify-center gap-6 lg:gap-8"
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
          validPhoneNumber={validatePhoneNumber(fullPhoneNumber)}
          selectedCountryCode={selectedCountryCode}
          needPhoneVerification={order_verification_enabled || false}
          onCountryCodeChange={setSelectedCountryCode}
          onPhoneVerificationChange={(verified) => {
            setIsPhoneVerified(verified);
            if (verified) {
              setShowPhoneVerificationError(false);
            }
          }}
          shopId={shopDetails?.id?.toString() || "1"}
          fullPhoneNumber={fullPhoneNumber}
          onPhoneNumberChange={setFullPhoneNumber}
          profile={profile}
        />

        <ShippingAddressSection
          register={register}
          errors={errors}
          setValue={setValue}
          country_code={country_code}
          delivery_option={delivery_option}
          divisions={divisions}
          districts={districts}
          upazilas={upazilas}
          selectedDivision={selectedDivision}
          selectedDistrict={selectedDistrict}
          selectedUpazila={selectedUpazila}
          shopLanguage={shopLanguage}
          isDisabled={order_verification_enabled && !isPhoneVerified}
        />

        <DeliveryZoneSection
          country_code={country_code}
          delivery_option={delivery_option}
          specificDeliveryCharges={profile.specific_delivery_charges}
          selectedSpecificDeliveryZone={selectedDeliveryZone}
          setSelectedSpecificDeliveryZone={(zone) => {
            useCheckoutStore.getState().setSelectedDeliveryZone(zone);
          }}
          isDisabled={order_verification_enabled && !isPhoneVerified}
        />

        <PaymentOptionsSection
          paymentMethods={profile?.payment_methods || []}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={(method) => {
            useCheckoutStore.getState().setSelectedPaymentMethod(method);
          }}
          register={register}
          errors={errors}
          profile={profile}
          isAceeptTermsAndCondition={isAceeptTermsAndCondition}
          setIsAceeptTermsAndCondition={setIsAceeptTermsAndCondition}
          showTermsError={showTermsError}
          setShowTermsError={setShowTermsError}
          isDisabled={order_verification_enabled && !isPhoneVerified}
          selectedDeliveryZone={selectedDeliveryZone}
          selectedDistrict={selectedDistrict}
          deliveryOption={delivery_option}
        />
      </div>

      {/* Right section - Order Summary */}
      <div className="flex-1 basis-full lg:basis-1/3">
        <OrderSummarySection
          totalPrice={totalPrice}
          discountAmount={discountAmount}
          totaltax={taxAmount}
          deliveryCharge={deliveryCharge}
          grandTotal={grandTotal}
          country_currency={country_currency}
          profile={profile}
          promoCodeSearch={promoCodeSearch}
          setPromoCodeSearch={setPromoCodeSearch}
          promoCodeMessage={promoCodeMessage}
          isPromoLoading={isPromoLoading}
          isLoading={isLoading}
          shopId={shopDetails?.id?.toString() || "1"}
          promoCodeMutate={handlePromoCodeApply}
          isFullOnlinePayment={isFullOnlinePayment}
          handleChange={handleChange}
          getPayNowAmount={getPayNowAmount}
          selectedPaymentMethod={selectedPaymentMethod}
          isAceeptTermsAndCondition={isAceeptTermsAndCondition}
          setIsAceeptTermsAndCondition={setIsAceeptTermsAndCondition}
          products={products}
          register={register}
          showTermsError={showTermsError}
          setShowTermsError={setShowTermsError}
          isDisabled={order_verification_enabled && !isPhoneVerified}
        />
      </div>
    </form>
  );
}
