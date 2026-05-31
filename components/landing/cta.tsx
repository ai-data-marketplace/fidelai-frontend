"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 brand-gradient-surface" />

          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px),
                                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 brand-bg-soft-faint rounded-full blur-3xl" />

          <div className="relative px-8 py-20 sm:px-16 sm:py-24 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              Join the Movement
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              Join the Future of
              <br />
              Amharic AI Data
            </h2>

            <p className="max-w-xl mx-auto text-lg text-white/70 mb-10 leading-relaxed">
              Be part of the largest Amharic AI data ecosystem. Whether you
              contribute, annotate, review, or build — your work accelerates
              African language AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 text-base font-semibold brand-text-strong bg-white rounded-2xl shadow-2xl shadow-black/20 hover:bg-white/95 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#marketplace"
                className="px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
