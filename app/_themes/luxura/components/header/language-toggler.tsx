"use client";

import React from "react";

interface Props {
  langValue: string;
  setLangValue: React.Dispatch<React.SetStateAction<string>>;
  i18n: { changeLanguage: (lang: string) => void };
  className?: string;
}

const LanguageToggler = ({ langValue, setLangValue, i18n, className }: Props) => {
  const toggleLanguage = () => {
    const newLangValue = langValue === "en" ? "bn" : "en";
    localStorage.setItem("locale", newLangValue);
    setLangValue(newLangValue);
    i18n.changeLanguage(newLangValue);
  };

  return (
    <div
      onClick={toggleLanguage}
      className={`flex flex-col items-center justify-center gap-1 cursor-pointer lg:px-3 ${className}`}
    >
      <div className="relative w-12 h-6 px-2 flex items-center rounded-full cursor-pointer transition-colors bg-blue-zatiq">
        <div
          className={`absolute left-0 w-5 h-5 scale-90 bg-white rounded-full transition-all duration-300 ${
            langValue === "bn"
              ? "transform -translate-x-full left-full"
              : "transform translate-x-[10%]"
          }`}
        ></div>
        <span
          className={`text-xs font-medium text-white ${
            langValue === "en" ? "ml-4" : ""
          }`}
        >
          {langValue === "en" ? "EN" : "BN"}
        </span>
      </div>
    </div>
  );
};

export default LanguageToggler;
