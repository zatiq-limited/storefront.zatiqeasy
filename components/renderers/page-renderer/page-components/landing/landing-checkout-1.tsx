/**
 * Landing Checkout 1
 * Embedded checkout form with product summary
 */

"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number;
}

interface ProductData {
  title?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  variants?: Variant[];
  currency?: string;
}

interface LandingCheckout1Settings {
  title?: string;
  subtitle?: string;
  showProductSummary?: boolean;
  showQuantitySelector?: boolean;
  showVariantSelector?: boolean;
  requirePhone?: boolean;
  requireAddress?: boolean;
  showCouponField?: boolean;
  showOrderNotes?: boolean;
  submitButtonText?: string;
  backgroundColor?: string;
  titleColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  accentColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface LandingCheckout1Props {
  settings: LandingCheckout1Settings;
  product?: ProductData;
  onSubmit?: (orderData: OrderData) => Promise<void>;
}

interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  quantity: number;
  variant?: string;
  coupon?: string;
  notes?: string;
}

export interface LandingCheckout1Ref {
  scrollToCheckout: () => void;
}

const LandingCheckout1 = forwardRef<LandingCheckout1Ref, LandingCheckout1Props>(
  ({ settings, product, onSubmit }, ref) => {
    const {
      title = "Complete Your Order",
      subtitle = "Fill in your details below",
      showProductSummary = true,
      showQuantitySelector = true,
      showVariantSelector = true,
      requirePhone = true,
      requireAddress = true,
      showCouponField = true,
      showOrderNotes = true,
      submitButtonText = "Place Order",
      backgroundColor = "#FFFFFF",
      titleColor = "#111827",
      buttonBgColor = "#10B981",
      buttonTextColor = "#FFFFFF",
      accentColor = "#10B981",
      fontFamily = "inherit",
    } = settings;

    // Default product for preview
    const defaultProduct: ProductData = {
      title: "Premium Product",
      price: 79.99,
      originalPrice: 99.99,
      currency: "$",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      variants: [
        { id: "v1", name: "Size", value: "Small" },
        { id: "v2", name: "Size", value: "Medium" },
        { id: "v3", name: "Size", value: "Large" },
      ],
    };

    const productData = product || defaultProduct;
    const currency = productData.currency || "$";

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState("");
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      coupon: "",
      notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useImperativeHandle(ref, () => ({
      scrollToCheckout: () => {
        const element = document.getElementById("checkout-form");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    }));

    const handleQuantityChange = (delta: number) => {
      setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const orderData: OrderData = {
        ...formData,
        quantity,
        variant: selectedVariant,
      };

      try {
        if (onSubmit) {
          await onSubmit(orderData);
        }
        setSubmitSuccess(true);
      } catch (error) {
        console.error("Order submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const totalPrice = (productData.price || 0) * quantity;

    if (submitSuccess) {
      return (
        <section
          id="checkout-form"
          className="py-16 px-4"
          style={{ backgroundColor, fontFamily }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>
          </div>
        </section>
      );
    }

    return (
      <section
        id="checkout-form"
        className="py-16 px-4"
        style={{ backgroundColor, fontFamily }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Summary */}
            {showProductSummary && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                {/* Product Info */}
                <div className="flex gap-4 mb-6">
                  {productData.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={productData.image}
                        alt={productData.title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{productData.title}</p>
                    <p className="text-gray-600">
                      {currency}
                      {productData.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Variant Selector */}
                {showVariantSelector && productData.variants && productData.variants.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Select Option
                    </label>
                    <select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                      style={{ ["--tw-ring-color" as string]: accentColor }}
                    >
                      <option value="">Choose an option</option>
                      {productData.variants.map((variant) => (
                        <option key={variant.id} value={variant.value}>
                          {variant.value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                {showQuantitySelector && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      {currency}
                      {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: accentColor }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                />
              </div>

              {requirePhone && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  />
                </div>
              )}

              {requireAddress && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                      />
                    </div>
                  </div>
                </>
              )}

              {showCouponField && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  />
                </div>
              )}

              {showOrderNotes && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Order Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 resize-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-lg font-bold rounded-lg transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
              >
                {isSubmitting ? "Processing..." : submitButtonText}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
);

LandingCheckout1.displayName = "LandingCheckout1";

export default LandingCheckout1;
