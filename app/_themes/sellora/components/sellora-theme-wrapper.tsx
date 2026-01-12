/**
 * Sellora Theme Wrapper
 *
 * Applies Special Gothic font globally to all Sellora theme components
 */

import React from "react";

interface SelloraThemeWrapperProps {
  children: React.ReactNode;
}

export function SelloraThemeWrapper({ children }: SelloraThemeWrapperProps) {
  return <div className="font-special-gothic">{children}</div>;
}
