"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";

/**
 * CartTotalPriceCounter Component
 * Matches old project's implementation from CartTotalPriceCounter.tsx
 * Animated counter for cart total price
 */
export const CartTotalPriceCounter = ({
  totalPrice,
}: {
  totalPrice: number;
}) => {
  const [startCount, setStartCount] = useState(totalPrice);
  const [endCount, setEndCount] = useState(totalPrice);

  useEffect(() => {
    setStartCount(endCount);
    setEndCount(totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice]);

  return <CountUp start={startCount} end={endCount} duration={2} />;
};

// Export as default for backwards compatibility
export default CartTotalPriceCounter;
