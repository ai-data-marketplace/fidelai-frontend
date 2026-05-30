"use client";

import { motion } from "framer-motion";
import { Upload, PenTool, ShieldCheck, ShoppingBag } from "lucide-react";

const roles = [
  {
    icon: Upload,
    title: "Contributors",
    subtitle: "Upload & Earn",
    description:
      "Upload Amharic documents and earn revenue when your datasets are sold on the marketplace. Track your contributions and earnings in real time.",
    perks: ["Revenue sharing", "Upload dashboard", "Contribution analytics"],
    gradient: "from-orange-500 to-red-600",
    border: "brand-hover-border-strong",
    glow: "brand-hover-shadow-role",
  },
  {
    icon: PenTool,
    title: "Annotators",
    subtitle: "Label & Get Paid",
    description:
      "Complete annotation tasks from the queue and get paid for each validated submission. Build your skills and increase your pay rate.",
    perks: ["Task-based pay", "Skill progression", "Performance bonuses"],
    gradient: "from-blue-500 to-cyan-500",
    border: "hover:border-blue-500/30",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Experts",
    subtitle: "Review & Ensure Quality",
    description:
      "Adjudicate conflicting annotations and ensure dataset quality. Your expertise shapes the gold standard for Amharic NLP.",
    perks: ["Premium rates", "Expert badge", "Impact metrics"],
    gradient: "from-emerald-500 to-teal-500",
    border: "hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: ShoppingBag,
    title: "Buyers",
    subtitle: "Purchase Quality Datasets",
    description:
      "Browse and purchase production-ready Amharic datasets with quality certificates. Access versioned data for your AI models.",
    perks: ["Quality guaranteed", "Instant download", "Version history"],
    gradient: "from-orange-500 to-amber-500",
    border: "brand-hover-border-strong",
    glow: "brand-hover-shadow-role",
  },
];

export function Roles() {
  return (
    <section className="relative py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            Platform Roles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            A Role for <span className="brand-gradient-text">Everyone</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Whether you contribute data, annotate text, ensure quality, or build
            AI — there&apos;s a place for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${role.border} ${role.glow}`}
            >
              <div className="flex items-start gap-5">
                <div
                  className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold">{role.title}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                      {role.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.perks.map((perk) => (
                      <span
                        key={perk}
                        className="text-xs font-medium px-3 py-1 rounded-full bg-foreground/5 text-foreground/70 border border-border/50"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
