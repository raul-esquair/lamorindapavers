import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth/guard";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import { logout } from "@/lib/actions/dashboard-auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/dashboard/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-warm-gray-200 bg-warm-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
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
          <form action={logout}>
            <button
              type="submit"
              className="font-sans text-sm text-warm-gray-500 hover:text-brand-blue transition-colors"
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
