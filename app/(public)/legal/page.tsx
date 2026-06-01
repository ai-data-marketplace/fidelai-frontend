import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const lastUpdated = "June 1, 2026";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="container mx-auto max-w-5xl px-4 py-20">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Legal Notice
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Terms and Privacy Policy
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                This page summarizes how {APP_NAME} is used, what users agree to,
                and how we treat personal and platform data. It is intended to
                provide a clear, professional reference in one place.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: <span className="font-medium text-foreground">{lastUpdated}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold">Terms of Use</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                By accessing {APP_NAME}, you agree to use the platform only for
                lawful purposes and in accordance with applicable regulations.
              </p>
              <p>
                Users are responsible for the accuracy, ownership, and lawful
                submission of datasets, files, annotations, and supporting
                documentation uploaded to the platform.
              </p>
              <p>
                We may suspend or restrict access to protect the integrity of
                the marketplace, prevent abuse, or address policy violations.
              </p>
              <p>
                Content, branding, and platform materials remain protected by
                applicable intellectual property rights unless otherwise stated.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold">Privacy Overview</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                We collect account information, submissions, usage activity, and
                other data needed to operate the marketplace, maintain security,
                and improve the user experience.
              </p>
              <p>
                Uploaded documents and dataset metadata are processed to support
                review, quality control, marketplace operations, and compliance
                workflows.
              </p>
              <p>
                Access to personal data is limited to authorized system processes
                and personnel with a legitimate business need.
              </p>
              <p>
                Where required, we may retain records to meet legal, security, or
                audit obligations.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <article className="rounded-2xl border bg-muted/30 p-6">
            <h3 className="font-semibold">Data Use</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Data is used to deliver services, verify submissions, enable
              marketplace activity, and support platform analytics.
            </p>
          </article>
          <article className="rounded-2xl border bg-muted/30 p-6">
            <h3 className="font-semibold">User Responsibility</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              You must ensure that you have the right to share the materials you
              upload and that your use of the platform complies with local law.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
