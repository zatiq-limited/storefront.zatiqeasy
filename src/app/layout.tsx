/**
 * ========================================
 * ROOT LAYOUT
 * ========================================
 *
 * The root layout wraps all pages with:
 * 1. ThemeProvider - Provides theme context and renders global sections
 *
 * Structure:
 * ┌──────────────────────────┐
 * │   Announcement Bar       │  ← from theme.json (via ThemeProvider)
 * ├──────────────────────────┤
 * │   Header / Navbar        │  ← from theme.json (via ThemeProvider)
 * ├──────────────────────────┤
 * │                          │
 * │   {children}             │  ← Page content (homepage.json, products.json, etc.)
 * │                          │
 * ├──────────────────────────┤
 * │   Footer                 │  ← from theme.json (via ThemeProvider)
 * └──────────────────────────┘
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zatiq Store',
  description: 'Your one-stop shop for everything',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {/*
            ThemeProvider automatically renders:
            1. Announcement Bar (from theme.json)
            2. Header/Navbar (from theme.json)
            3. {children} - Page content
            4. Footer (from theme.json)
          */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
