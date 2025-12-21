"use client";

import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: any;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  mode: 'light'
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableTransitions?: boolean;
  transitionDuration?: number;
}

export function ThemeProvider({
  children,
  defaultTheme = 'basic',
  enableTransitions = true,
  transitionDuration = 300
}: ThemeProviderProps) {
  // For now, just pass through children
  // The theme system is handled by the existing ThemeLayout
  return (
    <ThemeContext.Provider
      value={{
        theme: { id: defaultTheme },
        mode: 'light'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}