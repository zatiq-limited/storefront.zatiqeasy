"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface CartQtyControlProps {
  sumQty: () => void;
  subQty: () => void;
  qty?: number | string;
  disableSubBtn?: boolean;
  disableSumBtn?: boolean;
  className?: string;
  onQtyChange?: (value: number) => void;
  maxStock?: number;
}

export const CartQtyControl = ({
  subQty,
  sumQty,
  qty = 0,
  disableSubBtn,
  disableSumBtn,
  className,
  onQtyChange,
  maxStock,
}: CartQtyControlProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for better UX when user is typing
    if (value === "") {
      if (onQtyChange) {
        onQtyChange(0);
      }
      return;
    }

    // Parse and validate the input
    const numValue = parseInt(value, 10);

    if (!isNaN(numValue) && numValue >= 0) {
      // Cap at maxStock if provided
      const cappedValue =
        maxStock !== undefined && numValue > maxStock ? maxStock : numValue;

      if (onQtyChange) {
        onQtyChange(cappedValue);
      }
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // If empty or invalid on blur, reset to current qty or 0
    if (value === "" || isNaN(parseInt(value, 10))) {
      if (onQtyChange) {
        onQtyChange(
          typeof qty === "number" ? qty : parseInt(String(qty), 10) || 0
        );
      }
      return;
    }

    // Cap at maxStock on blur if needed
    const numValue = parseInt(value, 10);
    if (maxStock !== undefined && numValue > maxStock) {
      if (onQtyChange) {
        onQtyChange(maxStock);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-blue-zatiq dark:text-white",
        className
      )}
    >
      <button
        type="button"
        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={(e) => {
          e.stopPropagation();
          subQty();
        }}
        disabled={disableSubBtn}
        aria-label="Decrease quantity"
      >
        <Minus className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <input
        type="number"
        value={qty}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={(e) => e.target.select()}
        onClick={(e) => e.stopPropagation()}
        className="font-medium text-sm md:text-base text-center w-12 md:w-16 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-zatiq focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        min="0"
        max={maxStock}
      />
      <button
        type="button"
        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={(e) => {
          e.stopPropagation();
          sumQty();
        }}
        disabled={disableSumBtn}
        aria-label="Increase quantity"
      >
        <Plus className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </div>
  );
};

export default CartQtyControl;
