
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Sun, CloudSun } from "lucide-react";

interface AnimatedSunLoaderProps {
  duration?: number; // ms
  onComplete: () => void;
  onSkip?: () => void;
  subtext?: string;
}

const BG_START = "linear-gradient(to top, #fef6f9 0%, #e5deff 100%)";
const BG_END = "linear-gradient(to top, #dbeafe 0%, #c7d7fc 100%)";
const SUN_GRADIENT = "linear-gradient(135deg, #ffd799 0%, #ffb347 100%)";

// Utility: Sparkle
const Sparkle: React.FC<{ left: string; top: string; delay: number }> = ({ left, top, delay }) => (
  <motion.div
    className="absolute rounded-full bg-white opacity-60"
    style={{ width: 8, height: 8, left, top, filter: "blur(1px)" }}
    animate={{
      scale: [1, 1.25, 1],
      opacity: [0.4, 0.85, 0.4],
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const AnimatedSunLoader: React.FC<AnimatedSunLoaderProps> = ({
  duration = 3000,
  onComplete,
  onSkip,
  subtext = "Your mind deserves this pause.",
}) => {
  const controls = useAnimation();
  const bgControls = useAnimation();
  const textControls = useAnimation();

  useEffect(() => {
    // Start with sun much lower (40px below final position)
    // and fade in while it rises over 3-4 seconds
    controls.start({
      y: [120, 0], // Sun rises from lower (120px offset) to final position
      opacity: [0, 1],
      transition: { 
        duration: duration / 750, // Slightly longer animation (4 seconds)
        ease: "easeOut"
      },
    });
    
    bgControls.start({
      background: [BG_START, BG_END],
      transition: { duration: duration / 1000, ease: "easeInOut" },
    });

    // Delayed text fade-in
    textControls.start({
      opacity: [0, 1],
      y: [10, 0],
      transition: { delay: 0.5, duration: 0.8 }
    });

    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onComplete, controls, bgControls, textControls]);

  // Give users an option to skip for accessibility
  const handleSkip = () => {
    if (onSkip) onSkip();
    onComplete();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-end min-h-72 h-72 relative w-full select-none"
      initial={false}
      animate={bgControls}
      style={{
        background: BG_START,
        borderRadius: "1.25rem",
        overflow: "hidden",
      }}
    >
      {/* Cloud icons (top left/right, optional floating) */}
      <motion.div
        className="absolute left-8 top-6 z-10"
        initial={{ opacity: 0.55, y: 0 }}
        animate={{ opacity: [0.55, 0.7, 0.55], y: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSun size={36} className="text-blue-200 drop-shadow" />
      </motion.div>
      <motion.div
        className="absolute right-10 top-0 z-10"
        initial={{ opacity: 0.45, y: 0 }}
        animate={{ opacity: [0.45, 0.6, 0.45], y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSun size={27} className="text-blue-100" />
      </motion.div>

      {/* Sparkles (optional, subtle) */}
      <Sparkle left="55%" top="32%" delay={0.3} />
      <Sparkle left="38%" top="23%" delay={0.7} />
      <Sparkle left="70%" top="42%" delay={1.6} />
      <Sparkle left="23%" top="48%" delay={1.1} />

      {/* Sun + rays */}
      <motion.div
        className="absolute left-1/2 bottom-24"
        animate={controls}
        initial={{ y: 120, opacity: 0 }}
        style={{ transform: "translateX(-50%)" }}
      >
        {/* Outer glow ring (pulsing) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            left: -15, // Center it around the sun
            top: -15,
            background: "radial-gradient(circle, rgba(255,193,7,0.15) 0%, rgba(255,247,237,0) 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Rays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [0.98, 1.12, 0.98],
            opacity: [0.75, 1, 0.75],
            rotate: [0, 60, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-32 h-32 rounded-full border-4 border-yellow-100 border-t-yellow-400 border-b-yellow-200 shadow-lg" />
        </motion.div>
        
        {/* Sun */}
        <motion.div
          className="flex items-center justify-center"
          style={{
            width: 90,
            height: 90,
            borderRadius: 9999,
            background: SUN_GRADIENT,
            boxShadow: "0 0 40px rgba(255, 193, 7, 0.3), 0 0 0 16px #fdecc882", // Added warm glow
            zIndex: 1,
            border: "2px solid #fffdf3",
            overflow: "visible",
          }}
          initial={{ scale: 0.97 }}
          animate={{
            scale: [0.97, 1.01, 0.97],
            filter: [
              "drop-shadow(0px 0px 0px #ffd180bb)",
              "drop-shadow(0px 0px 13px #ffd180eb)",
              "drop-shadow(0px 0px 0px #ffd180bb)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sun className="text-yellow-500 drop-shadow-lg" size={48} />
        </motion.div>
      </motion.div>

      {/* Transition Message */}
      <motion.div
        className="absolute w-full flex flex-col items-center bottom-7"
        initial={{ opacity: 0, y: 10 }}
        animate={textControls}
      >
        <div className="text-lg md:text-xl font-medium text-skyhug-600 drop-shadow-sm leading-relaxed">
          Taking a breath before we begin…
        </div>
        <div className="text-sm text-blue-500 mt-1">{subtext}</div>
        <button
          onClick={handleSkip}
          className="mt-4 px-4 py-1.5 rounded-full bg-white/80 shadow-sm text-gray-500 hover:text-blue-600 text-xs font-medium border border-blue-50 transition-colors"
        >
          Start now
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedSunLoader;
