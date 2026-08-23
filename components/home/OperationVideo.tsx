"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function OperationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(videoRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();

  // Toca só com o vídeo na tela (e nunca com prefers-reduced-motion) —
  // fora dela pausa, para não gastar banda nem bateria à toa
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !reduceMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reduceMotion]);

  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/operacao-video-poster.jpg"
              aria-label="Vídeo institucional da operação da Sólida Transporte"
              className="aspect-video w-full object-cover"
            >
              <source src="/assets/operacao-video.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
