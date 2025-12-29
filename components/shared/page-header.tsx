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
        "text-[38px] md:text-[64px] font-normal text-blue-zatiq",
        className
      )}
      style={{
        fontFamily: getThemeData(shopDetails?.shop_theme?.theme_name)
          .secondaryFont,
      }}
    >
      {titleElement}
      {(number ?? 0) > 0 && (
        <span className="text-[20px] md:text-[30px] text-gray-400 ml-2">
          ({number} {subtitle})
        </span>
      )}
    </h1>
  );
};

export default PageHeader;
