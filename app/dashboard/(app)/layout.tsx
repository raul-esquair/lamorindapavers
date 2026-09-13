import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth/guard";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import { logout } from "@/lib/actions/dashboard-auth";
import DashboardNav from "./DashboardNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/dashboard/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-warm-gray-200 bg-warm-white">
        {/* Phones: logo and Sign out on one row, the nav on its own below —
            logo + three links + Sign out don't fit in 375px. */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Link href="/dashboard" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt={company.name}
              width={2649}
              height={676}
              priority
              sizes="200px"
              className="w-[160px] sm:w-[200px] h-auto"
              {...blurProps("/images/logo.png")}
            />
          </Link>
          <div className="order-last w-full -ml-2.5 sm:order-none sm:w-auto sm:ml-auto">
            <DashboardNav />
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="press px-2 py-2 font-sans text-sm text-warm-gray-500 hover:text-brand-blue"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
    </div>
  );
}
