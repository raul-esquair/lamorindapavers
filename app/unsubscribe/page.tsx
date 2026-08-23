import type { Metadata } from "next";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import { getRequestByToken } from "@/lib/reviews/queries";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t: token } = await searchParams;

  let email: string | null = null;
  if (token) {
    try {
      email = (await getRequestByToken(token))?.email ?? null;
    } catch (err) {
      console.error("Unsubscribe lookup failed:", err);
    }
  }

  return (
    <section className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logo.png"
            alt={company.name}
            width={2649}
            height={676}
            priority
            sizes="280px"
            className="w-full max-w-[280px] h-auto"
            {...blurProps("/images/logo.png")}
          />
        </div>
        <UnsubscribeForm token={token ?? ""} email={email} />
        <p className="mt-12 font-sans text-xs text-warm-gray-400">
          {company.name} &middot; CA Lic. #{company.license}
        </p>
      </div>
    </section>
  );
}
