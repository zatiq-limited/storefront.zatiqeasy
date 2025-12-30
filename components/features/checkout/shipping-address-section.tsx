"use client";

import { useTranslation } from "react-i18next";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";
import type { CheckoutFormData } from "@/types/checkout.types";

type Division = {
  id: number;
  name: string;
  bn_name: string;
};

type ShippingAddressSectionProps = {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors;
  setValue: UseFormSetValue<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  country_code: string;
  delivery_option: string;
  divisions: Division[];
  districts: Record<string, Division[]>;
  upazilas: Record<string, Record<string, Division[]>>;
  selectedDivision: string;
  selectedDistrict: string;
  shopLanguage: string;
  isDisabled?: boolean;
};

export const ShippingAddressSection = ({
  register,
  errors,
  setValue,
  watch,
  country_code,
  delivery_option,
  divisions,
  districts,
  upazilas,
  selectedDivision,
  selectedDistrict,
  shopLanguage,
  isDisabled = false,
}: ShippingAddressSectionProps) => {
  const { t } = useTranslation();

  // Watch form values for real-time updates
  const watchedValues = watch();
  const currentDivision = watchedValues?.division || selectedDivision;
  const currentDistrict = watchedValues?.district || selectedDistrict;

  return (
    <div
      className={`mb-6 md:mb-8 ${
        isDisabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h2 className="text-2xl font-semibold mb-3 md:mb-4 dark:text-gray-200">
        {t("personal_info")}
      </h2>

      {/* Name Input */}
      <div className="space-y-1 mb-4">
        <label className="block text-base font-medium mb-2 dark:text-gray-300">
          {t("name")}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("name")}
          disabled={isDisabled}
          className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-transparent dark:text-gray-200 disabled:cursor-not-allowed"
          {...register("customer_name", {
            required: t("name_required"),
          })}
        />
        {errors && errors.customer_name && (
          <span className="block text-sm text-red-500">
            {errors.customer_name.message as string}
          </span>
        )}
      </div>

      {/* Address Input */}
      <div className="mb-4 space-y-1">
        <label className="block text-base font-medium mb-2 dark:text-gray-300">
          {t("your_address")}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("your_address")}
          disabled={isDisabled}
          className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-transparent dark:text-gray-200 disabled:cursor-not-allowed"
          {...register("customer_address", {
            required: t("address_line_required"),
          })}
        />
        {errors && errors.customer_address && (
          <span className="block text-sm text-red-500">
            {errors.customer_address.message as string}
          </span>
        )}
      </div>

      {/* Division/District/Upazila for Bangladesh */}
      {country_code === "BD" && delivery_option !== "zones" && (
        <div className="space-y-4">
          {/* Division Select */}
          <div className="space-y-1">
            <label className="block text-base font-medium mb-2 dark:text-gray-300">
              {t("select_division")}
            </label>
            <div className="relative">
              <select
                disabled={isDisabled}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-black dark:text-gray-200 disabled:cursor-not-allowed"
                {...register("division", {
                  required: t("division_required"),
                  onChange: () => setValue("district", ""),
                })}
              >
                <option value="">{t("select_division")}</option>
                {divisions?.map(({ id, name, bn_name }) => (
                  <option key={id} value={name}>
                    {shopLanguage === "bn" ? bn_name : name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>
            </div>
            {errors && errors.division && (
              <span className="block text-sm text-red-500">
                {errors.division.message as string}
              </span>
            )}
          </div>

          {/* District Select */}
          {currentDivision && (
            <div className="space-y-1">
              <label className="block text-base font-medium mb-2 dark:text-gray-300">
                {t("select_district")}
              </label>
              <div className="relative">
                <select
                  disabled={isDisabled}
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-black dark:text-gray-200 disabled:cursor-not-allowed"
                  {...register("district", {
                    required: t("district_required"),
                    onChange: () => setValue("upazila", ""),
                  })}
                >
                  <option value="">{t("select_district")}</option>
                  {districts[currentDivision]?.map(({ id, name, bn_name }) => (
                    <option key={id} value={name}>
                      {shopLanguage === "bn" ? bn_name : name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </div>
              </div>
              {errors && errors.district && (
                <span className="block text-sm text-red-500">
                  {errors.district.message as string}
                </span>
              )}
            </div>
          )}

          {/* Upazila Select */}
          {currentDivision && currentDistrict && (
            <div className="space-y-1">
              <label className="block text-base font-medium mb-2 dark:text-gray-300">
                {t("select_upazila")}
              </label>
              <div className="relative">
                <select
                  disabled={isDisabled}
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-black dark:text-gray-200 disabled:cursor-not-allowed"
                  {...register("upazila", {
                    required: t("upazila_required"),
                  })}
                >
                  <option value="">{t("select_upazila")}</option>
                  {upazilas[currentDivision]?.[currentDistrict]?.map(
                    ({ id, name, bn_name }) => (
                      <option key={id} value={name}>
                        {shopLanguage === "bn" ? bn_name : name}
                      </option>
                    )
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                </div>
              </div>
              {errors && errors.upazila && (
                <span className="block text-sm text-red-500">
                  {errors.upazila.message as string}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
