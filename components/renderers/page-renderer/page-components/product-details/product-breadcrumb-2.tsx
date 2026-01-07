/**
 * Product Breadcrumb 2
 * Breadcrumb with home icon and modern styling
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { Product } from "@/stores/productsStore";

interface ProductBreadcrumb2Props {
  settings?: Record<string, unknown>;
  product: Product;
}

interface ProductBreadcrumb2Settings {
  showHome?: boolean;
  showCategory?: boolean;
  linkColor?: string;
  activeColor?: string;
  iconColor?: string;
  backgroundColor?: string;
}

export default function ProductBreadcrumb2({
  settings = {},
  product,
}: ProductBreadcrumb2Props) {
  const s = convertSettingsKeys<ProductBreadcrumb2Settings>(settings);

  const showHome = s.showHome !== false;
  const showCategory = s.showCategory !== false;
  const linkColor = s.linkColor || "#6B7280";
  const activeColor = s.activeColor || "#2563EB";
  const iconColor = s.iconColor || "#9CA3AF";

  const breadcrumbs = [
    ...(showHome ? [{ label: "Home", href: "/", isHome: true }] : []),
    { label: "Products", href: "/products", isHome: false },
    ...(showCategory && product.categories?.[0]
      ? [
          {
            label: product.categories[0].name,
            href: `/collections/${product.categories[0].id}`,
            isHome: false,
          },
        ]
      : []),
    { label: product.name, href: "#", isHome: false },
  ];

  return (
    <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 2xl:px-0 py-3">
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2"
                  style={{ color: iconColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className="font-medium line-clamp-1"
                  style={{ color: activeColor }}
                >
                  {crumb.label}
                </span>
              ) : crumb.isHome ? (
                <Link
                  href={crumb.href}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{ color: linkColor }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">{crumb.label}</span>
                </Link>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:opacity-80 transition-opacity"
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
