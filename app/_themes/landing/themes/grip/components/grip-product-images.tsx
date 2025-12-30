"use client";

import React from "react";
import { ProductImagesGrid } from "../../../components";
import type { ProductImageInterface } from "@/types/landing-page.types";

interface GripProductImagesProps {
  content: ProductImageInterface | null | undefined;
}

export function GripProductImages({ content }: GripProductImagesProps) {
  return <ProductImagesGrid productImages={content} />;
}

export default GripProductImages;
