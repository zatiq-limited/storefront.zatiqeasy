"use client";

import React from "react";
import { Eye, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DescriptionDetailsProps {
  description?: string;
  customFields?: Record<string, string>;
  warranty?: string;
}

export function DescriptionDetails({
  description,
  customFields,
  warranty,
}: DescriptionDetailsProps) {
  const { t } = useTranslation();

  if (!description && !customFields && !warranty) {
    return null;
  }

  return (
    <div>
      {/* Description Accordion */}
      {description && (
        <details className="group border-b border-gray-200 dark:border-gray-700">
          <summary className="flex items-center justify-between py-5 cursor-pointer text-base font-normal text-foreground">
            <div className="flex items-center">
              <Eye className="mr-2 w-5 h-5" />
              <span>{t("description") || "Description"}</span>
            </div>
            <span className="text-2xl group-open:rotate-45 transition-transform duration-200">
              +
            </span>
          </summary>
          <div className="pb-4 text-sm text-muted-foreground ql-snow">
            <div
              className="ql-editor prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </details>
      )}

      {/* Specifications Accordion */}
      {(customFields || warranty) && (
        <details className="group border-b border-gray-200 dark:border-gray-700">
          <summary className="flex items-center justify-between py-5 cursor-pointer text-base font-normal text-foreground">
            <div className="flex items-center">
              <Info className="mr-2 w-5 h-5" />
              <span>{t("specifications") || "Specifications"}</span>
            </div>
            <span className="text-2xl group-open:rotate-45 transition-transform duration-200">
              +
            </span>
          </summary>
          <div className="pb-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {customFields &&
                Object.keys(customFields).map((key, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{customFields[key]}</span>
                  </li>
                ))}
              {warranty && (
                <li className="flex justify-between">
                  <span>{t("warranty") || "Warranty"}:</span>
                  <span>{warranty}</span>
                </li>
              )}
            </ul>
          </div>
        </details>
      )}
    </div>
  );
}

export default DescriptionDetails;
