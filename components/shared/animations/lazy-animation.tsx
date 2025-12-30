"use client";

import React from 'react';
import { LazyMotion } from 'framer-motion';

const DomAnimation = () =>
  import("framer-motion").then((module) => module.domAnimation);

const DomMax = () =>
  import("framer-motion").then((module) => module.domMax);

interface LazyAnimationProps {
  children: React.ReactNode;
  feature?: "dom-animation" | "dom-max";
}

/**
 * Lazy Animation Component
 * Matches old project's implementation - uses LazyMotion for lazy loading framer-motion features
 * Does NOT wrap children in additional divs to preserve positioning
 */
export function LazyAnimation({
  children,
  feature = "dom-animation",
}: LazyAnimationProps) {
  return (
    <LazyMotion features={feature === "dom-animation" ? DomAnimation : DomMax}>
      {children}
    </LazyMotion>
  );
}

// Export as default
export default LazyAnimation;