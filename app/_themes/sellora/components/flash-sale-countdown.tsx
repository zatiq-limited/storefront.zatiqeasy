"use client";

import React, { useState, useEffect } from "react";
import { useShopStore } from "@/stores/shopStore";

interface FlashSaleCountdownProps {
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit = ({ value, label }: TimeUnitProps) => (
  <div className="flex flex-col items-center py-2 sm:py-5">
    <div className="relative">
      <div className="bg-linear-to-br from-blue-zatiq to-blue-zatiq/30 text-white rounded-lg sm:rounded-xl shadow-lg min-w-12 sm:min-w-16 md:min-w-18 h-12 sm:h-14 md:h-16 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      {/* Decorative highlight */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/20 to-transparent rounded-t-lg sm:rounded-t-xl" />
    </div>
    <span className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2 font-medium uppercase tracking-wide">
      {label}
    </span>
  </div>
);

const getTimeDifference = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export const FlashSaleCountdown: React.FC<FlashSaleCountdownProps> = ({
  className = "",
}) => {
  const { shopDetails } = useShopStore();

  // Get flash sale timer from metadata
  const flashSaleTimer = (
    shopDetails?.metadata as {
      shops?: { flash_sale_timer?: { start_date?: string; end_date?: string } };
    }
  )?.shops?.flash_sale_timer;
  const saleEndDate = flashSaleTimer?.end_date;
  const saleStartDate = flashSaleTimer?.start_date;

  const calculateTimeLeft = (): TimeLeft => {
    if (!saleEndDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const targetDate =
      typeof saleEndDate === "string" ? new Date(saleEndDate) : saleEndDate;
    return getTimeDifference(targetDate);
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    if (!saleEndDate) return;

    const timer = setInterval(() => {
      const targetDate =
        typeof saleEndDate === "string" ? new Date(saleEndDate) : saleEndDate;
      const newTimeLeft = getTimeDifference(targetDate);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [saleEndDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  // Check if sale is active (between start and end dates)
  const now = new Date().getTime();
  const startTime = saleStartDate ? new Date(saleStartDate).getTime() : null;
  const endTime = saleEndDate ? new Date(saleEndDate).getTime() : null;
  const isSaleActive =
    startTime && endTime && now >= startTime && now < endTime;

  // Don't render if no sale data, sale is not active, or sale has ended
  if (!saleEndDate || !saleStartDate || !isSaleActive || isExpired) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Countdown Timer */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {timeLeft.days > 0 && (
          <>
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 animate-pulse mb-6">
              :
            </span>
          </>
        )}
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 animate-pulse mb-6">
          :
        </span>
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 animate-pulse mb-6">
          :
        </span>
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};
