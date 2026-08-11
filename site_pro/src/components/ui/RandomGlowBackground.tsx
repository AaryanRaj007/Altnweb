"use client";

import { motion } from "motion/react";

export default function RandomGlowBackground() {
  // Generate random glow orbs
  const orbs = Array.from({ length: 5 }).map((_, i) => {
    const size = Math.random() * 40 + 30; // 30vw to 70vw
    const duration = Math.random() * 10 + 15; // 15s to 25s
    const xPositions = [
      `${Math.random() * 100}%`,
      `${Math.random() * 100}%`,
      `${Math.random() * 100}%`,
    ];
    const yPositions = [
      `${Math.random() * 100}%`,
      `${Math.random() * 100}%`,
      `${Math.random() * 100}%`,
    ];
    
    // Choose a subtle, cinematic color for the glow
    const colors = [
      "rgba(60, 166, 255, 0.4)", // Blue
      "rgba(255, 255, 255, 0.2)", // White/Silver
      "rgba(100, 100, 100, 0.3)", // Gray
    ];
    const color = colors[i % colors.length];

    return (
      <motion.div
        key={i}
        className="absolute rounded-full mix-blend-screen pointer-events-none"
        style={{
          width: `${size}vw`,
          height: `${size}vw`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{
          left: xPositions,
          top: yPositions,
          scale: [1, 1.2, 0.8, 1],
          opacity: [0.3, 0.6, 0.2, 0.3],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-black">
      <img 
        src="/bg-frame.jpg" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0">
        {orbs}
      </div>
      {/* Heavy dark vignette overlay to ensure text legibility on the black site */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
