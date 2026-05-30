"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is this platform?",
    answer:
      "FidelAI is an AI-powered data marketplace and crowdsourcing platform specifically designed for Amharic language datasets. It enables contributors to upload data, annotators to label it, experts to ensure quality, and buyers to purchase production-ready datasets for their AI models.",
  },
  {
    question: "How do contributors earn money?",
    answer:
      "Contributors earn revenue when their uploaded datasets are purchased through the marketplace. The platform uses a transparent revenue-sharing model where contributors receive a percentage of each sale. You can track your earnings in real time via the contributor dashboard.",
  },
  {
    question: "How are datasets validated for quality?",
    answer:
      "Datasets go through a multi-level validation pipeline: AI-powered quality scoring, distributed annotation with inter-annotator agreement measurement, and expert adjudication for difficult cases. Each dataset receives a quality certificate with detailed metrics.",
  },
  {
    question: "Who can buy datasets?",
    answer:
      "Anyone can create a buyer account to browse and purchase datasets. Our customers include academic researchers, AI/ML companies, government agencies, and independent developers working on Amharic NLP applications.",
  },
  {
    question: "Is payment secure?",
    answer:
      "Yes, all payments are processed through secure, industry-standard payment gateways. Contributor payouts are handled through verified payment channels with full transaction transparency. We never store sensitive payment information on our servers.",
  },
  {
    question: "What types of Amharic datasets are available?",
    answer:
      "The marketplace includes text corpora, sentiment analysis datasets, named entity recognition (NER) datasets, POS tagging data, translation pairs, audio transcriptions, and more. Each dataset is versioned, documented, and quality-verified.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium group-hover-brand-text transition-colors pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full brand-chip text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="brand-gradient-text">Questions</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground">
            Everything you need to know about FidelAI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm px-6 sm:px-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
