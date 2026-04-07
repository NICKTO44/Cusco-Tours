"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

type GalleryImage = {
  src: string;
  title?: string;
  category?: string;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, currentIndex]);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selected]);

  const openModal = (img: GalleryImage, index: number) => {
    setSelected(img);
    setCurrentIndex(index);
  };

  const goNext = () => {
    const next = (currentIndex + 1) % images.length;
    setCurrentIndex(next);
    setSelected(images[next]);
  };

  const goPrev = () => {
    const prev = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prev);
    setSelected(images[prev]);
  };

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <FadeIn key={img.src} delay={i * 0.04} className="mb-4 break-inside-avoid">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => openModal(img, i)}
            >
              <Image
                src={img.src}
                alt={img.title ?? "Mascca Tours Cusco"}
                width={800}
                height={800}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {img.title && <p className="text-white font-semibold text-sm drop-shadow">{img.title}</p>}
                {img.category && (
                  <span className="inline-block mt-1 rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-earth-900">
                    {img.category}
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition flex items-center gap-1.5 text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cerrar
              </button>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={selected.src}
                  alt={selected.title ?? "Mascca Tours Cusco"}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[80vh] object-contain bg-black"
                  sizes="(max-width:1280px) 100vw, 1200px"
                  priority
                />
                {(selected.title || selected.category) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    {selected.title && <p className="text-white font-semibold text-lg">{selected.title}</p>}
                    {selected.category && (
                      <span className="inline-block mt-1 rounded-full bg-gold-500 px-3 py-0.5 text-xs font-bold text-earth-900">
                        {selected.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 px-1">
                <button onClick={goPrev}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition text-sm font-medium bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>
                <span className="text-white/60 text-sm">{currentIndex + 1} / {images.length}</span>
                <button onClick={goNext}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition text-sm font-medium bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">
                  Siguiente
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
