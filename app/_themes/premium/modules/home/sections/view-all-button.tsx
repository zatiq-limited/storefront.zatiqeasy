"use client";

import React from "react";
import Link from "next/link";

interface ViewAllButtonProps {
  button_text: string;
  button_link: string;
}

export function ViewAllButton({ button_text, button_link }: ViewAllButtonProps) {
  return (
    <div className="hidden lg:flex justify-center">
      <Link
        href={button_link}
        className="btn px-[28px] py-4 pt-[18px] bg-blue-zatiq text-center text-white dark:text-black text-base font-bold uppercase leading-none"
      >
        {button_text}
      </Link>
    </div>
  );
}

export default ViewAllButton;
