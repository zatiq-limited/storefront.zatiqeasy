"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import LanguageToggler from "./language-toggler";
import { SidebarCategory } from "@/components/features/category";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { i18n } = useTranslation();
  const { shopDetails } = useShopStore();

  const [langValue, setLangValue] = useState<string>(
    shopDetails?.default_language_code ?? "en"
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden w-full bg-black/20 bg-opacity-50 fixed top-0 right-0 h-full z-[1000] ${
          isOpen ? "flex" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed overflow-y-scroll top-0 left-0 z-[1001] w-[266px] sm:w-[300px] bg-white dark:bg-black-27 h-full py-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4 pr-4">
          <button
            className="h-9 w-9 bg-blue-zatiq/15 flex justify-center items-center rounded-full cursor-pointer"
            onClick={onClose}
          >
            <X size={20} className="text-red-500 text-xl" />
          </button>
        </div>

        {/* Category Sidebar */}
        <SidebarCategory setShowMobileNav={(value) => !value && onClose()} />

        {/* Language Toggler */}
        <div
          className="flex mt-5 flex-col gap-5 items-start pl-7 pr-5"
          onClick={onClose}
        >
          <div>
            <LanguageToggler
              className="flex items-center gap-2"
              langValue={langValue}
              setLangValue={setLangValue}
              i18n={i18n}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
