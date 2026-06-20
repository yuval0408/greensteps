import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Mail, User, Lock, Sparkles, AlertCircle, BookOpen, ChevronRight, Sprout, Trees } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (name: string, email?: string, password?: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  // Field values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [previewStage, setPreviewStage] = useState<number>(1);
  const [focusedField, setFocusedField] = useState<"name" | "email" | "password" | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Trigger local shake animation on credential errors
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Target mouse coordinates relative tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Interpolated eye offsets (60fps feel, restricted to 8px - 12px max movement)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  // Blinking state (4-8 seconds random interval, natural)
  const [isBlinking, setIsBlinking] = useState(false);

  // Track mouse position coordinates safely
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (focusedField) return; // Keep eye orientation locked to active field when typing

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;

        const dx = (e.clientX - centerX) / (rect.width / 2 || 1);
        const dy = (e.clientY - centerY) / (rect.height / 2 || 1);

        // Clamp the radius vector to 1 max
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 1) {
          setMousePos({ x: dx / length, y: dy / length });
        } else {
          setMousePos({ x: dx, y: dy });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [focusedField]);

  // Handle smooth 60fps eye tracking interpolation
  useEffect(() => {
    let animId: number;

    // Constrain pupil inside eye socket (Radius of Socket = 8px, Pupil = 3.8px)
    // Maximum safe travel range = 8 - 3.8 - 1.0 (buffer) = 3.2px
    const maxTravel = 3.2;

    let targetX = 0;
    let targetY = 0;

    if (isSuccess) {
      // Small visual upward gaze for success bloom
      targetX = 0;
      targetY = -1.5;
    } else if (isError) {
      // Sorrowful neutral downward look
      targetX = -0.5;
      targetY = 1.5;
    } else if (focusedField === "name") {
      // Look towards first name field (Right and slightly down)
      targetX = 2.8;
      targetY = 1.0;
    } else if (focusedField === "email") {
      // Look towards email field (Right)
      targetX = 2.8;
      targetY = -0.2;
    } else if (focusedField === "password") {
      // Soft closed eyes (no tracking active, resets to center center behind eyelids)
      targetX = 0;
      targetY = 0;
    } else if (isBlinking) {
      // Centered eyes during passive blinks
      targetX = 0;
      targetY = 0;
    } else {
      // Passive tracking: 80% natural cursor dampening lag
      // Scales with custom bounds to feel incredibly responsive but mature
      targetX = mousePos.x * 3.5 * 0.8;
      targetY = mousePos.y * 3.0 * 0.8;
    }

    // Safety vector normalization clamp for target coords
    const targetDist = Math.sqrt(targetX * targetX + targetY * targetY);
    if (targetDist > maxTravel) {
      targetX = (targetX / targetDist) * maxTravel;
      targetY = (targetY / targetDist) * maxTravel;
    }

    const updateEyeMovement = () => {
      setEyeOffset((current) => {
        const dx = targetX - current.x;
        const dy = targetY - current.y;
        
        let nextX = current.x + dx * 0.12;
        let nextY = current.y + dy * 0.12;

        // Double check mathematical constraint on calculated final values as well
        const currentDist = Math.sqrt(nextX * nextX + nextY * nextY);
        if (currentDist > maxTravel) {
          nextX = (nextX / currentDist) * maxTravel;
          nextY = (nextY / currentDist) * maxTravel;
        }

        return { x: nextX, y: nextY };
      });
      animId = requestAnimationFrame(updateEyeMovement);
    };

    animId = requestAnimationFrame(updateEyeMovement);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, focusedField, isSuccess, isError, isBlinking]);

  // Natural blinking system (4-8s random cycle)
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;
    let transitionTimer: NodeJS.Timeout;

    const performBlink = () => {
      setIsBlinking(true);
      // Clean short realistic eye shut
      transitionTimer = setTimeout(() => {
        setIsBlinking(false);
        scheduleBlink();
      }, 180000 / 950); // ~190ms
    };

    const scheduleBlink = () => {
      const delay = Math.floor(Math.random() * 4000) + 4000; // 4-8s
      blinkTimer = setTimeout(performBlink, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  // Form submission validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    if (!name.trim()) {
      setIsError(true);
      setShakeTrigger((prev) => prev + 1);
      setErrorMessage("Please share your name so Sprout can address you! 🌱");
      return;
    }
    if (name.trim().length < 2) {
      setIsError(true);
      setShakeTrigger((prev) => prev + 1);
      setErrorMessage("Please enter a valid, organic name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsError(true);
      setShakeTrigger((prev) => prev + 1);
      setErrorMessage("Please enter a valid, active email address.");
      return;
    }
    if (password.length < 4) {
      setIsError(true);
      setShakeTrigger((prev) => prev + 1);
      setErrorMessage("Please type a secure habit password (at least 4 characters).");
      return;
    }

    // Success transition
    setIsSuccess(true);
    
    // Simulate premium state transition wait
    setTimeout(() => {
      onLoginSuccess(name.trim(), email.trim(), password);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col font-sans text-[#1F2937] antialiased">
      {/* Top micro brand banner */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-sm border-b border-[#E8F5E9]/50 sticky top-0 z-20">
        <div className="flex items-center gap-2 select-none">
          <Leaf className="w-5 h-5 fill-current text-[#2E7D32]" />
          <span className="font-extrabold text-lg tracking-tight text-[#1F2937]">GreenSteps</span>
        </div>
        <button
          onClick={() => setShowLearnMore(true)}
          className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9]/80 hover:bg-[#2E7D32]/10 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Our Vision</span>
        </button>
      </header>

      {/* Main dual bento-grid panel */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-16 flex flex-col justify-center items-center">
        <div className="bg-white rounded-[32px] border border-[#E8F5E9] shadow-[0_8px_40px_rgba(46,125,50,0.02)] overflow-hidden w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          
          {/* LEFT SIDE (55% ON DESKTOP): ELEGANT MINIMALIST SEED MASCOT ZONE */}
          <div className="col-span-1 md:col-span-7 bg-gradient-to-tr from-[#E8F5E9]/30 via-white to-amber-50/20 p-8 md:p-12 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-[#E8F5E9]/40 select-none overflow-hidden min-h-[360px] md:min-h-0">
            
            {/* Ambient clean background light halos */}
            <div className="absolute top-12 left-12 w-48 h-48 bg-emerald-50 rounded-full filter blur-3xl opacity-60" />
            <div className="absolute bottom-16 right-12 w-60 h-60 bg-amber-50/80 rounded-full filter blur-3xl opacity-55" />

            {/* Rising floating micro-leaves as success celebration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <AnimatePresence>
                {isSuccess && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-sm pointer-events-none text-emerald-600/80"
                        initial={{ 
                          x: 140 + (Math.random() - 0.5) * 80, 
                          y: 200, 
                          rotate: Math.random() * 360,
                          scale: 0.1,
                          opacity: 1
                        }}
                        animate={{ 
                          y: 40,
                          x: 140 + (Math.random() - 0.5) * 160 + Math.sin(i) * 30,
                          rotate: Math.random() * 360 + 180,
                          scale: [0.3, 1, 0.6],
                          opacity: [1, 1, 0]
                        }}
                        transition={{
                          duration: 1.8,
                          ease: "easeOut",
                          delay: i * 0.12
                        }}
                      >
                        {["🌱", "🍃", "☀️", "✨"][i % 4]}
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Clean, mature, minimalist layout messaging */}
            <div className="w-full text-center md:text-left z-10 space-y-1.5 md:max-w-md">
              <span className="text-xs font-bold text-[#2E7D32] tracking-widest uppercase bg-[#E8F5E9] px-2.5 py-1 rounded-full inline-block">
                Start From the Roots
              </span>
              <h1 className="text-3xl font-extrabold text-[#1F2937] leading-tight">
                Small Steps.<br />Lasting Impact.
              </h1>
              <p className="text-sm font-medium text-[#6B7280]">
                Build simple habits that help you, your community, and the planet.
              </p>
            </div>

            {/* THE PREMIUM SEED MASCOT WIDGET */}
            <div ref={containerRef} className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center my-4 z-10">
              
              {/* Soft visual warm glows around seed */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-[#E8F5E9]/40 rounded-full filter blur-2xl opacity-40 scale-75 animate-pulse" />
              
              {/* Dynamic state ambient backlights */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.45, scale: 1.35 }}
                    className="absolute w-56 h-56 rounded-full bg-emerald-300 filter blur-2xl pointer-events-none"
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Minimal Organic Vector Seed SVG */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-sm select-none"
              >
                <defs>
                  {/* Seed upper shells premium warm natural coordinates */}
                  <linearGradient id="seedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D7CCC8" />
                    <stop offset="100%" stopColor="#A1887F" />
                  </linearGradient>
                  
                  {/* Cap of seed woodland contrast */}
                  <linearGradient id="seedCapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8D6E63" />
                    <stop offset="100%" stopColor="#5D4037" />
                  </linearGradient>
                </defs>

                {/* Natural Ground Shadow */}
                <ellipse cx="100" cy="168" rx="28" ry="4.5" fill="#CFD8DC" opacity="0.6" />
                <ellipse cx="100" cy="168" rx="16" ry="2.5" fill="#90A4AE" opacity="0.4" />

                {/* GROWING SUCCESS ROOTS ANIMATING */}
                {isSuccess && (
                  <g id="growing-roots" opacity="0.8">
                    {/* Tiny Root Left */}
                    <motion.path
                      d="M 94 154 Q 86 166 80 162"
                      fill="none"
                      stroke="#8D6E63"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                    {/* Tiny Root Middle */}
                    <motion.path
                      d="M 100 156 L 100 170"
                      fill="none"
                      stroke="#8D6E63"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 0.2 }}
                    />
                    {/* Tiny Root Right */}
                    <motion.path
                      d="M 106 154 Q 114 168 120 164"
                      fill="none"
                      stroke="#8D6E63"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </g>
                )}

                {/* THE SEED BODY (Flat organic teardrop seed) */}
                <motion.g
                  id="seed-body"
                  animate={{
                    y: isSuccess ? [0, -6, -4] : [0, 2, 0],
                    scale: isSuccess ? 1.05 : 1
                  }}
                  transition={{
                    duration: 3,
                    repeat: isSuccess ? 0 : Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ transformOrigin: "100px 150px" }}
                >
                  
                  {/* Outer Seed Body */}
                  <path
                    d="M 100 68 
                       C 134 88, 142 128, 134 146
                       C 126 156, 108 158, 100 158
                       C 92 158, 74 156, 66 146
                       C 58 128, 66 88, 100 68 Z"
                    fill="url(#seedGradient)"
                    stroke="#8D6E63"
                    strokeWidth="1.5"
                  />

                  {/* Seed Top Cap overlay to build premium wooden depth */}
                  <path
                    d="M 100 68
                       C 118 78, 132 94, 134 104
                       Q 100 112 66 104
                       C 68 94, 82 78, 100 68 Z"
                    fill="url(#seedCapGradient)"
                    opacity="0.95"
                  />

                   {/* SEED EYES (Subtle, occupying < 15% of body, curious, classy) */}
                  <g id="seed-eyes">
                    {isBlinking || focusedField === "password" ? (
                      <g id="closed-eyelids">
                        {/* Left Blink / Close */}
                        <path
                          d="M 79 124 Q 84 126.5 89 124"
                          fill="none"
                          stroke="#3E2723"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        {/* Right Blink / Close */}
                        <path
                          d="M 111 124 Q 116 126.5 121 124"
                          fill="none"
                          stroke="#3E2723"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : (
                      <>
                        {/* Left Eye Socket (White of the eye) */}
                        <circle cx="84" cy="124" r="8" fill="white" stroke="#6D4C41" strokeWidth="1.2" />
                        
                        {/* Right Eye Socket (White of the eye) */}
                        <circle cx="116" cy="124" r="8" fill="white" stroke="#6D4C41" strokeWidth="1.2" />

                        {/* Left Pupil + Highlight group */}
                        <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                          {/* Pupil */}
                          <circle cx="84" cy="124" r="3.8" fill="#3D211B" />
                          {/* Highlight dot inside Pupil */}
                          <circle cx="82.6" cy="122.6" r="1.1" fill="white" />
                        </g>

                        {/* Right Pupil + Highlight group */}
                        <g style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}>
                          {/* Pupil */}
                          <circle cx="116" cy="124" r="3.8" fill="#3D211B" />
                          {/* Highlight dot inside Pupil */}
                          <circle cx="114.6" cy="122.6" r="1.1" fill="white" />
                        </g>
                      </>
                    )}

                    {/* Tiny cute smile line */}
                    <path
                      d="M 97 132 Q 100 135 103 132"
                      fill="none"
                      stroke="#3E2723"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />

                    {/* Rosy Cheek glow on Name focus / success */}
                    {(focusedField === "name" || isSuccess) && (
                      <g opacity="0.6">
                        <circle cx="75" cy="127" r="2.5" fill="#FFAB91" />
                        <circle cx="125" cy="127" r="2.5" fill="#FFAB91" />
                      </g>
                    )}
                  </g>



                  {/* SPROUTING SHOOT AT THE TOP on success */}
                  {isSuccess && (
                     <motion.g
                       id="emerging-sprout"
                       initial={{ scale: 0, y: 10 }}
                       animate={{ scale: 1, y: 0 }}
                       transition={{ duration: 1.1, ease: "easeOut" }}
                     >
                       {/* Little green stem */}
                       <path d="M 100 68 Q 98 48 108 38" fill="none" stroke="#4CAF50" strokeWidth="3.5" strokeLinecap="round" />
                       {/* Left tiny leaf */}
                       <path d="M 100 50 C 88 42, 85 55, 100 50" fill="#4CAF50" />
                       {/* Right tiny leaf */}
                       <path d="M 108 38 C 120 34, 118 48, 108 38" fill="#8BC34A" />
                     </motion.g>
                  )}

                  {/* PREMIUM PREVIEW STATE PROGRESSIVE FOLIAGE */}
                  {!isSuccess && (
                    <>
                      {/* Stage 1 (Seed): Simple Cap Leaf */}
                      {previewStage === 1 && (
                        <motion.path
                          d="M 100 68 Q 96 56 104 50 Q 108 58 100 68"
                          fill="#8BC34A"
                          animate={{
                            rotate: focusedField === "email" ? [-10, 10, -10] : [0, 5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{ transformOrigin: "100px 68px" }}
                        />
                      )}

                      {/* Stage 2 (Sprout): Dual-Leaf Sprout Stem */}
                      {previewStage === 2 && (
                        <motion.g
                          id="stage-sprout"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <path d="M 100 68 Q 98 48 108 38" fill="none" stroke="#4CAF50" strokeWidth="3.5" strokeLinecap="round" />
                          <path d="M 100 50 C 88 42, 85 55, 100 50" fill="#4CAF50" />
                          <path d="M 108 38 C 120 34, 118 48, 108 38" fill="#8BC34A" />
                        </motion.g>
                      )}

                      {/* Stage 3 (Plant): Thicker Stem, Multi-Leaf layout */}
                      {previewStage === 3 && (
                        <motion.g
                          id="stage-plant"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <path d="M 100 68 Q 97 42 104 28" fill="none" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
                          <path d="M 98 52 C 82 48, 80 62, 98 52" fill="#4CAF50" />
                          <path d="M 102 44 C 118 42, 116 54, 102 44" fill="#8BC34A" />
                          <path d="M 99 36 C 85 30, 88 42, 99 36" fill="#388E3C" />
                          <path d="M 104 28 C 104 16, 116 18, 104 28" fill="#8BC34A" />
                        </motion.g>
                      )}

                      {/* Stage 4 (Young Tree): Tree Canopy above wood trunk support */}
                      {previewStage === 4 && (
                        <motion.g
                          id="stage-young-tree"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <path d="M 100 68 L 100 48" fill="none" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
                          <circle cx="100" cy="38" r="20" fill="#2E7D32" />
                          <circle cx="86" cy="42" r="14" fill="#4CAF50" />
                          <circle cx="114" cy="42" r="14" fill="#8BC34A" />
                          <circle cx="100" cy="28" r="12" fill="#AEDB81" />
                        </motion.g>
                      )}

                      {/* Stage 5 (Tree): Mature and lush double-decker canopy */}
                      {previewStage === 5 && (
                        <motion.g
                          id="stage-tree"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <path d="M 100 68 L 100 40" fill="none" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
                          <path d="M 97 50 Q 82 44 76 48" fill="none" stroke="#5D4037" strokeWidth="2.5" />
                          <path d="M 103 46 Q 118 42 124 45" fill="none" stroke="#5D4037" strokeWidth="2.5" />
                          <circle cx="100" cy="24" r="26" fill="#1B5E20" />
                          <circle cx="76" cy="36" r="18" fill="#2E7D32" />
                          <circle cx="124" cy="36" r="18" fill="#388E3C" />
                          <circle cx="100" cy="14" r="16" fill="#4CAF50" />
                          <circle cx="88" cy="22" r="12" fill="#8BC34A" opacity="0.9" />
                          <circle cx="112" cy="22" r="12" fill="#C5E1A5" opacity="0.85" />
                        </motion.g>
                      )}

                      {/* Stage 6 (Guardian): Majestic Pine design + gold aura rings + Gold crown */}
                      {previewStage === 6 && (
                        <motion.g
                          id="stage-guardian"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <path d="M 100 68 L 100 44" fill="none" stroke="#4E342E" strokeWidth="7" strokeLinecap="round" />
                          <polygon points="100,5 135,46 65,46" fill="#1B5E20" />
                          <polygon points="100,-8 128,28 72,28" fill="#2E7D32" />
                          <polygon points="100,-20 118,12 82,12" fill="#4CAF50" />
                          <polygon points="100,-32 108,-4 92,-4" fill="#8BC34A" />
                          <circle cx="100" cy="15" r="42" fill="none" stroke="#FFD54F" strokeWidth="1.5" strokeDasharray="5,4" className="animate-[spin_16s_linear_infinite]" style={{ transformOrigin: "100px 15px" }} />
                          <path d="M 94 -34 L 100 -42 L 106 -34 L 103 -31 L 97 -31 Z" fill="#FFE082" stroke="#FFB300" strokeWidth="1" />
                          <circle cx="100" cy="-44" r="1.5" fill="#FF8F00" />
                        </motion.g>
                      )}
                    </>
                  )}

                  {/* PRIVACY SYSTEM: Leaf branch shields eyes softly on password focus */}
                  <motion.g
                    id="privacy-leaf-blocker"
                    initial={{ y: 80, x: -60, scale: 0, opacity: 0 }}
                    animate={{
                      y: focusedField === "password" ? 22 : 80,
                      x: focusedField === "password" ? 18 : -60,
                      scale: focusedField === "password" ? 1 : 0,
                      opacity: focusedField === "password" ? 1 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 90, damping: 15 }}
                  >
                    {/* Gentle shield leaf twig */}
                    <path
                      d="M 50 150 C 58 130, 72 110, 85 102"
                      fill="none"
                      stroke="#A1887F"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 85 102 C 60 92, 60 112, 85 102 Z"
                      fill="#4CAF50"
                      opacity="0.95"
                    />
                    {/* Small extra leaf protection */}
                    <path
                      d="M 74 116 C 54 112, 58 126, 74 116 Z"
                      fill="#8BC34A"
                      opacity="0.9"
                    />
                  </motion.g>

                </motion.g>
              </svg>
            </div>

            {/* Bubble dialogue assistant message text */}
            <div className="mt-4 text-center max-w-xs px-2">
              <div className="bg-white border border-[#E8F5E9] py-2 px-4.5 rounded-2xl shadow-[0_2px_12px_rgba(46,125,50,0.01)] text-xs font-semibold text-emerald-800 inline-block transition-all">
                {isSuccess ? (
                  <span className="flex items-center gap-1">
                    ✨ <strong className="font-extrabold text-[#2E7D32]">Nurturing your Sprout!</strong>
                  </span>
                ) : isError ? (
                  <span className="text-red-700 font-bold">Please check the credentials field below.</span>
                ) : focusedField === "password" ? (
                  <span className="flex items-center gap-1 text-gray-500">🔒 Guarding your password privacy screen...</span>
                ) : focusedField === "name" ? (
                  <span>👋 Hello! What is your name?</span>
                ) : focusedField === "email" ? (
                  <span>☀️ Preparing your personalized green path...</span>
                ) : (
                  <span>🌱 Your habit journey starts from a single seed.</span>
                )}
              </div>
            </div>

            {/* Premium Seed Progression Stages (Stage 1 to 6) */}
            <div className="w-full z-10 max-w-md mt-4 pt-4 border-t border-[#E8F5E9] space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block text-center select-none">
                Mascot Evolution Milestones (Click to Preview)
              </span>
              <div className="grid grid-cols-6 gap-1 text-center font-bold">
                
                {/* Stage 1 */}
                <button
                  type="button"
                  onClick={() => setPreviewStage(1)}
                  className={`space-y-1 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#2E7D32]/20 rounded-xl p-1 pb-1.5 ${
                    previewStage === 1 ? "opacity-100 bg-[#E8F5E9]/30" : "opacity-50 hover:opacity-85"
                  }`}
                >
                  <div className={`mx-auto w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-[10px] ${
                    previewStage === 1 ? "border-2 border-[#2E7D32] shadow-sm transform scale-110" : "border border-gray-200"
                  }`}>
                    🟤
                  </div>
                  <span className={`text-[8px] block ${previewStage === 1 ? "text-[#2E7D32] font-black" : "text-gray-500"}`}>1. Seed</span>
                </button>

                {/* Stage 2 */}
                <button
                  type="button"
                  onClick={() => setPreviewStage(2)}
                  className={`space-y-1 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#2E7D32]/20 rounded-xl p-1 pb-1.5 ${
                    previewStage === 2 ? "opacity-100 bg-[#E8F5E9]/30" : "opacity-50 hover:opacity-85"
                  }`}
                >
                  <div className={`mx-auto w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[10px] ${
                    previewStage === 2 ? "border-2 border-[#2E7D32] shadow-sm transform scale-110" : "border border-gray-200"
                  }`}>
                    🌱
                  </div>
                  <span className={`text-[8px] block ${previewStage === 2 ? "text-[#2E7D32] font-black" : "text-gray-500"}`}>2. Sprout</span>
                </button>

                {/* Stage 3 */}
                <button
                  type="button"
                  onClick={() => setPreviewStage(3)}
                  className={`space-y-1 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#2E7D32]/20 rounded-xl p-1 pb-1.5 ${
                    previewStage === 3 ? "opacity-100 bg-[#E8F5E9]/30" : "opacity-50 hover:opacity-85"
                  }`}
                >
                  <div className={`mx-auto w-6 h-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[10px] ${
                    previewStage === 3 ? "border-2 border-[#2E7D32] shadow-sm transform scale-110" : "border border-gray-200"
                  }`}>
                    🌿
                  </div>
                  <span className={`text-[8px] block ${previewStage === 3 ? "text-[#2E7D32] font-black" : "text-gray-500"}`}>3. Plant</span>
                </button>

                {/* Stage 4 */}
                <button
                  type="button"
                  onClick={() => setPreviewStage(4)}
                  className={`space-y-1 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#2E7D32]/20 rounded-xl p-1 pb-1.5 ${
                    previewStage === 4 ? "opacity-100 bg-[#E8F5E9]/30" : "opacity-50 hover:opacity-85"
                  }`}
                >
                  <div className={`mx-auto w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] ${
                    previewStage === 4 ? "border-2 border-[#2E7D32] shadow-sm transform scale-110" : "border border-gray-200"
                  }`}>
                    🌳
                  </div>
                  <span className={`text-[8px] block ${previewStage === 4 ? "text-[#2E7D32] font-black" : "text-gray-500"}`}>4. Young</span>
                </button>

                {/* Stage 5 */}
                <button
                  type="button"
                  onClick={() => setPreviewStage(5)}
                  className={`space-y-1 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#2E7D32]/20 rounded-xl p-1 pb-1.5 ${
                    previewStage === 5 ? "opacity-100 bg-[#E8F5E9]/30" : "opacity-50 hover:opacity-85"
                  }`}
                >
                  <div className={`mx-auto w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] ${
                    previewStage === 5 ? "border-2 border-[#2E7D32] shadow-sm transform scale-110" : "border border-gray-200"
                  }`}>
                    🌲
                  </div>
                  <span className={`text-[8px] block ${previewStage === 5 ? "text-[#2E7D32] font-black" : "text-gray-500"}`}>5. Tree</span>
                </button>

                {/* Stage 6 */}
                <button
                  type="button"
                  onClick={() => setPreviewStage(6)}
                  className={`space-y-1 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#2E7D32]/20 rounded-xl p-1 pb-1.5 ${
                    previewStage === 6 ? "opacity-100 bg-[#E8F5E9]/30" : "opacity-50 hover:opacity-85"
                  }`}
                >
                  <div className={`mx-auto w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[10px] ${
                    previewStage === 6 ? "border-2 border-[#2E7D32] shadow-sm transform scale-110" : "border border-teal-200"
                  }`}>
                    👑
                  </div>
                  <span className={`text-[8px] block ${previewStage === 6 ? "text-[#2E7D32] font-black" : "text-gray-500"}`}>6. Guard</span>
                </button>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE (45% ON DESKTOP): PREMIUM SIGN-IN FORM */}
          <motion.div 
            className="col-span-1 md:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-white relative"
            animate={isError ? {
              x: [0, -6, 6, -6, 6, 0]
            } : {}}
            transition={{ duration: 0.45 }}
            key={shakeTrigger}
          >
            <div className="my-auto space-y-6">
              
              {/* Branding and Tagline header */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full uppercase tracking-widest inline-block select-none">
                  Sustained Growth
                </span>
                <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                  Welcome back
                </h2>
                <p className="text-sm font-medium text-[#6B7280] leading-relaxed">
                  Sign in to plant your daily habits, conserve water, and expand your forest.
                </p>
              </div>

              {/* Action Inputs Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* User First Name field */}
                <div className="space-y-1">
                  <label htmlFor="login-name" className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block">
                    Your First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="login-name"
                      type="text"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-150 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/5 rounded-2xl font-semibold outline-none transition-all text-base placeholder-gray-400"
                      placeholder="e.g. Sarah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      maxLength={18}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1">
                  <label htmlFor="login-email" className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-150 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/5 rounded-2xl font-semibold outline-none transition-all text-base placeholder-gray-400"
                      placeholder="sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label htmlFor="login-password" className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block flex justify-between items-center">
                    <span>Password</span>
                    <span className="text-[10px] text-gray-400 font-bold lowercase">🔒 fully encrypted</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-150 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/5 rounded-2xl font-semibold outline-none transition-all text-base placeholder-gray-400"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                {/* Alerts and success glowers */}
                <AnimatePresence mode="wait">
                  {isError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="bg-red-50/70 border border-red-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 font-bold"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      <span>Oops, let's try again. {errorMessage}</span>
                    </motion.div>
                  )}
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#E8F5E9] border border-emerald-200 p-4 rounded-2xl flex items-center justify-center gap-2 text-center text-sm text-[#2E7D32] font-extrabold shadow-sm"
                    >
                      <Sparkles className="w-4.5 h-4.5 text-[#2E7D32] animate-pulse" />
                      <span>Welcome back to GreenSteps 🌱</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Big Form CTA button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSuccess}
                  className="w-full mt-2 bg-[#2E7D32] hover:bg-[#25632a] text-white py-4.5 rounded-2xl font-bold text-base transition-all shadow-[0_4px_16px_rgba(46,125,50,0.1)] active:scale-[0.99] disabled:opacity-80 flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  {isSuccess ? (
                    <span>Growing Sprout...</span>
                  ) : (
                    <>
                      <span>Let's Begin</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Premium wellness style tag line */}
            <div className="mt-8 pt-4 border-t border-gray-105 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider select-none">
              GreenSteps • Calm. Trustworthy. Balanced • Ages 15 to 75
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide-over Vision panel modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-[#1F2937]/30 backdrop-blur-sm z-50 flex items-center justify-center p-6 bg-slate-950/40">
          <div className="bg-white rounded-[32px] p-6 border border-[#E8F5E9] w-full max-w-sm space-y-4 shadow-xl animate-scale-in">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <Leaf className="w-5 h-5 fill-current text-[#2E7D32]" />
              <h3 className="text-lg font-extrabold text-[#1F2937]">About GreenSteps</h3>
            </div>
            
            <p className="text-xs text-[#6B7280] leading-relaxed">
              We focus on building gentle, sustainable daily habits. No complex carbon formulas or stress. Just minor, highly regular positive steps.
            </p>

            <div className="space-y-2.5 text-xs font-bold text-[#1F2937]">
              <div className="flex gap-2.5 items-center bg-[#FFFDF8] p-2.5 rounded-xl border border-amber-50">
                <span>🟤</span>
                <span>Grow your own seed into a Forest Guardian</span>
              </div>
              <div className="flex gap-2.5 items-center bg-[#FFFDF8] p-2.5 rounded-xl border border-amber-50">
                <span>⚡</span>
                <span>Track standby energy and electricity saves</span>
              </div>
              <div className="flex gap-2.5 items-center bg-[#FFFDF8] p-2.5 rounded-xl border border-amber-50">
                <span>💧</span>
                <span>Conserve home pipes and reduce water waste</span>
              </div>
              <div className="flex gap-2.5 items-center bg-[#FFFDF8] p-2.5 rounded-xl border border-amber-50">
                <span>🗑️</span>
                <span>Reduce everyday kitchen food garbage & compost</span>
              </div>
            </div>

            <button
              onClick={() => setShowLearnMore(false)}
              className="w-full bg-[#2E7D32] hover:bg-[#25632a] text-white py-3 rounded-2xl font-bold active:scale-95 transition-all text-xs cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
