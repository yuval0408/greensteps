import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Leaf, Wind, Sparkles } from "lucide-react";

export default function SplashLoader({ onComplete, durationMs = 7500 }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Sensing eco breeze...");

  // Progress Counter & Status Text updates over 7 seconds
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct < 25) {
        setStatusText("Sensing eco breeze...");
      } else if (pct < 50) {
        setStatusText("Nurturing virtual canopy...");
      } else if (pct < 75) {
        setStatusText("Calibrating habit impact...");
      } else if (pct < 100) {
        setStatusText("Preparing Login Gateway...");
      } else {
        setStatusText("100% · Opening Login...");
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 350);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  // Generate 10 floating 3D leaves with different initial trajectories
  const floatingLeaves = Array.from({ length: 12 }).map((_, idx) => {
    const startX = (idx % 2 === 0 ? -120 : 120) + (idx * 15 - 80);
    const startY = 160 + (idx % 3) * 40;
    const endX = (idx % 2 === 0 ? 140 : -140) + (idx * 10 - 50);
    const endY = -220 - (idx % 4) * 30;
    const size = 18 + (idx % 4) * 8;
    const delay = idx * 0.45;
    const duration = 4.5 + (idx % 3) * 0.8;

    return { id: idx, startX, startY, endX, endY, size, delay, duration };
  });

  return (
    <div className="w-full min-h-screen bg-[#F1F8E9] text-[#1F2937] flex flex-col justify-between items-center p-6 max-w-[430px] mx-auto font-sans relative border-x border-[#85a528]/30 shadow-2xl md:my-4 md:border md:rounded-3xl md:min-h-[844px] overflow-hidden select-none">
      
      {/* Background 3D Perspective Canvas Container */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden" 
        style={{ perspective: "1000px" }}
      >
        {/* Ambient Soft Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#85a528]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#a6cd37]/20 rounded-full blur-2xl" />

        {/* Floating 3D Air Motion Leaves */}
        {floatingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{
              x: leaf.startX,
              y: leaf.startY,
              opacity: 0,
              scale: 0.5,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
            }}
            animate={{
              x: [leaf.startX, leaf.startX * 0.5, leaf.endX * 0.6, leaf.endX],
              y: [leaf.startY, leaf.startY * 0.2, leaf.endY * 0.5, leaf.endY],
              opacity: [0, 0.85, 0.9, 0],
              scale: [0.6, 1.1, 0.95, 0.7],
              rotateX: [0, 180, 360, 540],
              rotateY: [0, 270, 540, 720],
              rotateZ: [0, 120, 240, 360],
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 text-[#85a528] drop-shadow-md"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <Leaf 
              className="fill-current text-[#85a528]" 
              style={{ width: `${leaf.size}px`, height: `${leaf.size}px` }} 
            />
          </motion.div>
        ))}

        {/* Soft Air Current Lines */}
        <motion.div
          animate={{
            x: [-150, 150],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-0 w-full flex items-center justify-center opacity-30 text-[#85a528]"
        >
          <Wind className="w-12 h-12 stroke-[1.5]" />
        </motion.div>
      </div>

      {/* Top Spacer */}
      <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-[#85a528] uppercase tracking-widest z-10">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#85a528]" />
        <span>Eco Air Motion</span>
      </div>

      {/* Center 3D Hero Emblem & Title */}
      <div className="flex flex-col items-center text-center space-y-6 my-auto z-10">
        
        {/* 3D Rotating Hero Leaf Orb */}
        <div className="relative" style={{ perspective: "800px" }}>
          <motion.div
            animate={{
              rotateY: [0, 15, -15, 0],
              rotateX: [0, -10, 10, 0],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 bg-white border-2 border-[#85a528]/40 rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Inner Motion Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#85a528]/10 to-[#a6cd37]/30 animate-pulse" />
            
            {/* Center #85a528 Leaf */}
            <motion.div
              animate={{
                scale: [0.95, 1.1, 0.95],
                rotateZ: [0, 8, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Leaf className="w-12 h-12 text-[#85a528] fill-current drop-shadow-sm" />
            </motion.div>
          </motion.div>

          <span className="absolute -bottom-2 -right-2 bg-[#85a528] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            3D Eco Engine
          </span>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1 pt-1">
          <span className="block text-[10px] tracking-[0.3em] text-[#85a528] font-bold uppercase">
            SUSTAINABLE HABITS HUB
          </span>
          <h1 className="text-3xl font-bold text-[#1F2937] tracking-tight drop-shadow-sm">
            GreenSteps
          </h1>
          <p className="text-xs text-[#6B7280] font-medium">
            Small choices. Big green impact.
          </p>
        </div>

        {/* 7-Second Real-Time Progress Bar */}
        <div className="w-64 space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[#85a528] transition-all">{statusText}</span>
            <span className="text-[#1F2937] font-mono">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-white border border-[#85a528]/30 rounded-full overflow-hidden shadow-inner p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#85a528] to-[#a6cd37] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="py-3 text-center border-t border-[#85a528]/20 text-[10px] text-[#9f9fa5] z-10 w-full">
        Eco Green Air Motion · Encrypted Gateway · 7s Loading
      </footer>

    </div>
  );
}
