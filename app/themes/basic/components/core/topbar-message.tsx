"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

type Props = {
  message: string;
  marqueeStyle?: string;
  textStyle?: string;
};

const TopbarMessage = ({ message, marqueeStyle, textStyle }: Props) => {
  const [textColor, setTextColor] = useState("text-white");

  useEffect(() => {
    // Get the computed background color of the div
    const div = document.querySelector(".topbar-message-bg");
    if (div) {
      const bgColor = window.getComputedStyle(div).backgroundColor;

      // Parse RGB values from the background color
      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);

        // Calculate luminance using the relative luminance formula
        // https://www.w3.org/TR/WCAG20/#relativeluminancedef
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // If luminance is high (light background), use dark text, otherwise use light text
        setTextColor(luminance > 0.5 ? "text-black" : "text-white");
      }
    }
  }, []);

  return (
    <div className="mx-auto w-full bg-blue-zatiq topbar-message-bg">
      <Marquee
        className={`flex items-center ${
          marqueeStyle ? marqueeStyle : "py-[5px] pt-[7px]"
        }`}
        speed={60}
        pauseOnHover
      >
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
        <p
          className={`text-center whitespace-nowrap ml-10 ${textColor} ${
            textStyle ? textStyle : "text-[16px] lg:text-[20px]"
          }`}
        >
          {message}
        </p>
      </Marquee>
    </div>
  );
};

export default TopbarMessage;
