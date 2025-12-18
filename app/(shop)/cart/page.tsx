"use client";

import Link from "next/link";
import { useCartStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { CartItem, CartSummary } from "@/components/cart";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const cartProducts = useCartStore(selectCartProducts);

  if (cartProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/shop">
              <Button size="lg" className="w-full max-w-xs">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-0">
            {cartProducts.map((product) => (
              <CartItem
                key={product.cartId}
                product={product}
                showImage={true}
                showVariants={true}
                compact={false}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <CartSummary
                  showCheckoutButton={true}
                  checkoutButtonLabel="Proceed to Checkout"
                  onCheckout={() => {
                    window.location.href = "/checkout";
                  }}
                  showDeliveryCharge={false}
                />
              </div>

              <div className="space-y-4">
                <Link href="/shop">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}