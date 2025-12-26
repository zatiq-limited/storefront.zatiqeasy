"use client";

import { cn } from "@/lib/utils";

type Props = {
  titleElement: React.ReactNode;
  number?: number;
  subtitle?: string;
  className?: string;
};

const LuxuraPageHeader = ({ titleElement, number, subtitle, className }: Props) => {
  return (
    <h1
      className={cn(
        "text-9.5 md:text-16 font-normal text-blue-zatiq",
        className
      )}
    >
      {titleElement}
      {(number ?? 0) > 0 && (
        <span className="text-4.5 md:text-7.5 text-gray-400 ml-2">
          ({number} {subtitle})
        </span>
      )}
    </h1>
  );
};

export { LuxuraPageHeader };
export default LuxuraPageHeader;
