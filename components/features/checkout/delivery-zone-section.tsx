import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type DeliveryZoneSectionProps = {
  country_code: string;
  delivery_option: string;
  specificDeliveryCharges: Record<string, number> | null;
  selectedSpecificDeliveryZone: string;
  setSelectedSpecificDeliveryZone: (zone: string) => void;
  isDisabled?: boolean;
};

export const DeliveryZoneSection = ({
  country_code,
  delivery_option,
  specificDeliveryCharges,
  selectedSpecificDeliveryZone,
  setSelectedSpecificDeliveryZone,
  isDisabled = false,
}: DeliveryZoneSectionProps) => {
  const { t } = useTranslation();

  if (
    (country_code === "BD" && delivery_option !== "zones") ||
    !specificDeliveryCharges
  ) {
    return null;
  }

  return (
    <div
      className={`space-y-3 mb-6 md:mb-8 ${
        isDisabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">
        {t("delivery_zone")}
      </h4>
      <div className="flex flex-wrap gap-3">
        {Object.keys(specificDeliveryCharges).map((zone) => (
          <DeliveryOption
            key={zone}
            label={zone}
            isSelected={selectedSpecificDeliveryZone === zone}
            isDisabled={isDisabled}
            onClick={() => {
              if (isDisabled) return;
              // Don't allow deselection - at least one zone must be selected
              if (selectedSpecificDeliveryZone !== zone) {
                setSelectedSpecificDeliveryZone(zone);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

const DeliveryOption = ({
  label,
  onClick,
  isSelected,
  isDisabled,
}: {
  label: string;
  onClick: () => void;
  isSelected: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={isDisabled}
      className={cn(
        "px-4 py-2 text-sm tracking-[-0.12px] flex items-center gap-4 ring-2 rounded-full ring-gray-200 dark:ring-gray-600 text-black-full dark:text-gray-300 cursor-pointer disabled:cursor-not-allowed",
        {
          "text-blue-zatiq ring-blue-zatiq dark:ring-blue-zatiq bg-blue-zatiq/10":
            isSelected,
        }
      )}
    >
      {label}
    </button>
  );
};
