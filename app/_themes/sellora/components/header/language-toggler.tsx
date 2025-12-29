"use client";

import { cn } from "@/lib/utils";

interface LanguageTogglerProps {
  langValue: string;
  setLangValue: React.Dispatch<React.SetStateAction<string>>;
  i18n: {
    changeLanguage: (lang: string) => void;
  };
  className?: string;
}

const LanguageToggler: React.FC<LanguageTogglerProps> = ({
  langValue,
  setLangValue,
  i18n,
  className,
}) => {
  const toggleLanguage = () => {
    const newLangValue = langValue === "en" ? "bn" : "en";
    localStorage.setItem("locale", newLangValue);
    setLangValue(newLangValue);
    i18n.changeLanguage(newLangValue);
  };

  return (
    <div
      onClick={toggleLanguage}
      className={cn(
        "flex flex-col items-center justify-center gap-1 cursor-pointer lg:px-3",
        className
      )}
    >
      <div className="relative w-12 h-6 px-2 flex items-center rounded-full cursor-pointer transition-colors bg-blue-zatiq">
        <div
          className={cn(
            "absolute left-0 w-5 h-5 scale-90 bg-white rounded-full transition-all duration-300",
            langValue === "bn"
              ? "transform -translate-x-full left-full"
              : "transform translate-x-[10%]"
          )}
        />
        <span
          className={cn("text-xs font-medium text-white", {
            "ml-4": langValue === "en",
          })}
        >
          {langValue === "en" ? "EN" : "BN"}
        </span>
      </div>
    </div>
  );
};

export default LanguageToggler;
