"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  Bot,
  PenTool,
  ShieldCheck,
  Database,
  Store,
  ArrowRight,
} from "lucide-react";

const pipelineSteps = [
  { icon: FileText, label: "Documents", color: "from-slate-500 to-slate-600" },
  { icon: Bot, label: "AI Processing", color: "from-orange-500 to-red-600" },
  { icon: PenTool, label: "Annotators", color: "from-blue-500 to-cyan-500" },
  {
    icon: ShieldCheck,
    label: "Experts",
    color: "from-emerald-500 to-teal-500",
  },
  { icon: Database, label: "Dataset", color: "from-amber-500 to-orange-500" },
  { icon: Store, label: "Marketplace", color: "from-pink-500 to-rose-500" },
];

export function AIPipeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            AI Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            End-to-End{" "}
            <span className="brand-gradient-text">Data Pipeline</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            From raw documents to marketplace-ready datasets — fully automated
            with human-in-the-loop quality assurance.
          </p>
        </motion.div>

        <div ref={ref} className="relative">
          <div className="hidden lg:flex items-center justify-between gap-4">
            {pipelineSteps.map((step, index) => (
              <div key={step.label} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {step.label}
                  </span>
                </motion.div>

                {index < pipelineSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.1 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-border to-border/50" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-1 shrink-0" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:hidden flex flex-col items-center gap-6">
            {pipelineSteps.map((step, index) => (
              <div
                key={step.label}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 w-full max-w-xs"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shrink-0`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </motion.div>
                {index < pipelineSteps.length - 1 && (
                  <div className="w-0.5 h-6 bg-border" />
                )}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-orange-500/20 via-blue-500/20 via-emerald-500/20 via-amber-500/20 to-pink-500/20 origin-left -z-10 blur-sm"
          />
        </div>
      </div>
    </section>
  );
}
