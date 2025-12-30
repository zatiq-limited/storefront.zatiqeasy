"use client";

import { useShopStore } from "@/stores";
import { motion, AnimatePresence } from "framer-motion";
import { CartTotalPriceCounter } from "./cart-total-price-counter";
import { LazyAnimation } from "@/components/shared/animations/lazy-animation";

const variants = {
  hide: { y: "100%", opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface CartFooterBtnProps {
  onClick: () => void;
  totalProducts: number;
  totalPrice: number;
  showCartFloatingBtn: boolean;
}

/**
 * CartFooterBtn Component
 * Matches old project's implementation from CartFooterBtn.tsx
 * Mobile sticky footer button
 */
export const CartFooterBtn = ({
  onClick,
  totalProducts,
  totalPrice,
  showCartFloatingBtn,
}: CartFooterBtnProps) => {
  const { shopDetails } = useShopStore();
  const currency = shopDetails?.currency_code || "BDT";

  return (
    <LazyAnimation>
      <AnimatePresence>
        {showCartFloatingBtn && (
          <motion.div
            initial="hide"
            animate="show"
            exit="hide"
            variants={variants}
            transition={{ duration: 0.25 }}
            className="p-3 bg-white dark:bg-black-18 max-w-md w-full sticky left-0 bottom-0 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-100"
          >
            <button
              onClick={onClick}
              className="bg-blue-zatiq rounded-lg text-white w-full flex items-center justify-between p-3"
            >
              {/* Product Count Badge */}
              <div className="px-1.5 py-1 bg-white rounded-full text-black-2 font-bold text-[10px]">
                {totalProducts}
              </div>

              {/* Cart Text */}
              <div className="grow text-center">
                View your cart ({currency}{" "}
                <CartTotalPriceCounter totalPrice={totalPrice} />)
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LazyAnimation>
  );
};

// Also export as named for backwards compatibility
export { CartFooterBtn as default };
