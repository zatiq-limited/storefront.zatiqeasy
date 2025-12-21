"use client";

import { useState, useCallback } from "react";
import Marquee from "react-fast-marquee";

type Props = {
  message: string;
  marqueeStyle?: string;
  textStyle?: string;
};

const TopbarMessage = ({ message, marqueeStyle, textStyle }: Props) => {
  const [textColor, setTextColor] = useState("text-white");

  // Use ref callback to calculate text color based on background luminance
  // This avoids the ESLint set-state-in-effect error while still reading computed styles
  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const bgColor = window.getComputedStyle(node).backgroundColor;
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);

        // Calculate luminance using the relative luminance formula
        // https://www.w3.org/TR/WCAG20/#relativeluminancedef
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // If luminance is high (light background), use dark text, otherwise use light text
        const newColor = luminance > 0.5 ? "text-black" : "text-white";
        if (newColor !== textColor) {
          setTextColor(newColor);
        }
      }
    },
    [textColor]
  );

  // Number of repeated messages for smooth marquee effect
  const repeatCount = 7;

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full bg-blue-zatiq topbar-message-bg"
    >
      <Marquee
        className={`flex items-center ${marqueeStyle || "py-1.25 pt-1.75"}`}
        speed={60}
        pauseOnHover
      >
        {Array.from({ length: repeatCount }, (_, index) => (
          <p
            key={index}
            className={`text-center whitespace-nowrap ml-10 ${textColor} ${
              textStyle || "text-[16px] lg:text-[20px]"
            }`}
          >
            {message}
          </p>
        ))}
      </Marquee>
    </div>
  );
};

export default TopbarMessage;
