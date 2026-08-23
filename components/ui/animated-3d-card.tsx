"use client";

import React, { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Adaptação do "animated-3d-card": mantém o tilt 3D que segue o mouse,
 * a elevação no hover e o brilho que varre o card, mas sem impor gradiente,
 * fundo ou tipografia — cores e layout vêm do className de quem usa.
 */

const MAX_TILT = 8;

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  /** "light": brilho branco (cards escuros) · "dark": brilho grafite sutil (cards claros) */
  glare?: "light" | "dark";
}

export function Card3D({ children, className, glare = "light" }: Card3DProps) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * MAX_TILT * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -(MAX_TILT * 2),
    });
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const glareColor =
    glare === "light" ? "rgba(255,255,255,0.16)" : "rgba(14,14,14,0.05)";

  return (
    <div className="h-full" style={{ perspective: 1200 }}>
      <motion.div
        className={cn("relative", className)}
        onMouseMove={reduceMotion ? undefined : handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        animate={
          reduceMotion
            ? undefined
            : {
                rotateX: tilt.y,
                rotateY: tilt.x,
                y: hovered ? -4 : 0,
                scale: hovered ? 1.02 : 1,
              }
        }
        transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <motion.div
            className="absolute -inset-full"
            animate={{
              background:
                hovered && !reduceMotion
                  ? `linear-gradient(${tilt.x * 2 + 135}deg, transparent 40%, ${glareColor} 50%, transparent 60%)`
                  : `linear-gradient(135deg, transparent 40%, transparent 50%, transparent 60%)`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {children}
      </motion.div>
    </div>
  );
}
