import React, { useState } from "react";
import { Tag, Check, AlertCircle } from "lucide-react";
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
  name: string;
  type: string;
  icon: string;
  description: string;
  enabled: boolean;
  fee: number;
  fee_type: string;
}

interface PromoCode {
  promo_code: string;
  type: string;
  amount: number;
  discount_amount: number;
  applicable: boolean;
  message: string;
}

interface CheckoutContent1Props {
  settings?: {
    layout?: "two-column" | "single-column";
    stickyOrderSummary?: boolean;
    showPromoCode?: boolean;
    showPaymentMethods?: boolean;
    currency?: string;
  };
  orderItems?: OrderItem[];
  deliveryOptions?: DeliveryOption[];
  paymentMethods?: PaymentMethod[];
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  currency?: string;
}

const CheckoutContent1: React.FC<CheckoutContent1Props> = ({
  settings = {},
  orderItems = [],
  deliveryOptions = [],
  paymentMethods = [],
  customerInfo,
  currency = "BDT",
}) => {
  const {
    layout = "two-column",
    stickyOrderSummary = true,
    showPromoCode = true,
    showPaymentMethods = true,
  } = settings;

  const [selectedDelivery, setSelectedDelivery] = useState<string>(
    deliveryOptions.find((opt) => opt.enabled)?.id || ""
  );
  const [selectedPayment, setSelectedPayment] = useState<string>(
    paymentMethods.find((pm) => pm.enabled)?.id || ""
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const deliveryFee =
    deliveryOptions.find((opt) => opt.id === selectedDelivery)?.fee || 0;
  const paymentFee =
    paymentMethods.find((pm) => pm.id === selectedPayment)?.fee || 0;
  const discount = appliedPromo?.discount_amount || 0;
  const total = subtotal + deliveryFee + paymentFee - discount;

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

  return (
    <section className="py-8 bg-linear-to-b from-white via-violet-50/30 to-blue-50/20">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        <div
          className={cn(
            "grid gap-8",
            layout === "two-column" ? "lg:grid-cols-3" : "lg:grid-cols-1"
          )}
        >
          {/* Left Column - Checkout Form */}
          <div className={cn(layout === "two-column" ? "lg:col-span-2" : "")}>
            {/* Customer Information */}
            <div className="bg-white rounded-xl border border-violet-200/60 p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-violet-600"
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
                Customer Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={customerInfo?.name || ""}
                    placeholder="John Doe"
                    className="border-violet-200/60 focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={customerInfo?.phone || ""}
                    placeholder="+8801712345678"
                    className="border-violet-200/60 focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={customerInfo?.email || ""}
                    placeholder="john@example.com"
                    className="border-violet-200/60 focus:border-violet-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <Input
                    type="text"
                    value={customerInfo?.address || ""}
                    placeholder="House 123, Road 45, Dhanmondi, Dhaka"
                    className="border-violet-200/60 focus:border-violet-400"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl border border-violet-200/60 p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
                Delivery Method
              </h2>
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDelivery(option.id)}
                    disabled={!option.enabled}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-all text-left",
                      selectedDelivery === option.id
                        ? "border-violet-500 bg-violet-50/50"
                        : "border-gray-200 hover:border-violet-300 bg-white",
                      !option.enabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {option.name}
                          </h3>
                          {selectedDelivery === option.id && (
                            <Check className="w-5 h-5 text-violet-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                        <p className="text-xs text-violet-600 mt-1 font-medium">
                          {option.delivery_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {currency} {option.fee.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            {showPaymentMethods && (
              <div className="bg-white rounded-xl border border-violet-200/60 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-violet-600"
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
                  Payment Method
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      disabled={!method.enabled}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        selectedPayment === method.id
                          ? "border-violet-500 bg-violet-50/50"
                          : "border-gray-200 hover:border-violet-300 bg-white",
                        !method.enabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                          <span className="text-xl">
                            {method.id === "bkash"
                              ? "💳"
                              : method.id === "cod"
                              ? "💵"
                              : "💰"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {method.name}
                          </h3>
                          {method.fee > 0 && (
                            <p className="text-xs text-gray-600">
                              +{currency} {method.fee}
                            </p>
                          )}
                        </div>
                        {selectedPayment === method.id && (
                          <Check className="w-5 h-5 text-violet-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {method.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className={cn(layout === "two-column" ? "lg:col-span-1" : "")}>
            <div
              className={cn(
                "bg-white rounded-xl border border-violet-200/60 p-6 shadow-sm",
                stickyOrderSummary && "lg:sticky lg:top-24"
              )}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {item.product_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-gray-900">
                        {currency} {item.line_total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              {showPromoCode && (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter promo code"
                        disabled={!!appliedPromo}
                        className="pl-9 border-violet-200/60 focus:border-violet-400"
                      />
                    </div>
                    {appliedPromo ? (
                      <button
                        onClick={handleRemovePromo}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoCode.trim()}
                        className="px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
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
              <div className="space-y-2 py-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {currency} {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-900">
                    {currency} {deliveryFee.toLocaleString()}
                  </span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Fee</span>
                    <span className="font-medium text-gray-900">
                      {currency} {paymentFee.toLocaleString()}
                    </span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -{currency} {discount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {currency} {total.toLocaleString()}
                </span>
              </div>

              {/* Place Order Button */}
              <button className="w-full py-4 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-xl text-base font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl shadow-violet-500/30">
                Place Order
              </button>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutContent1;
