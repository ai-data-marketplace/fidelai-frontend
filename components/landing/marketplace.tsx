"use client";

import { motion } from "framer-motion";
import {
  Star,
  Download,
  ArrowRight,
  Globe,
  Database,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const datasets = [
  {
    title: "Amharic News Corpus v2.1",
    language: "Amharic",
    size: "2.4 GB",
    records: "185K",
    quality: 98.5,
    price: 299,
    category: "Text",
    downloads: 1243,
  },
  {
    title: "Amharic Sentiment Dataset",
    language: "Amharic",
    size: "890 MB",
    records: "52K",
    quality: 97.2,
    price: 199,
    category: "Sentiment",
    downloads: 876,
  },
  {
    title: "Named Entity Recognition",
    language: "Amharic",
    size: "1.1 GB",
    records: "94K",
    quality: 96.8,
    price: 249,
    category: "NER",
    downloads: 654,
  },
  {
    title: "POS Tagging Corpus",
    language: "Amharic",
    size: "650 MB",
    records: "73K",
    quality: 95.4,
    price: 179,
    category: "POS",
    downloads: 432,
  },
];

function QualityBadge({ score }: { score: number }) {
  const color =
    score >= 98
      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      : score >= 96
        ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
        : "text-amber-500 bg-amber-500/10 border-amber-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      <BadgeCheck className="w-3 h-3" />
      {score}%
    </span>
  );
}

export function Marketplace() {
  return (
    <section id="marketplace" className="relative py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            Marketplace
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Browse <span className="brand-gradient-text">Quality Datasets</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore curated, quality-verified Amharic datasets ready for your AI
            models.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {datasets.map((dataset, index) => (
            <motion.div
              key={dataset.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden brand-hover-border hover:-translate-y-1 hover:shadow-xl brand-hover-shadow-subtle transition-all duration-300"
            >
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full brand-chip">
                    {dataset.category}
                  </span>
                  <QualityBadge score={dataset.quality} />
                </div>

                <h3 className="text-base font-semibold mb-1 group-hover-brand-text transition-colors line-clamp-2">
                  {dataset.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Globe className="w-3 h-3" />
                  {dataset.language}
                  <span className="text-border">·</span>
                  <Database className="w-3 h-3" />
                  {dataset.size}
                </div>
              </div>

              <div className="p-6 pt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{dataset.records} records</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {dataset.downloads}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <div className="text-xl font-bold">${dataset.price}</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/buyer"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white brand-gradient-btn rounded-2xl shadow-lg brand-shadow brand-shadow-hover transition-all hover:-translate-y-0.5"
          >
            Browse Full Marketplace
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
