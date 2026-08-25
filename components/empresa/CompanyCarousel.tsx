"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";

const SLIDES = [
  {
    src: "/assets/op-frota.jpg",
    alt: "Caminhões da frota Sólida estacionados lado a lado",
    caption: "Frota própria",
  },
  {
    src: "/assets/frota-detalhe.jpg",
    alt: "Baú de caminhão da frota da Sólida Transporte com a marca da empresa",
    caption: "Caminhões com a marca da Sólida",
  },
  {
    src: "/assets/op-galpao.jpg",
    alt: "Interior do galpão da Sólida com cargas organizadas em pallets",
    caption: "Galpão de chegada e despacho em Goiânia",
  },
  {
    src: "/assets/op-equipe.jpg",
    alt: "Equipe da Sólida conferindo mercadorias no galpão",
    caption: "Conferência de carga",
  },
  {
    src: "/assets/op-carga.jpg",
    alt: "Caixas e volumes engradados prontos para despacho",
    caption: "Volumes prontos para despacho",
  },
];

const AUTOPLAY_MS = 4500;

/**
 * Carrossel com autoplay em loop. Pausa com hover/foco e desliga o
 * avanço automático quando o visitante prefere menos movimento.
 */
export function CompanyCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [paused, reduceMotion]);

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Fotos da empresa e da frota"
      className="group relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="relative aspect-[4/3] w-full shrink-0 sm:aspect-[21/9]"
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1280px) 1120px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent"
            />
            <p className="absolute inset-x-0 bottom-0 p-5 pb-12 text-sm font-semibold text-white sm:pb-14 sm:text-base">
              {slide.caption}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Foto anterior"
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-ink/45 p-2 text-white backdrop-blur-sm transition hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Próxima foto"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-ink/45 p-2 text-white backdrop-blur-sm transition hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para a foto ${i + 1} de ${SLIDES.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
