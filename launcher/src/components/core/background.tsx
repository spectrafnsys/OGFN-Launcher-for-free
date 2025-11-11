"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BackgroundProps {
  mousePosition: { x: number; y: number };
}

export function Background({ mousePosition }: BackgroundProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      rotation: number;
    }>
  >([]);

  useEffect(() => {
    const gridSize = 10;
    const spacing = 100 / gridSize;

    const newParticles = Array.from(
      { length: gridSize * gridSize },
      (_, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        const jitter = spacing * 0.4;

        return {
          id: index,
          x: col * spacing + Math.random() * jitter - jitter / 2,
          y: row * spacing + Math.random() * jitter - jitter / 2,
          size: Math.random() * 5 + 3,
          opacity: Math.random() * 0.25 + 0.1,
          rotation: Math.random() * 360,
        };
      }
    );

    setParticles(newParticles);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 150 }}
      transition={{
        duration: 0.5,
        delay: 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-indigo-500/8 via-indigo-500/4 to-transparent rounded-full blur-3xl"
        style={{ animation: "smoothPulse 6s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-purple-500/6 via-purple-500/3 to-transparent rounded-full blur-3xl"
        style={{ animation: "smoothPulse 8s ease-in-out infinite 2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-gradient-radial from-pink-500/4 via-pink-500/2 to-transparent rounded-full blur-2xl"
        style={{ animation: "smoothPulse 10s ease-in-out infinite 4s" }}
      />

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.id * 0.05}s`,
            animationDuration: `${6 + (particle.id % 6)}s`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translate(${mousePosition.x * 0.005}px, ${
            mousePosition.y * 0.005
          }px)`,
        }}
      />

      <style>{`
        @keyframes smoothPulse {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </motion.div>
  );
}
