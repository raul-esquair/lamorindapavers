import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "label-text text-brand-blue inline-flex items-center gap-2",
        className
      )}
    >
      <span className="w-8 h-px bg-current" />
      {children}
    </span>
  );
}
