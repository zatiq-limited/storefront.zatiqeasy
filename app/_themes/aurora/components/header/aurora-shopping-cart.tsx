import React from "react";

interface AuroraShoppingCartProps {
  fill?: string;
  className?: string;
  size?: number;
}

export const AuroraShoppingCart: React.FC<AuroraShoppingCartProps> = ({
  fill = "#4B5563",
  className = "",
  size = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M7 5.25C7 2.39062 9.23214 0 12 0C14.7232 0 17 2.39062 17 5.25V7.5H19.8571C21.0179 7.5 22 8.53125 22 9.75V19.5C22 21.9844 20.0804 24 17.7143 24H6.28571C3.875 24 2 21.9844 2 19.5V9.75C2 8.53125 2.9375 7.5 4.14286 7.5H7V5.25ZM9 7.5H15V5.25C15 3.5 13.5625 2 12 2C10.3929 2 9 3.5 9 5.25V7.5ZM8.07143 12C8.65179 12 9.14286 11.5312 9.14286 10.875C9.14286 10.2656 8.65179 9.75 8.07143 9.75C7.44643 9.75 7 10.2656 7 10.875C7 11.5312 7.44643 12 8.07143 12ZM15.9286 9.75C15.3036 9.75 14.8571 10.2656 14.8571 10.875C14.8571 11.5312 15.3036 12 15.9286 12C16.5089 12 17 11.5312 17 10.875C17 10.2656 16.5089 9.75 15.9286 9.75Z"
        fill={fill}
      />
    </svg>
  );
};

export default AuroraShoppingCart;
