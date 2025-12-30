"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Radio } from "@base-ui/react/radio"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

interface RadioGroupProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

function RadioGroup({
  className,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(val) => {
        if (onValueChange && typeof val === 'string') {
          onValueChange(val);
        }
      }}
      {...props}
    >
      {children}
    </RadioGroupPrimitive>
  )
}

interface RadioGroupItemProps {
  className?: string;
  value: string;
  id?: string;
  children?: React.ReactNode;
}

function RadioGroupItem({
  className,
  value,
  id,
  ...props
}: RadioGroupItemProps) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      value={value}
      id={id}
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-checked:border-primary",
        className
      )}
      {...props}
    >
      <Radio.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <Circle className="fill-primary size-2" />
      </Radio.Indicator>
    </Radio.Root>
  )
}

export { RadioGroup, RadioGroupItem }
