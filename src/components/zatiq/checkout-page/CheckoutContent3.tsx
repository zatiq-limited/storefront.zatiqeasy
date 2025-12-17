import React, { useState } from "react";
import { Check, AlertCircle, Tag, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_code?: string;
  image_url: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  variant?: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  delivery_time: string;
  fee: number;
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  gateway_mode: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  enabled: boolean;
  fee: number;
  fee_type: string;
  // Self MFS specific fields
  mfs_provider?: string;
  mfs_type?: string;
  mfs_phone?: string;
  mfs_instruction?: string;
  mfs_qr_image_url?: string;
}

interface PromoCode {
  promo_code: string;
  type: string;
  amount: number;
  discount_amount: number;
  applicable: boolean;
  message: string;
}

interface Product {
  id: number;
  handle?: string;
  name: string;
  image_url: string;
  images?: { url: string; alt?: string }[];
  price: number;
  compare_at_price?: number;
  description?: string;
  short_description?: string;
}

interface CheckoutContent3Props {
  settings?: {
    showPromoCode?: boolean;
    showOrderNotes?: boolean;
    currency?: string;
  };
  orderItems?: OrderItem[];
  product?: Product;
  deliveryOptions?: DeliveryOption[];
  paymentMethods?: PaymentMethod[];
  currency?: string;
}

const CheckoutContent3: React.FC<CheckoutContent3Props> = ({
  settings = {},
  orderItems = [],
  product,
  deliveryOptions = [],
  paymentMethods = [],
  currency = "BDT",
}) => {
  const { showPromoCode = true, showOrderNotes = true } = settings;
  const [quantity, setQuantity] = useState(1);

  const [selectedDelivery, setSelectedDelivery] = useState<string>(
    deliveryOptions.find((opt) => opt.enabled)?.id || ""
  );
  const [selectedPayment, setSelectedPayment] = useState<string>(
    paymentMethods.find((pm) => pm.enabled)?.id || ""
  );
  const [promoCode, setPromoCode] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // If product is provided (single product page), create order item from it
  const effectiveOrderItems: OrderItem[] =
    product && orderItems.length === 0
      ? [
          {
            product_id: product.id,
            product_name: product.name,
            image_url: product.image_url || product.images?.[0]?.url || "",
            quantity: quantity,
            unit_price: product.price,
            line_total: product.price * quantity,
          },
        ]
      : orderItems;

  // Self MFS payment fields
  const [paymentPhone, setPaymentPhone] = useState("");
  const [trxId, setTrxId] = useState("");

  // Get the selected payment method details
  const selectedPaymentMethod = paymentMethods.find(
    (pm) => pm.id === selectedPayment
  );

  // Calculate totals
  const subtotal = effectiveOrderItems.reduce(
    (sum, item) => sum + item.line_total,
    0
  );
  const deliveryFee =
    deliveryOptions.find((opt) => opt.id === selectedDelivery)?.fee || 0;
  const discount = appliedPromo?.discount_amount || 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError("");

    try {
      // Call API to validate promo code
      const apiUrl = process.env.PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(
        `${apiUrl}/api/promo-code?code=${promoCode}`
      );
      const data = await response.json();

      if (data.success && data.data.promo_code.applicable) {
        setAppliedPromo(data.data.promo_code);
        setPromoError("");
      } else {
        setPromoError(data.data.promo_code.message || "Invalid promo code");
        setAppliedPromo(null);
      }
    } catch (error) {
      console.error("Promo code error:", error);
      setPromoError("Failed to apply promo code");
      setAppliedPromo(null);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  // Payment method icons
  const getPaymentIcon = (method: PaymentMethod) => {
    const gatewayMode = method.gateway_mode;
    const iconBasePath = "/assets/icons/payment-gateway";

    if (gatewayMode === "bkash") {
      return (
        <img
          src={`${iconBasePath}/bKash-icon.svg`}
          alt="bKash"
          className="h-6 w-auto"
        />
      );
    }
    if (gatewayMode === "cod") {
      return (
        <img
          src={`${iconBasePath}/cod-icon.svg`}
          alt="Cash on Delivery"
          className="h-6 w-auto"
        />
      );
    }
    if (gatewayMode === "nagad") {
      return (
        <img
          src={`${iconBasePath}/nagad-icon.svg`}
          alt="Nagad"
          className="h-6 w-auto"
        />
      );
    }
    if (gatewayMode === "self_mfs") {
      return (
        <img
          src={`${iconBasePath}/self-mfs-icon.svg`}
          alt="Self MFS"
          className="h-6 w-auto"
        />
      );
    }
    if (gatewayMode === "zatiq_seller_pay") {
      return (
        <img
          src={`${iconBasePath}/seller-pay-icon.svg`}
          alt="Zatiq Secure Purchase"
          className="h-6 w-auto"
        />
      );
    }
    if (gatewayMode === "aamarpay" || method.type === "card") {
      return (
        <div className="flex items-center gap-1">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-4"
          />
        </div>
      );
    }
    return null;
  };

  // Card style for desktop
  const cardStyle =
    "lg:bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:p-6 lg:shadow-sm";

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Shipping Section */}
            <div className={cardStyle}>
              {/* Contact Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 hidden lg:block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Contact
                </h2>
                <div className="flex gap-3 items-center">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="flex-1 h-11 border-gray-300"
                  />
                  <span className="text-gray-400 text-sm">Or</span>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    className="flex-1 h-11 border-gray-300"
                  />
                </div>
              </div>

              {/* Shipping Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 hidden lg:block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Shipping
                </h2>
                <div className="space-y-4">
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Country*
                    </label>
                    <div className="relative">
                      <select className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none cursor-pointer">
                        <option value="BD">Bangladesh</option>
                      </select>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        🇧🇩
                      </span>
                      <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* District & Thana */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <select className="w-full h-11 px-4 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer">
                        <option value="">Select</option>
                        <option value="dhaka">Dhaka</option>
                        <option value="chittagong">Chittagong</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thana
                      </label>
                      <select className="w-full h-11 px-4 border border-gray-300 rounded-md bg-white text-gray-500 appearance-none cursor-pointer">
                        <option value="">Select</option>
                      </select>
                    </div>
                  </div>

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter Name"
                        className="h-11 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="h-11 border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address*
                    </label>
                    <Input
                      type="text"
                      placeholder="House number and street name etc"
                      className="h-11 border-gray-300"
                    />
                  </div>

                  {/* Town/City & Postcode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Town / City*
                      </label>
                      <Input
                        type="text"
                        placeholder="Town"
                        className="h-11 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode / ZIP (optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="Postcode"
                        className="h-11 border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone No*
                    </label>
                    <Input
                      type="tel"
                      placeholder="Phone no"
                      className="h-11 border-gray-300"
                    />
                  </div>

                  {/* Save Info Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">
                      Save this information for next time
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className={cardStyle}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 hidden lg:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Payment
              </h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {paymentMethods.map((method, index) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                      selectedPayment === method.id
                        ? "bg-blue-50"
                        : "bg-white hover:bg-gray-50",
                      index !== paymentMethods.length - 1 &&
                        "border-b border-gray-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {method.name}
                      </p>
                      {method.description && selectedPayment === method.id && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {method.description}
                        </p>
                      )}
                    </div>
                    {getPaymentIcon(method)}
                  </label>
                ))}
              </div>

              {/* Self MFS Details Section */}
              {selectedPaymentMethod?.gateway_mode === "self_mfs" && (
                <>
                  <div className="mt-4 border border-gray-200 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {selectedPaymentMethod.mfs_provider === "bkash" ? (
                        <img
                          src="/assets/icons/payment-gateway/bKash-icon.svg"
                          alt="bKash"
                          className="h-6 w-auto"
                        />
                      ) : selectedPaymentMethod.mfs_provider === "nagad" ? (
                        <img
                          src="/assets/icons/payment-gateway/nagad-icon.svg"
                          alt="Nagad"
                          className="h-6 w-auto"
                        />
                      ) : (
                        <img
                          src="/assets/icons/payment-gateway/self-mfs-icon.svg"
                          alt="Self MFS"
                          className="h-6 w-auto"
                        />
                      )}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {selectedPaymentMethod.mfs_type === "personal"
                          ? "Personal"
                          : "Merchant"}
                      </span>
                    </div>

                    {/* Phone Number */}
                    {selectedPaymentMethod.mfs_phone && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Send Money to:
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedPaymentMethod.mfs_phone}
                        </p>
                      </div>
                    )}

                    {/* Instructions */}
                    {selectedPaymentMethod.mfs_instruction && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Instructions:
                        </p>
                        <div className="text-sm text-gray-600 whitespace-pre-line bg-white p-3 rounded border border-gray-200">
                          {selectedPaymentMethod.mfs_instruction}
                        </div>
                      </div>
                    )}

                    {/* QR Code */}
                    {selectedPaymentMethod.mfs_qr_image_url && (
                      <div className="flex flex-col items-center">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <QrCode className="w-4 h-4" />
                          Scan QR Code
                        </p>
                        <img
                          src={selectedPaymentMethod.mfs_qr_image_url}
                          alt="QR Code"
                          className="w-32 h-32 object-contain border border-gray-200 rounded-lg bg-white p-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Phone and TrxID Input Fields */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Payment Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="h-11 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TrxID (Transaction ID){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. ABC123XYZ456"
                        className="h-11 border-gray-300"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Billing Address */}
            <div className={cardStyle}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Billing address
              </h2>
              <select className="w-full h-11 px-4 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none cursor-pointer">
                <option value="same">Same as shipping address</option>
                <option value="different">
                  Use a different billing address
                </option>
              </select>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-6">
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {effectiveOrderItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex gap-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product_name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500">{item.variant}</p>
                      )}
                      {/* Show quantity controls for single product */}
                      {product ? (
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: X{item.quantity}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        ৳{item.line_total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              {showPromoCode && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Do you have a promo code?
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        placeholder="Discount code / Promo code here"
                        disabled={!!appliedPromo}
                        className="pl-9 flex-1 h-10 border-gray-300 text-sm"
                      />
                    </div>
                    {appliedPromo ? (
                      <button
                        onClick={handleRemovePromo}
                        className="px-4 h-10 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoCode.trim()}
                        className="px-4 h-10 border border-blue-500 text-blue-500 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingPromo ? "..." : "Add"}
                      </button>
                    )}
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-green-700 flex-1">
                        {appliedPromo.message}
                      </p>
                    </div>
                  )}
                  {promoError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-700 flex-1">
                        {promoError}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal: {effectiveOrderItems.length}{" "}
                    {effectiveOrderItems.length === 1 ? "item" : "items"}
                  </span>
                  <span className="text-gray-900">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">
                      -৳{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {deliveryFee === 0
                      ? "FREE"
                      : `৳${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t border-gray-200">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 mr-1">{currency}</span>
                  <span className="text-xl font-bold text-gray-900">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Notes */}
              {showOrderNotes && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm text-gray-600 mb-2">
                    Order notes (optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Notes about your order (e.g special notes for delivery)"
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Pay Button */}
              <button className="w-full h-12 mt-6 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">
                Pay now
              </button>

              {/* Policy Links */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                <a
                  href="/refund-policy"
                  className="text-blue-600 hover:underline"
                >
                  Refund policy
                </a>
                <a
                  href="/shipping-policy"
                  className="text-blue-600 hover:underline"
                >
                  Shipping policy
                </a>
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy policy
                </a>
                <a
                  href="/terms-of-service"
                  className="text-blue-600 hover:underline"
                >
                  Terms of service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutContent3;
