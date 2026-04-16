"use client";

import { useQuoteModal } from "@/components/ui/QuoteModal";
import { cn } from "@/lib/utils";

interface QuoteButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const variants = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",
  secondary: "bg-brand-gold text-white hover:bg-brand-gold-dark",
  outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function QuoteButton({
  variant = "secondary",
  size = "md",
  className,
  children = "Get a Free Estimate",
}: QuoteButtonProps) {
  const { open } = useQuoteModal();

  return (
    <button
      onClick={open}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition-all duration-300 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}
