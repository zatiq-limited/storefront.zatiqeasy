/**
 * Product Breadcrumb 1
 * Simple text-based breadcrumb with separators
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Product } from "@/stores/productsStore";

interface ProductBreadcrumb1Props {
  settings?: Record<string, unknown>;
  product: Product;
}

interface ProductBreadcrumb1Settings {
  showHome?: boolean;
  showCategory?: boolean;
  linkColor?: string;
  textColor?: string;
  separatorColor?: string;
  backgroundColor?: string;
}

export default function ProductBreadcrumb1({
  settings = {},
  product,
}: ProductBreadcrumb1Props) {
  const s = convertSettingsKeys<ProductBreadcrumb1Settings>(settings);

  const showHome = s.showHome !== false;
  const showCategory = s.showCategory !== false;
  const linkColor = s.linkColor || "#6B7280";
  const textColor = s.textColor || "#111827";
  const separatorColor = s.separatorColor || "#9CA3AF";

  const breadcrumbs = [
    ...(showHome ? [{ label: "Home", href: "/" }] : []),
    { label: "Products", href: "/products" },
    ...(showCategory && product.categories?.[0]
      ? [
          {
            label: product.categories[0].name,
            href: `/collections/${product.categories[0].id}`,
          },
        ]
      : []),
    { label: product.name, href: "#" },
  ];

  return (
    <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 2xl:px-0 py-3">
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 shrink-0"
                  style={{ color: separatorColor }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className="font-medium line-clamp-1"
                  style={{ color: textColor }}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:underline transition-colors"
                  style={{ color: linkColor }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
