"use client";

import { useRouter } from "next/navigation";
import { useCartTotals } from "@/hooks";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { CartItem, CartSummary } from "../cart-management-modal";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
  position?: "right" | "left";
}

export function CartSidebar({
  isOpen,
  onClose,
  onCheckout,
  position = "right",
}: CartSidebarProps) {
  const router = useRouter();

  // Get cart totals using the custom hook (prevents infinite loop)
  const { products } = useCartTotals();

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
    onClose();
  };

  // Convert to array for rendering
  const cartProducts = Object.values(products);

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 overflow-hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      {isOpen && (
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "absolute top-0 h-full w-full max-w-md bg-background shadow-xl transition-transform duration-300 ease-in-out",
          position === "right" ? "right-0" : "left-0",
          isOpen
            ? "translate-x-0"
            : position === "right"
            ? "translate-x-full"
            : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-0">
                {cartProducts.map((product) => (
                  <CartItem
                    key={product.cartId}
                    product={product}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartProducts.length > 0 && (
            <>
              <Separator />
              <div className="p-4 space-y-4">
                <CartSummary
                  showCheckoutButton={true}
                  onCheckout={handleCheckout}
                  showDeliveryCharge={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
