"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ViewAllButtonProps {
  link: string;
  text: string;
  className?: string;
}

export function ViewAllButton({ link, text, className }: ViewAllButtonProps) {
  return (
    <div className={cn("flex justify-center mt-8", className)}>
      <Link
        href={link}
        className="px-6 py-3 border border-blue-zatiq text-blue-zatiq rounded-lg hover:bg-blue-zatiq hover:text-white transition-all duration-200 font-medium"
      >
        {text}
      </Link>
    </div>
  );
}

export default ViewAllButton;
