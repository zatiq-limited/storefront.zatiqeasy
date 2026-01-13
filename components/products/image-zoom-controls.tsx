"use client";

import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageZoomControlsProps {
  onZoomClick: () => void;
  className?: string;
  showLabel?: boolean;
}

export function ImageZoomControls({
  onZoomClick,
  className,
  showLabel = false,
}: ImageZoomControlsProps) {
  return (
    <div
      className={cn(
        "absolute top-2 right-2 z-10 flex items-center gap-2",
        className
      )}
    >
      {/* Zoom Button */}
      <button
        onClick={onZoomClick}
        className="bg-blue-zatiq/15 backdrop-blur-sm p-3 rounded-full cursor-pointer hover:bg-blue-zatiq/25 transition-all duration-200 shadow-lg group"
        aria-label="Zoom image"
        type="button"
      >
        <ZoomIn className="text-white dark:text-gray-700 w-5 h-5 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
      </button>

      {showLabel && (
        <span className="bg-blue-zatiq/15 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-medium text-white dark:text-gray-700 shadow-lg">
          Click to zoom
        </span>
      )}
    </div>
  );
}

export default ImageZoomControls;
