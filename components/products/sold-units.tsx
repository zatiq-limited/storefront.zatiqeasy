"use client";

import React from "react";

interface SoldUnitsProps {
  showSoldCount?: boolean;
  initialSold: number;
  totalSold: number;
}

export const SoldUnits = ({
  showSoldCount,
  initialSold,
  totalSold,
}: SoldUnitsProps) => {
  const totalUnits = initialSold + totalSold;

  if (!showSoldCount || totalUnits <= 0) {
    return null;
  }

  return (
    <div>
      <span className="px-4 py-2 pt-2.25 bg-blue-600 opacity-80 rounded-full text-white dark:text-gray-900 text-center text-[12px] md:text-[16px]">
        Sold Units: {totalUnits}
      </span>
    </div>
  );
};
