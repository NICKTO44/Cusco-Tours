"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

type Category = {
  key: string;
  label: string;
  icon: string;
};

type Props = {
  items: Item[];
  categories: Category[];
  className?: string;
};

// Categories that get a WhatsApp nudge at the bottom of the answer
const CTA_CATEGORIES = new Set(["booking", "trust", "tours"]);

export function FaqAccordion({ items, categories, className = "" }: Props) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className={className}>
      {/* ── Category filter pills ── */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setActiveCategory("all"); setOpen(null); }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-jungle-800 text-earth-50 shadow-sm"
              : "bg-white text-earth-700 ring-1 ring-earth-200 hover:ring-earth-400"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => { setActiveCategory(cat.key); setOpen(null); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat.key
                ? "bg-jungle-800 text-earth-50 shadow-sm"
                : "bg-white text-earth-700 ring-1 ring-earth-200 hover:ring-earth-400"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Accordion ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="space-y-2"
        >
          {filtered.map((item) => {
            const isOpen = open === item.id;
            const cat = categories.find((c) => c.key === item.category);
            const showCta = CTA_CATEGORIES.has(item.category);

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
                  isOpen
                    ? "border-jungle-300 shadow-md"
                    : "border-earth-200 hover:border-earth-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left md:px-5"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col gap-1">
                    {/* Category badge */}
                    {cat && (
                      <span className="text-xs font-semibold tracking-wide text-gold-600">
                        {cat.icon} {cat.label}
                      </span>
                    )}
                    <span className="font-semibold leading-snug text-earth-900">
                      {item.question}
                    </span>
                  </div>
                  <span
                    className={`mt-1 shrink-0 text-gold-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
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
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                    >
                      <div className="border-t border-earth-100 px-4 pb-5 pt-3 md:px-5">
                        <p className="text-sm leading-relaxed text-earth-600">
                          {item.answer}
                        </p>
                        {showCta && (
                          <a
                            href="https://wa.me/51927591622"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-700 transition hover:text-gold-600 hover:underline"
                          >
                            ¿Tienes más preguntas? Escríbenos por WhatsApp →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}