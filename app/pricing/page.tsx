import { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing Plans | Warehouse Worker Resume Generator",
  description: "Affordable pricing plans for professional warehouse worker resume generation. Choose the plan that fits your needs - Free, Basic, or Premium.",
  keywords: "resume pricing, resume builder cost, warehouse resume plans, affordable resume service",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
