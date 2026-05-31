"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Abebe Mekonnen",
    role: "NLP Researcher, Addis Ababa University",
    avatar: "AM",
    quote:
      "FidelAI has transformed how we source Amharic training data. The quality scores and versioning make it easy to build reliable NLP models.",
    org: "University",
    color: "brand-bg",
  },
  {
    name: "Sara Tekle",
    role: "ML Engineer, Ethio-AI Labs",
    avatar: "ST",
    quote:
      "We cut our data preparation time by 70%. The annotation workspace and quality control pipeline are exactly what we needed.",
    org: "AI Company",
    color: "bg-blue-500",
  },
  {
    name: "Dr. Yohannes Berhanu",
    role: "Computational Linguistics, Bahir Dar University",
    avatar: "YB",
    quote:
      "The expert adjudication system ensures annotation consistency that's critical for academic research. Truly a game-changer.",
    org: "University",
    color: "bg-emerald-500",
  },
  {
    name: "Meron Desta",
    role: "Head of Data, Kifiya Financial Technology",
    avatar: "MD",
    quote:
      "Purchasing validated Amharic datasets from the marketplace has accelerated our product development significantly.",
    org: "Enterprise",
    color: "brand-bg",
  },
  {
    name: "Henok Getachew",
    role: "Independent Contributor",
    avatar: "HG",
    quote:
      "As a contributor, I earn real money from my Amharic text uploads. The platform makes it easy to track everything.",
    org: "Contributor",
    color: "bg-pink-500",
  },
  {
    name: "Dr. Tigist Worku",
    role: "Director of AI, iCog Labs",
    avatar: "TW",
    quote:
      "The crowdsourcing model combined with AI pre-processing creates datasets of a quality we haven't seen before for Amharic.",
    org: "AI Company",
    color: "bg-amber-500",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Trusted by{" "}
            <span className="brand-gradient-text">Researchers & Companies</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            See what researchers, AI companies, and universities say about
            FidelAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              <Quote className="w-8 h-8 brand-text-faint mb-4" />

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>

              <div className="absolute top-6 right-6">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">
                  {t.org}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
