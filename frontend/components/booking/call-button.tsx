"use client";

import React from "react";
import { PhoneCall, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CallButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export function CallButton({
  isLoading = false,
  disabled = false,
  onClick,
  className,
  type = "submit",
}: CallButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "relative flex h-13 w-full items-center justify-center gap-2.5 rounded-xl text-base font-semibold transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151518]",
        isDisabled
          ? "bg-[#1C1C20] border border-[#27272A] text-[#71717A] cursor-not-allowed opacity-75 shadow-none"
          : "bg-[#5EEAD4] text-[#09090B] cursor-pointer shadow-[0_4px_24px_rgba(94,234,212,0.22)] hover:bg-[#2DD4BF] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(94,234,212,0.3)] active:scale-[0.98]",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-[#09090B]" />
          <span>Calling...</span>
        </>
      ) : (
        <>
          <PhoneCall className="h-5 w-5 text-[#09090B]" />
          <span>Call with Booking Agent</span>
        </>
      )}
    </button>
  );
}
