"use client";

import { X } from "lucide-react";
import type { MobileSidebarProps } from "./types";

export default function MobileSidebar({
  isOpen,
  onClose,
  resultsCount,
  children,
}: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          {children}

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Show {resultsCount} Results
          </button>
        </div>
      </div>
    </>
  );
}
