"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";

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

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-6 mb-4 md:mb-8 xl:mb-11">
        <div className="hidden lg:block"></div>
        <div className="lg:col-span-4">
          <h2 className="lg:text-center text-[28px] md:text-[32px] lg:text-[48px] leading-snug text-[#4B5563] dark:text-blue-zatiq line-clamp-1">
            {text}
          </h2>
        </div>
        <div className="flex items-center justify-end">
          <Link
            href={link ? `${shopDetails?.baseUrl}${link}` : "/"}
            className="flex items-center justify-center gap-4 text-4 md:text-5 text-[#4B5563]/50 dark:text-blue-zatiq font-bold hover:text-blue-zatiq transition"
          >
            <span>{t(viewMoreTextKey)}</span>
            <span>
              <MoveRight className="text-2xl" />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export { SectionHeader };
export default SectionHeader;
