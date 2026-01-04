/**
 * Landing Product Showcase 2
 * Product info with buy now CTA
 */

"use client";

import React from "react";
import Image from "next/image";

interface LandingProductShowcase2Settings {
  title?: string;
  subtitle?: string;
  description?: string;
  showPrice?: boolean;
  showOriginalPrice?: boolean;
  showDiscount?: boolean;
  showStock?: boolean;
  buttonText?: string;
  buttonLink?: string;
  layout?: "centered" | "left" | "right";
  backgroundColor?: string;
  titleColor?: string;
  priceColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  fontFamily?: string;
  viewMode?: "desktop" | "tablet" | "mobile" | null;
}

interface ProductData {
  title?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  image?: string;
  currency?: string;
}

interface LandingProductShowcase2Props {
  settings: LandingProductShowcase2Settings;
  product?: ProductData;
  onScrollToCheckout?: () => void;
}

export default function LandingProductShowcase2({
  settings,
  product,
  onScrollToCheckout,
}: LandingProductShowcase2Props) {
  const {
    title = "Order Now & Save",
    subtitle = "Limited time offer",
    description = "Get your product today with free shipping!",
    showPrice = true,
    showOriginalPrice = true,
    showDiscount = true,
    showStock = true,
    buttonText = "Buy Now",
    buttonLink = "checkout",
    layout = "centered",
    backgroundColor = "#F9FAFB",
    titleColor = "#111827",
    priceColor = "#DC2626",
    buttonBgColor = "#DC2626",
    buttonTextColor = "#FFFFFF",
    fontFamily = "inherit",
  } = settings;

  // Default product data for preview
  const defaultProduct: ProductData = {
    title: "Premium Product",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    stock: 15,
    currency: "$",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  };

  const productData = product || defaultProduct;
  const currency = productData.currency || "$";

  const handleButtonClick = () => {
    if (buttonLink === "checkout" && onScrollToCheckout) {
      onScrollToCheckout();
    } else if (buttonLink && buttonLink.startsWith("http")) {
      window.open(buttonLink, "_blank");
    } else if (buttonLink) {
      const element = document.getElementById(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const alignmentClass =
    layout === "left"
      ? "text-left items-start"
      : layout === "right"
      ? "text-right items-end"
      : "text-center items-center";

  return (
    <section
      id="buy-now"
      className="py-16 px-4"
      style={{ backgroundColor, fontFamily }}
    >
      <div className={`max-w-4xl mx-auto flex flex-col ${alignmentClass}`}>
        {/* Discount Badge */}
        {showDiscount && productData.discount && (
          <div className="inline-block mb-4 px-4 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
            {productData.discount}% OFF
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            {subtitle}
          </p>
        )}

        {/* Title */}
        {title && (
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-lg mb-6 max-w-2xl">{description}</p>
        )}

        {/* Product Image (for mobile) */}
        {productData.image && (
          <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden md:hidden">
            <Image
              src={productData.image}
              alt={productData.title || "Product"}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Price Section */}
        {showPrice && productData.price && (
          <div className="flex items-center gap-4 mb-6 flex-wrap justify-center">
            <span
              className="text-4xl md:text-5xl font-bold"
              style={{ color: priceColor }}
            >
              {currency}
              {productData.price.toFixed(2)}
            </span>
            {showOriginalPrice && productData.originalPrice && (
              <span className="text-2xl text-gray-400 line-through">
                {currency}
                {productData.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {/* Stock Status */}
        {showStock && productData.stock !== undefined && (
          <p
            className={`text-sm mb-6 ${
              productData.stock > 10
                ? "text-green-600"
                : productData.stock > 0
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {productData.stock > 10
              ? "✓ In Stock"
              : productData.stock > 0
              ? `⚠ Only ${productData.stock} left in stock`
              : "✗ Out of Stock"}
          </p>
        )}

        {/* Buy Button */}
        {buttonText && (
          <button
            onClick={handleButtonClick}
            className="px-12 py-4 text-xl font-bold rounded-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: buttonBgColor,
              color: buttonTextColor,
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
}
