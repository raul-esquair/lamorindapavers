"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Reviews" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex items-center gap-0.5 sm:gap-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "press rounded-lg px-2.5 sm:px-3 py-2 font-sans text-sm font-medium",
              active
                ? "bg-warm-gray-100 text-warm-gray-900"
                : "text-warm-gray-500 hover:text-brand-blue",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
