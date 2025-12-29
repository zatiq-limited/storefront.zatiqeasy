"use client";

import { cn } from "@/lib/utils";
import { getThemeData } from "@/lib/utils/theme-constants";
import { useShopStore } from "@/stores";

type Props = {
  titleElement: React.ReactNode;
  number?: number;
  subtitle?: string;
  className?: string;
};

const PageHeader = ({ titleElement, number, subtitle, className }: Props) => {
  const { shopDetails } = useShopStore();

  return (
    <h1
      className={cn(
        "text-9.5 md:text-16 font-normal text-blue-zatiq",
        className
      )}
      style={{
        fontFamily: getThemeData(shopDetails?.shop_theme?.theme_name)
          .secondaryFont,
      }}
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

export default PageHeader;
