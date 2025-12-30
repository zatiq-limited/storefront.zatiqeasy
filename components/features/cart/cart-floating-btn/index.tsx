"use client";

import { useMemo, useEffect, useState } from "react";
import { CartCounterBtn } from "./cart-counter-btn";
import { CartFooterBtn } from "./cart-footer-btn";

// Breakpoint value matching old project
const MD_BREAKPOINT = 768;

export interface CartFloatingButtonProps {
  onClick: () => void;
  showCartFloatingBtn: boolean;
  totalPrice: number;
  totalProducts: number;
}

interface CommonCartFloatingBtnProps extends CartFloatingButtonProps {
  theme?: "Basic" | "Premium" | "Aurora" | "Luxura" | "Sellora";
}

/**
 * CartFloatingBtn Component
 * Matches old project's implementation from cart-floating-btn/index.tsx
 * Shows CartCounterBtn on desktop, CartFooterBtn on mobile
 */
export const CartFloatingBtn = (props: CommonCartFloatingBtnProps) => {
  const { theme = "Basic", ...floatingBtnProps } = props;
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  // Track window width (matching old project's useTwQuery hook)
  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    // Listen for resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { showCounterBtn, showFooterBtn } = useMemo(() => {
    if (floatingBtnProps.showCartFloatingBtn && windowWidth) {
      return {
        showCounterBtn: windowWidth >= MD_BREAKPOINT,
        showFooterBtn: windowWidth < MD_BREAKPOINT,
      };
    }
    return {
      showCounterBtn: false,
      showFooterBtn: false,
    };
  }, [floatingBtnProps.showCartFloatingBtn, windowWidth]);

  return (
    <>
      <CartCounterBtn
        {...floatingBtnProps}
        theme={theme}
        showCartFloatingBtn={showCounterBtn}
      />
      <CartFooterBtn
        {...floatingBtnProps}
        showCartFloatingBtn={showFooterBtn}
      />
    </>
  );
};

// Re-export child components
export { CartCounterBtn } from "./cart-counter-btn";
export { CartFooterBtn } from "./cart-footer-btn";
export { CartTotalPriceCounter } from "./cart-total-price-counter";
