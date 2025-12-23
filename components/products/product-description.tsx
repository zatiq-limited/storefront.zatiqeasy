"use client";

import React from "react";
import "react-quill/dist/quill.snow.css";

interface ProductDescriptionProps {
  product: {
    custom_fields?: Record<string, string>;
    warranty?: string;
    description?: string;
  };
}

export const ProductDescription = ({ product }: ProductDescriptionProps) => {
  return (
    <div className="text-sm mt-3">
      {(product.custom_fields || product.warranty) && (
        <div className="rounded-xl bg-blue-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 px-5 py-6 text-gray-800 dark:text-gray-200 mb-4">
          <h4 className="font-medium">Details:</h4>
          {
            <ul className="mt-3 tracking-[-0.24px]">
              {product.custom_fields &&
                Object.keys(product.custom_fields).map((key, idx) => (
                  <li key={idx} className="grid grid-cols-5 gap-6">
                    <div className="col-span-2">{key}</div>
                    <div className="col-span-3 text-right">
                      {product.custom_fields![key]}
                    </div>
                  </li>
                ))}
              {product?.warranty && (
                <li className="grid grid-cols-5 gap-6">
                  <div className="col-span-2">Warranty</div>
                  <div className="col-span-3 text-right">
                    {product?.warranty}
                  </div>
                </li>
              )}
            </ul>
          }
        </div>
      )}

      {product?.description && (
        <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 tracking-[-.56px] whitespace-pre-line">
          <div className="ql-snow">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: product?.description,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
