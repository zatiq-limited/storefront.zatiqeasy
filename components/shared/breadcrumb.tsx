"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShopStore } from "@/stores/shopStore";
import { useProductsStore } from "@/stores/productsStore";

interface BreadcrumbProps {
  homeElement?: React.ReactNode;
  separator?: React.ReactNode;
  activeClasses?: string;
  containerClasses?: string;
  listClasses?: string;
  capitalizeLinks?: boolean;
}

/**
 * Breadcrumb Component
 * Similar to old project's NextBreadcrumb but adapted for App Router
 * Generates breadcrumbs based on current pathname
 * Automatically resolves category names from IDs
 */
export function Breadcrumb({
  homeElement = "Home",
  separator = "/",
  activeClasses = "text-blue-600 font-bold",
  containerClasses = "flex items-center gap-2",
  listClasses = "text-gray-500 hover:underline",
  capitalizeLinks = false,
}: BreadcrumbProps) {
  const pathname = usePathname();
  const { shopDetails } = useShopStore();
  const { categories } = useProductsStore();
  const baseUrl = shopDetails?.baseUrl || "";

  // Parse pathname and create breadcrumb segments
  // Filter out 'merchant' segment and shop UUID/ID (but keep category IDs)
  const allSegments = pathname.split("/").filter((segment) => segment !== "");

  const pathSegments = allSegments.filter((segment, index) => {
    // Remove "merchant" segment
    if (segment === "merchant") return false;

    // Remove shop UUID (after "merchant")
    const prevSegment = index > 0 ? allSegments[index - 1] : null;
    if (prevSegment === "merchant") {
      // This is the shop ID/UUID - remove it
      if (
        segment.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) || // UUID
        segment.match(/^\d+$/) // Numeric shop ID
      ) {
        return false;
      }
    }

    return true;
  });

  // Build breadcrumb items with category name resolution
  const breadcrumbs = useMemo(() => {
    const items = [{ label: homeElement, href: baseUrl || "/" }];

    pathSegments.forEach((segment, index) => {
      const href = `${baseUrl}/${pathSegments.slice(0, index + 1).join("/")}`;
      let label = segment;

      // Check if this is a category ID (after "categories" segment)
      const prevSegment = index > 0 ? pathSegments[index - 1] : null;
      if (prevSegment === "categories" && /^\d+$/.test(segment)) {
        // This is a category ID, resolve to category name
        const category = categories.find((cat) => String(cat.id) === segment);
        if (category) {
          label = category.name;
        } else {
          label = "Category"; // Fallback if category not found
        }
      } else {
        // Regular segment - format it
        label = segment.replace(/-/g, " ");
        if (capitalizeLinks) {
          label = label
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      items.push({ label, href });
    });

    return items;
  }, [pathSegments, categories, baseUrl, homeElement, capitalizeLinks]);

  return (
    <nav className={containerClasses} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span className={activeClasses} aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className={listClasses}>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
