"use client";

import { useShopStore } from "@/stores";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { CartTotalPriceCounter } from "./cart-total-price-counter";
import { LazyAnimation } from "@/components/shared/animations/lazy-animation";

const variants = {
  hide: { x: 200, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

interface CartCounterBtnProps {
  totalProducts: number;
  totalPrice: number;
  onClick: () => void;
  showCartFloatingBtn: boolean;
  theme?: "Basic" | "Premium" | "Aurora" | "Luxura" | "Sellora";
}

/**
 * CartCounterBtn Component
 * Matches old project's implementation from CartCounterBtn.tsx
 * Desktop floating button positioned on the right side
 */
export const CartCounterBtn = ({
  totalProducts,
  totalPrice,
  onClick,
  showCartFloatingBtn,
  theme = "Basic",
}: CartCounterBtnProps) => {
  const { shopDetails } = useShopStore();
  const isDark = shopDetails?.shop_theme?.theme_mode === "dark";
  const currency = shopDetails?.currency_code || "BDT";

  // Cart Icon based on theme (matching old project)
  const CartIconComponent = () => {
    switch (theme) {
      case "Aurora":
      case "Luxura":
      case "Premium":
        return (
          <ShoppingCart
            className="w-6 h-6"
            fill={isDark ? "#222" : "#fff"}
            stroke={isDark ? "#222" : "#fff"}
          />
        );
      case "Basic":
      default:
        return <ShoppingCart className="w-6 h-6 text-white" />;
    }
  };

  return (
    <LazyAnimation>
      <AnimatePresence>
        {showCartFloatingBtn && (
          <motion.button
            initial="hide"
            animate="show"
            exit="hide"
            variants={variants}
            transition={{ duration: 0.25 }}
            onClick={onClick}
            className="fixed top-41.75 right-4.25 z-50 min-w-16.25 rounded-lg overflow-hidden shadow-zatiq-blue bg-white dark:bg-black-27 cursor-pointer"
          >
            {/* Cart Icon Section */}
            <div className="px-3.25 py-2.5 bg-blue-zatiq flex flex-col gap-1 items-center">
              <CartIconComponent />
              <span className="text-sm font-medium text-white dark:text-black-18">
                {totalProducts} item
              </span>
            </div>

            {/* Price Section */}
            <div className="py-1 px-2 bg-blue-zatiq/15 dark:bg-black-zatiq text-xs font-bold text-center leading-6 text-blue-zatiq">
              {currency} <CartTotalPriceCounter totalPrice={totalPrice} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </LazyAnimation>
  );
};

// Also export as named for backwards compatibility
export { CartCounterBtn as default };
