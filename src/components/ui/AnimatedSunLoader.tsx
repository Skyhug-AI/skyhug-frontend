
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, animate } from "framer-motion";
import { Sun } from "lucide-react";
import CloudBackground from "@/components/CloudBackground";

// Use soft sun color and gradient
const BG_START = "linear-gradient(to top, #fef6f9 0%, #e5deff 100%)";
const BG_END = "linear-gradient(to top, #dbeafe 0%, #c7d7fc 100%)";
const SUN_GRADIENT = "linear-gradient(135deg, #ffd799 0%, #ffb347 100%)";
const PULSE_COLOR = "#ffecd2";
const CHIME_SOUND_URL = "https://cdn.pixabay.com/audio/2022/10/16/audio_12ad6099c7.mp3"; // royalty-free, soft chime

interface AnimatedSunLoaderProps {
  duration?: number; // ms
  onComplete: () => void;
  onSkip?: () => void;
  subtext?: string;
}

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
  const sunY = useMotionValue(120); // sun starts lower now
  const [textVisible, setTextVisible] = useState(false);
  const [sunProgress, setSunProgress] = useState(0); // 0 to 1 as sun rises
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    controls.start({
      y: [120, 5],
      transition: { duration: duration / 1000, ease: "easeInOut" }
    });
    bgControls.start({
      background: [BG_START, BG_END],
      transition: { duration: duration / 1000, ease: "easeInOut" }
    });
    // Animate sunProgress from 0→1 for parallax effect
    const controlsAnim = animate(0, 1, {
      duration: duration / 1000,
      onUpdate: v => setSunProgress(v),
      ease: [0.42,0,0.58,1] // easeInOut
    });

    const textTimeout = setTimeout(() => setTextVisible(true), 500);
    const timeout = setTimeout(() => {
      // Play chime before completing
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {}); // ignore if user gesture needed
      }
      setTimeout(onComplete, 520); // let chime play briefly (~0.5s)
    }, duration);

    return () => {
      clearTimeout(timeout);
      clearTimeout(textTimeout);
      controlsAnim.stop();
    };
  }, [duration, onComplete, controls, bgControls]);

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
      {/* Floating dots/clouds in background */}
      <CloudBackground sunProgress={sunProgress} />
      
      {/* Sun group (glow + sun + rays) */}
      <motion.div
        className="absolute left-1/2"
        style={{ transform: "translateX(-50%)" }}
        animate={controls}
        initial={{ y: 120 }}
      >
        {/* Pulsing radial glow (sunbeam) */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 175,
            height: 175,
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 50%, ${PULSE_COLOR} 0%, #ffeab70f 63%, transparent 97%)`,
            position: "absolute",
            zIndex: 0,
            filter: "blur(3px)",
            transform: "translate(-50%, -50%)",
            // Each pulse grows slightly
          }}
          animate={{
            scale: [0.97, 1.1, 0.97],
            opacity: [0.53, 0.7, 0.53]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Animated rays */}
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
        {/* Sun orb */}
        <motion.div
          className="flex items-center justify-center"
          style={{
            width: 90,
            height: 90,
            borderRadius: 9999,
            background: SUN_GRADIENT,
            boxShadow: "0 0 40px 0 #ffeab7, 0 0 0 16px #fdecc882",
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

      {/* Sparkles (same as before) */}
      <Sparkle left="55%" top="32%" delay={0.3} />
      <Sparkle left="38%" top="23%" delay={0.7} />
      <Sparkle left="70%" top="42%" delay={1.6} />
      <Sparkle left="23%" top="48%" delay={1.1} />
      {/* Soft skip button and fade-in text */}
      <motion.div
        className="absolute w-full flex flex-col items-center bottom-2"
        initial={false}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 10 }}
        transition={{ duration: 0.7, delay: textVisible ? 0.1 : 0.2 }}
      >
        <div className="text-base md:text-lg font-medium text-skyhug-600 drop-shadow-sm">
          Taking a breath before we begin…
        </div>
        <div className="text-xs text-blue-500 mt-1">{subtext}</div>
        <button
          onClick={handleSkip}
          className="mt-3 px-3 py-1 rounded-full bg-white/80 shadow text-gray-400 hover:text-blue-600 text-xs font-medium border border-blue-50 transition"
        >
          Skip
        </button>
      </motion.div>
      {/* Chime audio (hidden) */}
      <audio ref={audioRef} src={CHIME_SOUND_URL} preload="auto" />
    </motion.div>
  );
};

export default AnimatedSunLoader;
