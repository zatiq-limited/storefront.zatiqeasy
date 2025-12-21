import Link from "next/link";
import { ArrowLeft, Shield, Truck, RefreshCw } from "lucide-react";
import { CheckoutForm } from "@/features/checkout";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your order details below
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Secure Payment</div>
              <div className="text-xs text-muted-foreground">
                Your payment information is safe and encrypted
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Fast Delivery</div>
              <div className="text-xs text-muted-foreground">
                Quick and reliable delivery across Bangladesh
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Easy Returns</div>
              <div className="text-xs text-muted-foreground">
                Hassle-free return policy on all orders
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <CheckoutForm />

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Need help? Contact our support team at{" "}
            <a href="tel:+8801234567890" className="text-primary hover:underline">
              +880 1234 567 890
            </a>
          </p>
          <p>
            By placing this order, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}