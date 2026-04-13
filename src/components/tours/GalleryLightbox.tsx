"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  tourName: string;
}

export function GalleryLightbox({ images, tourName }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      {/* Grid de miniaturas */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <Image
              src={url}
              alt={`${tourName} - foto ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width:640px) 50vw, (max-width:896px) 33vw, 280px"
              quality={85}
            />
            {/* Overlay con lupa al hacer hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-earth-900/0 transition-all duration-300 group-hover:bg-earth-900/40">
              <ZoomIn
                className="h-8 w-8 text-white opacity-0 drop-shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navegación anterior */}
          {selected > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(selected - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-4 text-white text-xl transition hover:bg-white/20"
            >
              ‹
            </button>
          )}

          {/* Imagen grande */}
          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected]}
              alt={`${tourName} - foto ${selected + 1}`}
              width={1200}
              height={800}
              className="h-auto max-h-[85vh] w-full object-contain"
              quality={95}
              priority
            />
          </div>

          {/* Navegación siguiente */}
          {selected < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(selected + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-4 text-white text-xl transition hover:bg-white/20"
            >
              ›
            </button>
          )}

          {/* Contador */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {selected + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}