import Link from "next/link";
import { CheckCircle2, Users, TrendingUp, Shield, Database, Zap } from "lucide-react";

export const metadata = {
  title: 'About | FidelAI',
  description: 'Learn about FidelAI, the AI-powered Amharic data marketplace empowering contributors, annotators, and organizations.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto max-w-5xl px-4 py-20">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              About FidelAI
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight md:text-6xl">
                Powering AI Through Amharic Data
              </h1>
              <p className="max-w-3xl text-lg leading-7 text-muted-foreground md:text-xl">
                FidelAI is a community-driven marketplace that connects data contributors, 
                annotation specialists, and organizations to build high-quality Amharic datasets 
                for artificial intelligence and machine learning applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              To democratize access to high-quality Amharic language data and empower 
              individuals and organizations to contribute meaningfully to AI advancement. 
              We believe that quality data—carefully sourced, verified, and documented—is 
              the foundation of ethical and effective AI systems.
            </p>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold">Community-First</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built by and for contributors who want to be part of the AI revolution.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <Shield className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold">Quality Assured</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Multi-stage verification ensures datasets meet rigorous standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold mb-12">How FidelAI Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-background p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Contributors Upload</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Contributors submit high-quality Amharic datasets, documents, and corpora 
                across diverse domains including news, health, law, education, and more.
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Annotation & Review</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Specialized annotators and expert reviewers verify quality, accuracy, and 
                integrity through multi-stage quality control processes.
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Marketplace Access</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Organizations access vetted datasets for AI training, fine-tuning, and 
                research—fueling innovation in Amharic language technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">Platform Roles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8">
            <h3 className="text-lg font-semibold">Data Contributors</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Share valuable Amharic datasets, documents, and corpora. Earn revenue from 
              marketplace sales while maintaining ownership transparency.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-8">
            <h3 className="text-lg font-semibold">Annotators</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Provide linguistic and contextual annotations, labels, and verification 
              to enhance dataset quality and usefulness.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-8">
            <h3 className="text-lg font-semibold">Expert Reviewers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Conduct final adjudication and quality assurance to ensure datasets meet 
              platform and regulatory standards.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-8">
            <h3 className="text-lg font-semibold">Buyers & Researchers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Access curated, high-quality Amharic datasets to power AI models, research, 
              and language technology innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold mb-12">Our Commitment</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Quality First</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rigorous multi-stage review ensures every dataset meets strict quality standards.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Fair Compensation</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contributors and annotators are fairly compensated for their contributions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Transparency</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Clear communication on data usage, licensing, and platform operations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Data Privacy</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Personal information and sensitive data are protected under Ethiopian law.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Inclusivity</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open to contributors and users of all backgrounds and experience levels.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Compliance</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  All operations adhere to Ethiopian data and privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-12 text-center">
          <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of contributors, annotators, and organizations building the 
            future of Amharic AI.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
            <Link 
              href="/register" 
              className="inline-flex h-12 items-center justify-center rounded-xl brand-gradient-btn px-8 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
