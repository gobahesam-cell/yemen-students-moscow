"use client";

import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1515165562835-c3b8c918f4fd?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1200&q=60"
];

export default function ImageGrid() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(src)}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="gallery"
              className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(null)}
          role="button"
        >
          <div className="max-w-4xl overflow-hidden rounded-2xl bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={open}
              alt="preview"
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}