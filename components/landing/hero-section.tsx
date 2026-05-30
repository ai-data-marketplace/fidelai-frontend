"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Amharic AI
          </span>
          <br />
          Data Marketplace
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Crowdsource, annotate, quality-check, and sell high-quality Amharic
          datasets powered by AI.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/register"
            className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="/documentation"
            className="rounded-lg border px-8 py-3 font-medium hover:bg-muted transition-colors"
          >
            Read the Docs
          </a>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
