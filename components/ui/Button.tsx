import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "outline-white" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
  disabled?: boolean;
}

const variants = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",
  secondary: "bg-brand-gold text-white hover:bg-brand-gold-dark",
  outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
  "outline-white": "border-2 border-white text-white hover:bg-white hover:text-warm-gray-900",
  ghost: "text-warm-gray-700 hover:text-brand-blue hover:bg-warm-gray-100",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
  type = "button",
  external = false,
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition-all duration-300",
    variants[variant],
    sizes[size],
    disabled && "opacity-60 cursor-not-allowed pointer-events-none",
    className
  );

  if (href && external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
