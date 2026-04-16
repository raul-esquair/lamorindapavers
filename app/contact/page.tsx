import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a free estimate for your paver project. Contact Lamorinda Pavers — serving the East Bay. Call 925-389-0119 or fill out our form. Licensed #1092749.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
