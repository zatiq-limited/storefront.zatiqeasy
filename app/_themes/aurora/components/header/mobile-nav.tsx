"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shopStore";
import LanguageToggler from "./language-toggler";
import SidebarCategory from "@/components/features/category/sidebar-category";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { shopDetails } = useShopStore();
  const { i18n } = useTranslation();
  const [langValue, setLangValue] = useState<string>(
    shopDetails?.default_language_code ?? "en"
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "lg:hidden w-full bg-black/50 fixed top-0 right-0 h-full z-[1000] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed overflow-y-auto top-0 left-0 z-[1001] w-[266px] sm:w-[300px]",
          "bg-white dark:bg-black-27 h-full py-4 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4 pr-4">
          <button
            className="h-9 w-9 bg-blue-zatiq/15 flex justify-center items-center rounded-full"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} className="text-red-500" />
          </button>
        </div>

        {/* Categories */}
        <SidebarCategory setShowMobileNav={onClose} />

        {/* Additional Links */}
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
};

export default MobileNav;
