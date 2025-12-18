"use client";

import { useCartStore } from "@/stores";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { Separator } from "@/components/ui/separator";

interface CartManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
  title?: string;
  showDeliveryCharge?: boolean;
  deliveryCharge?: number;
}

export function CartManagementModal({
  isOpen,
  onClose,
  onCheckout,
  title = "Shopping Cart",
  showDeliveryCharge = false,
  deliveryCharge = 0,
}: CartManagementModalProps) {
  const cartProducts = useCartStore(selectCartProducts);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {cartProducts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="space-y-0">
                  {cartProducts.map((product) => (
                    <CartItem
                      key={product.cartId}
                      product={product}
                    />
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4" />

              <CartSummary
                showCheckoutButton={!!onCheckout}
                onCheckout={onCheckout}
                showDeliveryCharge={showDeliveryCharge}
                deliveryCharge={deliveryCharge}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { CartItem } from "./cart-item";
export { CartSummary } from "./cart-summary";