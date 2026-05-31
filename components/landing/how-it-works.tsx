"use client";

import { motion } from "framer-motion";
import { Upload, Bot, PenTool, ShoppingCart } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Data",
    description:
      "Contributors upload Amharic text documents, audio files, or images to the platform for processing.",
    color: "from-orange-500 to-red-600",
    glow: "brand-glow",
  },
  {
    icon: Bot,
    step: "02",
    title: "AI Processes Documents",
    description:
      "Our AI pipeline extracts text, segments into chunks, detects language, and generates quality scores automatically.",
    color: "from-blue-500 to-cyan-500",
    glow: "bg-blue-500/20",
  },
  {
    icon: PenTool,
    step: "03",
    title: "Annotators Label Data",
    description:
      "Skilled annotators claim tasks, label text chunks with categories, entities, and sentiments through our workspace.",
    color: "from-emerald-500 to-teal-500",
    glow: "bg-emerald-500/20",
  },
  {
    icon: ShoppingCart,
    step: "04",
    title: "Buyers Purchase Datasets",
    description:
      "Validated, versioned datasets are published to the marketplace for researchers and companies to purchase.",
    color: "from-orange-500 to-amber-500",
    glow: "brand-glow",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            From Raw Data to{" "}
            <span className="brand-gradient-text">Production Datasets</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Four simple steps to create and monetize high-quality Amharic AI
            datasets.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-orange-500/30 via-blue-500/30 via-emerald-500/30 to-orange-500/30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative text-center group"
              >
                <div className="relative mx-auto mb-6 w-20 h-20">
                  <div
                    className={`absolute inset-0 ${step.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
