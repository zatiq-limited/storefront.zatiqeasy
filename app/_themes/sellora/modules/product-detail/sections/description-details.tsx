"use client";

import { Eye, Info } from "lucide-react";
import "react-quill/dist/quill.snow.css";

interface DescriptionDetailsProps {
  product: {
    description?: string;
    custom_fields?: Record<string, string>;
    warranty?: string;
  };
}

export function DescriptionDetails({ product }: DescriptionDetailsProps) {
  return (
    <div>
      {/* Description */}
      {product?.description && (
        <details className="group border-b border-gray-200 dark:border-gray-700">
          <summary className="flex items-center justify-between py-5 cursor-pointer text-base font-normal text-foreground">
            <div className="flex items-center justify-center">
              <Eye className="mr-2 w-6 h-6 font-normal" />
              <span>Description</span>
            </div>

            <span className="text-2xl group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <div className="pb-4 text-sm text-muted-foreground ql-snow">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: product?.description,
              }}
            />
          </div>
        </details>
      )}

      {/* Product Details */}
      {(product?.custom_fields || product?.warranty) && (
        <details className="group border-b border-gray-200 dark:border-gray-700">
          <summary className="flex items-center justify-between py-5 cursor-pointer text-base font-normal text-foreground">
            <div className="flex items-center justify-center">
              <Info className="mr-2 w-6 h-6 font-normal" />
              <span>Specifications</span>
            </div>
            <span className="text-2xl group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <div className="pb-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {product?.custom_fields &&
                Object.keys(product.custom_fields).map((key, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{product.custom_fields![key]}</span>
                  </li>
                ))}
              {product?.warranty && (
                <li className="flex justify-between">
                  <span>Warranty:</span>
                  <span>{product?.warranty}</span>
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
