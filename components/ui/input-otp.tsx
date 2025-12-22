"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<"div">,
  Omit<React.ComponentPropsWithoutRef<"div">, 'onChange'> & {
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
  }
>(({ className, maxLength = 6, value = "", onChange, ...props }, ref) => {
  const [otpValues, setOtpValues] = React.useState<string[]>(
    Array(maxLength).fill("")
  );

  React.useEffect(() => {
    const values = value.split("").slice(0, maxLength);
    const newValues = Array(maxLength)
      .fill("")
      .map((_, i) => values[i] || "");
    setOtpValues(newValues);
  }, [value, maxLength]);

  const handleChange = (index: number, val: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = val.slice(-1); // Take only last character
    setOtpValues(newOtpValues);

    const newValue = newOtpValues.join("");
    onChange?.(newValue);

    // Focus next input
    if (val && index < maxLength - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length: maxLength }, (_, index) => (
        <InputOTPSlot
          key={index}
          index={index}
          id={`otp-${index}`}
          value={otpValues[index]}
          onChange={(val) => handleChange(index, val)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"input">,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'> & {
    index: number;
    id: string;
    value: string;
    onChange: (value: string) => void;
  }
>(({ index, id, value, onChange, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
        className
      )}
      {...props}
    />
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };