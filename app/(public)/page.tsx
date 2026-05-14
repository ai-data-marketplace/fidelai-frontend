import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

const Features = dynamic(() =>
  import("@/components/landing/features").then(mod => ({ default: mod.Features }))
);
const HowItWorks = dynamic(() =>
  import("@/components/landing/how-it-works").then(mod => ({ default: mod.HowItWorks }))
);
const Roles = dynamic(() =>
  import("@/components/landing/roles").then(mod => ({ default: mod.Roles }))
);
const AIPipeline = dynamic(() =>
  import("@/components/landing/ai-pipeline").then(mod => ({ default: mod.AIPipeline }))
);
const Marketplace = dynamic(() =>
  import("@/components/landing/marketplace").then(mod => ({ default: mod.Marketplace }))
);
const Testimonials = dynamic(() =>
  import("@/components/landing/testimonials").then(mod => ({ default: mod.Testimonials }))
);
const FAQ = dynamic(() =>
  import("@/components/landing/faq").then(mod => ({ default: mod.FAQ }))
);
const CTA = dynamic(() =>
  import("@/components/landing/cta").then(mod => ({ default: mod.CTA }))
);
const Footer = dynamic(() =>
  import("@/components/landing/footer").then(mod => ({ default: mod.Footer }))
);

export const metadata = {
  title: "FidelAI — AI Data Marketplace for Amharic Language",
  description:
    "Collect, annotate, validate, and sell high-quality Amharic datasets using AI-powered workflows and crowdsourcing.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roles />
      <AIPipeline />
      <Marketplace />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
