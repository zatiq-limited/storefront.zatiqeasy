import React, { useState } from "react";
import { Tag, Check, AlertCircle, Package } from "lucide-react";
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

interface CheckoutContent2Props {
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

const CheckoutContent2: React.FC<CheckoutContent2Props> = ({
  settings = {},
  orderItems = [],
  deliveryOptions = [],
  paymentMethods = [],
  customerInfo,
  currency = "BDT",
}) => {
  const {
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
  const deliveryFee = deliveryOptions.find((opt) => opt.id === selectedDelivery)?.fee || 0;
  const paymentFee = paymentMethods.find((pm) => pm.id === selectedPayment)?.fee || 0;
  const discount = appliedPromo?.discount_amount || 0;
  const total = subtotal + deliveryFee + paymentFee - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError("");

    try {
      // Call API to validate promo code
      const apiUrl = process.env.PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/promo-code?code=${promoCode}`);
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
    <section className="py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 2xl:px-0">
        {/* Order Summary - Top Section */}
        <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <span className="ml-auto text-sm text-gray-500">{orderItems.length} items</span>
          </div>

          {/* Collapsible Order Items */}
          <details className="group mb-4">
            <summary className="cursor-pointer list-none flex items-center justify-between py-2 border-t border-b border-gray-200">
              <span className="font-medium text-gray-700">View items</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
              {orderItems.map((item) => (
                <div key={item.product_id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-white shrink-0 border border-gray-200">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{item.product_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-900">
                      {currency} {item.line_total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </details>

          {/* Promo Code */}
          {showPromoCode && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Have a promo code?</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    disabled={!!appliedPromo}
                    className="pl-9 border-blue-200 focus:border-blue-400 bg-white"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplyingPromo ? "..." : "Apply"}
                  </button>
                )}
              </div>
              {appliedPromo && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700 flex-1">{appliedPromo.message}</p>
                </div>
              )}
              {promoError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700 flex-1">{promoError}</p>
                </div>
              )}
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 py-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium text-gray-900">{currency} {deliveryFee.toLocaleString()}</span>
            </div>
            {paymentFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Fee</span>
                <span className="font-medium text-gray-900">{currency} {paymentFee.toLocaleString()}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">-{currency} {discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center py-4 border-t-2 border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {currency} {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <Input
                type="text"
                value={customerInfo?.name || ""}
                placeholder="John Doe"
                className="border-gray-300 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <Input
                type="tel"
                value={customerInfo?.phone || ""}
                placeholder="+8801712345678"
                className="border-gray-300 focus:border-blue-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <Input
                type="email"
                value={customerInfo?.email || ""}
                placeholder="john@example.com"
                className="border-gray-300 focus:border-blue-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address *</label>
              <Input
                type="text"
                value={customerInfo?.address || ""}
                placeholder="House 123, Road 45, Dhanmondi, Dhaka"
                className="border-gray-300 focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Method</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {deliveryOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedDelivery(option.id)}
                disabled={!option.enabled}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left relative",
                  selectedDelivery === option.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 bg-white",
                  !option.enabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {selectedDelivery === option.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 mb-1 pr-6">{option.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{option.delivery_time}</p>
                <p className="text-lg font-bold text-blue-600">
                  {currency} {option.fee.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        {showPaymentMethods && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  disabled={!method.enabled}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-center relative",
                    selectedPayment === method.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white",
                    !method.enabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {selectedPayment === method.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-2xl">{method.id === "bkash" ? "💳" : method.id === "cod" ? "💵" : "💰"}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs mb-1">{method.name}</h3>
                  {method.fee > 0 && (
                    <p className="text-xs text-gray-600">+{currency} {method.fee}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Place Order Button */}
        <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            Place Order - {currency} {total.toLocaleString()}
          </button>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure 256-bit SSL encrypted checkout</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutContent2;
