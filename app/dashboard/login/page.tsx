import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { isAuthenticated } from "@/lib/auth/guard";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// Reads cookies — must never be prerendered.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/dashboard");

  return (
    <section className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logo.png"
            alt={company.name}
            width={2649}
            height={676}
            priority
            sizes="320px"
            className="w-full max-w-[280px] h-auto"
            {...blurProps("/images/logo.png")}
          />
        </div>
        <div className="bg-white rounded-2xl border border-warm-gray-200 p-8 shadow-sm">
          <h1 className="text-2xl font-serif text-warm-gray-900 mb-1">Dashboard</h1>
          <p className="text-sm font-sans text-warm-gray-500 mb-6">
            Enter the password to continue.
          </p>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
