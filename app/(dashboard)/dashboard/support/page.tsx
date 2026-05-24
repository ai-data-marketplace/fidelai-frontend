"use client";

import { Accordion } from "@/components/ui/accordion";
import { mockFaqs } from "@/lib/mocks/dashboard";
import { LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";

export default function SupportPage() {
  const faqItems = mockFaqs.map((faq, i) => ({
    id: `faq-${i}`,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Find answers, learn more about the platform, or contact our team.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-12">
          <section className="bg-card rounded-2xl border p-8 shadow-sm w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <LifeBuoy size={20} />
              </div>
              <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
            </div>

            <Accordion items={faqItems} className="w-full" />
          </section>
        </div>
      </div>
    </motion.div>
  );
}
