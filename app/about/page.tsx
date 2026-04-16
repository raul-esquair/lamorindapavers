import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Steve Barsanti, owner of Lamorinda Pavers. Over a decade of premium paver installations in the East Bay. Licensed #1092749. Learn our story.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
