"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = { id: string; question: string; answer: string };

type Props = {
  items: Item[];
  className?: string;
};

export function FaqAccordion({ items, className = "" }: Props) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-earth-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-earth-900 md:px-5"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span
                className={`text-gold-600 transition ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="border-t border-earth-100 px-4 pb-4 pt-2 text-sm text-earth-600 md:px-5 md:pb-5">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
