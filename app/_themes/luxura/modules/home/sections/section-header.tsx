"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { getThemeData } from "@/lib/utils/theme-constants";

type Props = {
  text: string;
  link?: string;
  viewMoreTextKey?: string;
};

const SectionHeader = ({
  text,
  viewMoreTextKey = "view_more",
  link,
}: Props) => {
  const { shopDetails } = useShopStore();
  const { t } = useTranslation();

  // Get theme data for fontFamily
  const themeData = getThemeData(shopDetails?.shop_theme?.theme_name);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-6 mb-4 md:mb-8 xl:mb-11">
        {link && <div className="hidden lg:block"></div>}
        <div className={`${link ? "lg:col-span-4" : "lg:col-span-5"}`}>
          <h2
            className="lg:text-center text-[28px] md:text-[32px] lg:text-[48px] leading-snug text-[#4B5563] dark:text-blue-zatiq line-clamp-1"
            style={{ fontFamily: themeData.secondaryFont || themeData.fontFamily }}
          >
            {text}
          </h2>
        </div>
        {link && (
          <div className="flex items-center justify-end">
            <Link
              href={`${shopDetails?.baseUrl}${link}`}
              className="flex items-center justify-center gap-4 text-4 md:text-5 text-[#4B5563]/50 dark:text-blue-zatiq font-bold hover:text-blue-zatiq transition"
            >
              <span>{t(viewMoreTextKey)}</span>
              <span>
                <MoveRight className="text-2xl" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export { SectionHeader };
export default SectionHeader;
