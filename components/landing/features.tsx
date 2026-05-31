"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Users,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Dataset Processing",
    description:
      "Automatic text extraction, chunking, quality scoring, and language detection powered by state-of-the-art AI models.",
    gradient: "from-orange-500 to-red-600",
    shadow: "brand-shadow-soft",
  },
  {
    icon: Users,
    title: "Crowdsourced Annotation",
    description:
      "Distributed annotation system with task queues, skill matching, and real-time collaboration for Amharic text labeling.",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Expert Quality Control",
    description:
      "Multi-level validation with inter-annotator agreement, expert adjudication, and automated quality metrics.",
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: ShoppingBag,
    title: "Dataset Marketplace",
    description:
      "Browse, preview, and purchase versioned datasets with rich metadata, quality certificates, and instant downloads.",
    gradient: "from-orange-500 to-amber-500",
    shadow: "brand-shadow-soft",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Built-in payment processing for dataset purchases and contributor payouts with transparent revenue sharing.",
    gradient: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Real-time dashboards for contributors, annotators, and admins with engagement, quality, and revenue metrics.",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] brand-bg-faint rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to Build{" "}
            <span className="brand-gradient-text">AI Datasets</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            A complete end-to-end platform for dataset collection, annotation,
            quality assurance, and distribution.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={`group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.shadow}`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
