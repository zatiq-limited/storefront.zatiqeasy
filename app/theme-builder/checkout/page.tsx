/**
 * ========================================
 * THEME BUILDER - CHECKOUT PAGE
 * ========================================
 *
 * Renders the checkout page using theme builder's published sections.
 * Currently uses the default checkout implementation with optional style overrides.
 * 
 * TODO: Create CheckoutPageRenderer for full customization
 */

"use client";

import Link from "next/link";
import { useThemeBuilder } from "@/hooks/useThemeBuilder";
import { ArrowLeft, Shield, Truck, RefreshCw } from "lucide-react";
import { CommonCheckoutForm } from "@/components/features/checkout";

export default function ThemeBuilderCheckoutPage() {
  const { checkoutPage, isLoading: isThemeLoading } = useThemeBuilder();

  // Loading state
  if (isThemeLoading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </main>
    );
  }

  // Get custom settings from theme builder if available
  const sections = checkoutPage?.data?.sections || [];
  const checkoutSettings = sections.find(s => s.type?.includes('checkout'))?.settings || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/theme-builder/cart"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">
            {(checkoutSettings.page_title as string) || "Checkout"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {(checkoutSettings.page_subtitle as string) || "Complete your order details below"}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">
                {(checkoutSettings.badge1_title as string) || "Secure Payment"}
              </div>
              <div className="text-xs text-muted-foreground">
                {(checkoutSettings.badge1_description as string) || "Your payment information is safe and encrypted"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">
                {(checkoutSettings.badge2_title as string) || "Fast Delivery"}
              </div>
              <div className="text-xs text-muted-foreground">
                {(checkoutSettings.badge2_description as string) || "Quick and reliable delivery"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">
                {(checkoutSettings.badge3_title as string) || "Easy Returns"}
              </div>
              <div className="text-xs text-muted-foreground">
                {(checkoutSettings.badge3_description as string) || "Hassle-free return policy on all orders"}
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <CommonCheckoutForm />

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Need help? Contact our support team at{" "}
            <a
              href="tel:+8801234567890"
              className="text-primary hover:underline"
            >
              +880 1234 567 890
            </a>
          </p>
          <p>
            By placing this order, you agree to our{" "}
            <Link href="/theme-builder/privacy-policy" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/theme-builder/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
